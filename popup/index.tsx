import { useEffect, useState } from "react"
import { Col, Form, List, Row, Switch } from "antd"
import "antd/dist/reset.css"
import './index.less'
import { SettingOutlined } from "@ant-design/icons"

function IndexPopup() {
  const [form] = Form.useForm()

  const handleFormChange = () => {
    console.log('change form', form.getFieldsValue());
    const config = form.getFieldsValue()
    // localStorage.setItem('chrome_extensions_lanhu__config', JSON.stringify(config))
  }

  return (
    <>
      <div className="lanhu-popup">
        <Form
          form={form}
          layout='inline'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onValuesChange={handleFormChange}
        >
          <Form.Item
            label="是否开启自动上传"
            name='autoUpload'>
              <Switch/>
          </Form.Item>
          <Form.Item
            label="是否关闭蓝湖原始下载"
            name='closeDownload'>
              <Switch/>
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
          <SettingOutlined />
          <span style={{ marginLeft: 6 }}>设置</span>
        </Col>
      </Row>
    </>
  )
}

export default IndexPopup