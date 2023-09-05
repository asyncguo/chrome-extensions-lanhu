import { Col, Form, List, Row, Switch } from "antd"
import { SettingOutlined } from "@ant-design/icons"
import { useStorage } from "@plasmohq/storage/hook"

import "antd/dist/reset.css"
import './index.less'
import { useDebounceFn } from "ahooks"

export interface IImageUploadConfig {
  /** 开启自动上传 CDN */
  autoUpload?: boolean
  /** 关闭蓝湖默认下载 */
  closeDownload?: boolean
}

function IndexPopup() {
  const [form] = Form.useForm()
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

        {/* <Col style={{ cursor: 'pointer' }}>
          <SettingOutlined />
          <span style={{ marginLeft: 6 }}>设置</span>
        </Col> */}
      </Row>
    </>
  )
}

export default IndexPopup
