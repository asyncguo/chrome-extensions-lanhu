import { message } from "antd";
import type { PlasmoCSConfig } from "plasmo"
import type { ImageEntry } from "~Storage/imageDB";
import { getImageSize, unZip, uploadImage } from "~utils";

export const config: PlasmoCSConfig = {
  matches: ["https://lanhuapp.com/*"]
}

interface IFileData {
  /** 文件名称 */
  filename: string
  /** 文件流 */
  blob: Blob
}

interface UploadAndSaveImageParam {
  blob: Blob
  filename: string
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
  filename
}: UploadAndSaveImageParam) => {

  try {
    const res = await uploadImage(blob);
    const imageSize = await getImageSize(res);
  
    addImage({
      name: filename,
      cdn_url: res,
      origin_size: blob.size,
      zip_size: imageSize
    })
  } catch (error) {
    message.error(error.message);
  }
}

window.addEventListener('message', async (e) => {
  const { filename, blob } = e.data as IFileData

  if (blob) {
    const { type } = blob

    // uploadAndSaveImage({
    //   blob,
    //   filename
    // })
    // MOCK: 
    addImage({
      name: filename + Math.random() * 10000,
      cdn_url: 'https://' + filename + Math.random() * 10000,
      origin_size: Math.random() * 100000000,
      zip_size: Math.random() * 100000000
    })

    return 
    
    if (type === 'application/zip') {
      const zipInfo = await unZip(blob);

      console.log('zipInfo',zipInfo);

      for(const imageData of zipInfo) {
        uploadAndSaveImage({
          blob: imageData.data,
          filename: imageData.filename,
        })
      }
    } else {
      uploadAndSaveImage({
        blob,
        filename
      })
    }
  }
})
