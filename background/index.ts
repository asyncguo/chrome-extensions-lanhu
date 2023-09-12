import { imagedb } from "~storage"
import { Storage } from "@plasmohq/storage"
import type { IImageUploadConfig } from "~popup";

const storage = new Storage();

/**
 * 代理蓝湖下载时的 a 标签的 dispatchEvent
 */
function aLinkProxy(imageDownloadConfig: IImageUploadConfig) {
  const originDispatchEvent: Function = EventTarget.prototype.dispatchEvent
  Object.defineProperty(HTMLAnchorElement.prototype, "dispatchEvent", {
    writable: true,
    configurable: true,
    enumerable: true,
    value: async function (event) {
      const nodeName = this.nodeName
      const href = this.href
      const filename = this.download
      // 开启自动上传才会走上传 CDN 功能
      if (
        imageDownloadConfig.autoUpload &&
        nodeName === "A" && 
        filename && /^blob:/.test(href)
      ) {
        console.warn(filename, href)
        console.warn('imageDownloadConfig', imageDownloadConfig);
        
        const blob = await fetch(href).then(r => r.blob());
        window.postMessage({
          blob,
          filename
        })
        // 关闭下载时，将不再把文件下载到本地
        if (imageDownloadConfig.closeDownload) {
          return false
        }
      }
      return originDispatchEvent.apply(this, [event])
    }
  })
}


chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (
    tab.status === "complete" &&
    /^https:\/\/lanhuapp\.com?/.test(tab.url || "")
  ) {
    const imageDownloadConfig = await storage.get<IImageUploadConfig>('image_upload_config')

    // console.log('debugger config=>>>>>>>',imageDownloadConfig);
    // 在指定的tab页下执行函数
    chrome.scripting
      .executeScript({
        func: aLinkProxy,
        target: { tabId },
        world: "MAIN",
        args: [imageDownloadConfig]
      })
      .catch((err) => {
        console.error(err)
      })
  }
})

chrome.runtime.onMessage.addListener(async (message, sender, senderResponse) => {
  const { type, payload } = message || {}
  switch (type) {
    case 'ADD_IMAGE':
      imagedb.add({
        ...payload
      })
      break;
    case 'OPEN_TAB':
      chrome.tabs.create({
        url: "./tabs/image-record.html"
      })
    default:
      break;
  }
})
