import { CheckCircleTwoTone, CopyOutlined, LoadingOutlined } from "@ant-design/icons";
import { Image, Col, Drawer, List, Row, Space, Spin, message } from "antd";
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useState } from "react";
import ByteSize from "~components/ByteSize";
import CopyToClipboard from "~components/CopyToClipboard";
import type { ImageEntry } from "~storage/imagedb";
import { copyToClipboard, genUid, getImageSize, unZip, uploadImage } from "~utils";

export const config: PlasmoCSConfig = {
  matches: ["https://lanhuapp.com/*"]
}

interface IFileData {
  /** 文件名称 */
  filename: string
  /** 文件流 */
  blob: Blob
}

interface IImageType {
  /** 获取上传进度用到的唯一索引 */
  uid: string
  filename: string
  cdn_url?: string
  origin_size?: number
  zip_size?: number
}

interface UploadAndSaveImageParam {
  blob: Blob
  filename: string
  uid: string
}

const addImage = (payload: Omit<ImageEntry, 'upload_time'>) => {
  chrome.runtime.sendMessage({
    type: 'ADD_IMAGE',
    payload: {
      ...payload      
    }
  })
}

const uploadAndSaveImage = async ({
  blob,
  filename,
  uid,
}: UploadAndSaveImageParam) => {
  try {
    const res = await uploadImage(blob);
    const imageSize = await getImageSize(res);
    const imageRes = {
      filename,
      cdn_url: res,
      origin_size: blob.size,
      zip_size: imageSize
    }
    addImage(imageRes)
    return {
      ...imageRes,
      uid
    }
  } catch (error) {
    message.error(error.message);
  }
}

const UploadProgress = (props: React.PropsWithChildren<{
  dataSource: IImageType[]
}>) => {
  const { dataSource = [] } = props

  return (
    <List
      size='small'
      dataSource={dataSource}
      renderItem={(item) => (
        <List.Item
          actions={[
            <>
              {
                item.cdn_url
                  ? <CopyToClipboard text={item.cdn_url} />
                  : '-'
              }
            </>
          ]}
        >
          <List.Item.Meta
            avatar={
              item.cdn_url
                ? <Image
                    width={64}
                    height={64}
                    style={{ objectFit: 'contain' }}
                    src={item.cdn_url} />
                : 
                <Spin style={{ width: 64 }} size='large' />
            }
            title={item.filename}
            description={
              <Row>
                <Col span={24}>原始大小: <ByteSize size={item.origin_size} /></Col>
                <Col span={24}>压缩后大小: <ByteSize size={item.zip_size} /></Col>
              </Row>
            }
          />
        </List.Item>
      )}
    />
  )
}

const DownloadImage = () => {
  const [completed, setComplate] = useState(false)
  const [open, setOpen] = useState(false)
  const [imageList, setImageList] = useState<IImageType[]>()

  useEffect(() => {
    const hanleUploadImage = async (e) => {
      const { filename, blob } = e.data as IFileData
    
      if (blob) {
        let rawImageList: {
          filename: string
          blob: Blob
        }[] = []
        const { type } = blob
    
        if (type === 'application/zip') {
          const zipInfo = await unZip(blob);
          console.log('zipInfo',zipInfo);

          rawImageList = zipInfo.map(file => ({
            filename: file.filename,
            blob: file.blob
          }))
        } else {
          // 单个文件
          rawImageList = [{
            filename,
            blob
          }]
        }
        const waitUploadImages: IImageType[] = []
        const waitUploadImagesQueue = []
        
        for (const file of rawImageList) {
          const uid = genUid()
          
          waitUploadImages.push({
            uid,
            filename: file.filename,
            origin_size: file.blob.size
          })
  
          waitUploadImagesQueue.push(
            uploadAndSaveImage({
              uid,
              blob: file.blob,
              filename: file.filename
            }).then(res => {
              const needUptedIndex = waitUploadImages.findIndex(v => v.uid === res.uid)
              if (needUptedIndex > -1) {
                waitUploadImages[needUptedIndex] = {
                  ...res
                }
              }
    
              setImageList([...waitUploadImages])

              return res
            })
          )
        }
    
        setImageList([...waitUploadImages])
        setOpen(true)

        Promise.allSettled<IImageType>(waitUploadImagesQueue).then(async (uploadRes) => {
          setComplate(true)
          const uploadResStr = uploadRes
            .filter(v => v.status === 'fulfilled')
            .map((v: PromiseFulfilledResult<IImageType>) => v.value.cdn_url).join('\n')
          
          const res = await copyToClipboard(uploadResStr)
          if (res) {
            message.success('已将图片 CDN 链接复制到剪切板～')
          }
        })
      }
    }

    window.addEventListener('message', hanleUploadImage)
    return () => {
      window.removeEventListener('message', hanleUploadImage)
    }
  }, []);

  return (
    <Drawer
      title={
        completed
          ? <Space>
              <CheckCircleTwoTone twoToneColor="#52c41a" />
              <span>已完成</span>
            </Space>
          : <Space>
              <LoadingOutlined />
              <span>正在上传照片</span>
            </Space>
      }
      closeIcon={false}
      open={open}
      onClose={() => setOpen(false)}
      extra={
        <a onClick={() => {
          chrome.runtime.sendMessage({ type: 'OPEN_TAB' })
        }}>上传记录</a>
      }>
      <UploadProgress dataSource={imageList} />
    </Drawer>
  )
}
 
export default DownloadImage
