import type { PlasmoCSConfig } from "plasmo"
import { unZip, uploadPic } from "~utils";

export const config: PlasmoCSConfig = {
  matches: ["https://lanhuapp.com/*"]
}

interface IFileData {
  /** 文件名称 */
  filename: string
  /** 文件流 */
  blob: Blob
}

window.addEventListener('message', async (e) => {
  const { filename, blob } = e.data as IFileData

  if (blob) {
    const { type } = blob

    if (type === 'application/zip') {
      const zipInfo = await unZip(blob)

      console.log('zipInfo',zipInfo);
      
    } else {
      const res = await uploadPic(blob)

      console.log('ressssss',res);
      
    }
  }
})
