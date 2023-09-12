import { useEffect, useState } from "react"
import { Badge, Col, Form, Row, Switch } from "antd"
import { SettingOutlined } from "@ant-design/icons"
import { useStorage } from "@plasmohq/storage/hook"
import { fileSave } from 'browser-fs-access'
import { useDebounceFn } from "ahooks"

import "antd/dist/reset.css"
import './index.less'

import pkg from './../package.json'

export interface IImageUploadConfig {
  /** 开启自动上传 CDN */
  autoUpload?: boolean
  /** 关闭蓝湖默认下载 */
  closeDownload?: boolean
}

function IndexPopup() {
  const [form] = Form.useForm()
  const [hasNewVersion, setHasNewVersion] = useState(false);
  
  const [imageUploadConfig, setImageUploadConfig] = useStorage<IImageUploadConfig>(
    "image_upload_config", 
    (v) => {
      form.setFieldsValue(v)
      return v
    }
  )
  const { run: handleFormChange } = useDebounceFn(() => {
    setImageUploadConfig(form.getFieldsValue())

    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      chrome.tabs.update(
        tabs[0].id,
        {
          url: tabs[0].url
        }
      )
    })
  }, {
    wait: 500
  })

  useEffect(() => {
    fetch('https://feconf.zhuanzhuan.com/feconf/u?keys=chrome-extension-lanhu')
      .then(res => res.json())
      .then(res => {
        const { respData } = res

        if (respData.version && respData.version !== pkg.version) {
          setHasNewVersion(true)
        }
      })
  }, [])

  return (
    <>
      <div className="lanhu-popup">
        <Form
          className="popup-form"
          form={form}
          layout='inline'
          onValuesChange={handleFormChange}
          labelCol={{
            flex: 'none'
          }}
          wrapperCol={{
            flex: 1
          }}
        >
          <Form.Item
            label="是否开启自动上传 CDN "
            tooltip="开启后，文件将自动上传 CDN "
            name='autoUpload'
            valuePropName="checked">
              <Switch />
          </Form.Item>
          <Form.Item
            label="是否关闭蓝湖默认下载"
            tooltip="关闭后，不再将文件下载到本地"
            name='closeDownload'
            valuePropName="checked">
              <Switch />
          </Form.Item>
        </Form>
      </div>
      <Row
        style={{
          padding: 12,
          background: '#F5F7F9',
          fontSize: 14
        }}
        justify='space-between'
      >
        <Col>
          <a
            onClick={() => {
              chrome.tabs.create({
                url: "./tabs/image-record.html"
              })
            }}>图片记录</a>
        </Col>

        <Col style={{ cursor: 'pointer' }}>
          <span>v{pkg.version}</span>
          {/* <SettingOutlined /> */}
          {
            hasNewVersion
              ? <Badge dot>
                  <a
                    style={{ marginLeft: 6 }}
                    onClick={async () => {
                      try {
                        const response = await fetch('https://dl.zhuanstatic.com/fecommon/chrome-mv3-prod.zip', {
                          method: 'GET',
                        })
                        const zipBlob = await response.blob()
          
                        await fileSave(
                          zipBlob,
                          {
                            fileName: 'chrome-extension-lanhu'
                          }
                        )
                      } catch (err) {
                        throw err
                      }
                  }}>有更新</a>
                </Badge>
              : null
          }
        </Col>
      </Row>
    </>
  )
}

export default IndexPopup
