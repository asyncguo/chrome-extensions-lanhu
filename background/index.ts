/**
 * 代理蓝湖下载时的 a 标签的 dispatchEvent
 */
function aLinkProxy() {
  const originDispatchEvent: Function = EventTarget.prototype.dispatchEvent
  Object.defineProperty(HTMLAnchorElement.prototype, "dispatchEvent", {
    writable: true,
    configurable: true,
    enumerable: true,
    value: async function (event) {
      const nodeName = this.nodeName
      const href = this.href
      const filename = this.download
      if (nodeName === "A" && filename && /^blob:/.test(href)) {
        console.warn(filename, href)
        const blob = await fetch(href).then(r => r.blob());
        window.postMessage({
          blob,
          filename
        })
        return false
      }
      return originDispatchEvent.apply(this, [event])
    }
  })
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    tab.status === "complete" &&
    /^https:\/\/lanhuapp\.com?/.test(tab.url || "")
  ) {
    // 在指定的tab页下执行函数
    chrome.scripting
      .executeScript({
        func: aLinkProxy,
        target: { tabId },
        world: "MAIN",
        args: [tabId]
      })
      .catch((err) => {
        console.error(err)
      })
  }
})
