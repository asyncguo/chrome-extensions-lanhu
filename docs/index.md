## Popup 层

- 是否开启自动上传功能
- 是否关闭蓝湖默认下载


- 检测是否有新版本发布
## 核心功能

- 支持类型：image、zip
- 压缩：复用 tools 平台接口，在 node 层进行图片压缩
- 持久存储：IndexedDB
- 可视化管理：antd、procomponent

## TODO

- [ ] 自定义链接地址：https://dashen.zhuanspirit.com/pages/viewpage.action?pageId=7443612


## HACK

- 如何保证插件 ID 的唯一性？（插件 ID 不一致时会导致存储数据的丢失）
  > 开发者模式，chrome 插件 id 是通过插件在本地目录的绝对路径生成的，保证插件路径不变就不会发生变化

- 如何实现插件的自动更新？
  > 未发布应用商品的插件无法借助浏览器自身的更新功能，需手动更新。


