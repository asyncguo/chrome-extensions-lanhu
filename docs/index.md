# lanhu 插件

> 一款基于蓝湖工作流的 chrome 插件，支持切图自动上传 CDN

[插件链接](https://dl.zhuanstatic.com/fecommon/chrome-extension-lanhu.zip)

## Feature

- ✨ 切图自动上传 CDN，支持类型：image、zip
- 🗜️ 图片压缩：复用 tools 平台接口，在 node 层进行图片压缩
- 💾 持久存储
- 👀 可视化管理
- 📣 自动检测新版本，同时支持下载到本地指定目录

## Usage

- 是否开启自动上传功能，开启后在点击【下载切图】时会自动上传 CDN
- 是否关闭蓝湖默认下载，关闭后将不再将切图下载到本地

## Hack

- 如何保证插件 ID 的唯一性？（插件 ID 不一致时会导致存储数据的丢失）
  > 开发者模式，chrome 插件 id 是通过插件在本地目录的绝对路径生成的，保证插件路径不变就不会发生变化

- 如何实现插件的自动更新？
  > 未发布应用商品的插件无法借助浏览器自身的更新功能，需手动更新，目前可实现半自动更新。

## Todo

- [ ] 自定义链接地址：https://dashen.zhuanspirit.com/pages/viewpage.action?pageId=7443612
- [ ] css 样式 format 处理
- [ ] 自动识别为 zz-ui 组件？