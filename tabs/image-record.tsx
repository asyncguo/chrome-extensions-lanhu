import React, { useRef, useState } from 'react';
import { imagedb } from '~storage';
import type { ImageEntry } from '~storage/imagedb';
import { ProTable, type ProColumns, PageContainer, type ActionType } from '@ant-design/pro-components';
import "antd/dist/reset.css"
import ByteSize from '~components/ByteSize';
import CopyToClipboard from '~components/CopyToClipboard';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Space, message, theme, Image, Col, Row } from 'antd';
import dayjs from 'dayjs';

const { useToken } = theme

const ImageView = (props: React.PropsWithChildren<{
  url: string
  filename?: string
}>) => {
  const { url, filename } = props
  const [imageSize, setImageSize] = useState<{
    width?: number,
    height?: number
  }>();

  return (
    <Row gutter={16}>
      <Col>
        <Image
          width={64}
          height={64}
          src={url}
          style={{
            objectFit: 'contain',
            border: '1px solid rgba(0,0,0,.2)',
            borderRadius: '8px'
          }}
          onLoad={(el) => {
            const element = el.target as HTMLImageElement
            setImageSize({
              width: element.naturalWidth,
              height: element.naturalHeight
            })
          }}/>
      </Col>
      <Col>
        <div
          // style={{
          //   whiteSpace: 'nowrap',
          //   textOverflow: 'ellipsis',
          //   overflow: 'hidden'
          // }}
          >
            <span>链接：</span>
            {
              url
                ? <a
                    onClick={() => {
                      window.open(url)
                    }}>
                      {url}
                    </a>
                : '-'
            }
        </div>
        <div>名称：{filename}</div>
        <div>尺寸：{imageSize?.width} x {imageSize?.height}</div>
      </Col>
    </Row>
  )
}

function ImageRecord() {
  const { token } = useToken()
  const tableRef = useRef<ActionType>()

  const columns: ProColumns<ImageEntry>[] = [
    {
      dataIndex: 'filename',
      title: '图片名称',
      hideInTable: true
    },
    { 
      dataIndex: 'cdn_url',
      title: '图片信息',
      hideInSearch: true,
      ellipsis: true,
      render: (_, record) => {
        return (
          <ImageView url={record.cdn_url} filename={record.filename} />
        )
      }
    },
    { 
      dataIndex: 'origin_size',
      title: '原始大小',
      hideInSearch: true,
      render: (_, record) => {
        return <ByteSize size={record.origin_size}/>
      }
    },
    { 
      dataIndex: 'zip_size',
      title: '压缩后大小',
      hideInSearch: true,
      render: (_, record) => {
        return <ByteSize size={record.zip_size}/>
      }
    },
    {
      dataIndex: 'upload_time',
      title: '上传时间',
      valueType: 'dateTime',
      hideInSearch: true
    },
    {
      dataIndex: 'startTime',
      title: '上传时间',
      valueType: 'dateRange',
      search: {
        transform: (value: any) => ({ startTime: value[0], endTime: value[1] }),
      },
      hideInTable: true
    },
    { 
      title: '操作',
      valueType: 'option',
      fixed: 'right',
      width: 80,
      render: (_, record) => {
        return (
          <Space>
            <CopyToClipboard text={record.cdn_url} />
            <Popconfirm
              title="确定"
              description="是否删除该图片本地记录?"
              onConfirm={async () => {
                try {
                  const res = await imagedb.deleteById(record.id)
                  if (res) {
                    message.success('删除成功～')
                    tableRef.current.reload()
                  } else {
                    message.error('删除失败～')
                  }
                } catch (error) {
                  message.error(error.message)
                }
              }}
              okText="确定"
              cancelText="取消"
            >
              <DeleteOutlined
                style={{ color: token.colorPrimary }}/>
            </Popconfirm>
          </Space>
        )
      }
    },
  ];

  return (
    <PageContainer
      title='图片上传记录'>
      <ProTable
        rowKey='id'
        bordered
        actionRef={tableRef}
        columns={columns}
        request={async (params) => {
          console.log('params',params);
          const { current, pageSize, filename, startTime, endTime } = params
          
          const res = await imagedb.find({
            pageNumber: current,
            pageSize,
            filename,
            startTime: startTime ? dayjs(startTime + '00:00:00').valueOf() : null,
            endTime: endTime ? dayjs(endTime + '23:59:59').valueOf() : null
          })          

          return {
            success: true,
            data: res.data || [],
            total: res.total
          }
        }}
        pagination={{
          pageSize: 20
        }}
        scroll={{ x: 'max-content' }}
        toolbar={{
          settings: [
            <Popconfirm
              title="确定"
              description="是否清空本地已上传记录?"
              onConfirm={async () => {
                try {
                  const res = await imagedb.clearAll()
                  if (res) {
                    message.success('清空成功～')
                    tableRef.current.reload()
                  } else {
                    message.error('清空失败～')
                  }
                } catch (error) {
                  message.error(error.message)
                }
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button
                key="button"
                icon={<DeleteOutlined/>}
                danger
              >
                清空数据
              </Button>
            </Popconfirm>
            
          ]
        }}
        />
    </PageContainer>
  );
}

export default ImageRecord
