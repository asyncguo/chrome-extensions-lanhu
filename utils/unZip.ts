import JSZip from "jszip";

interface FileData {
  filename: string,
  blob: Blob
}

/**
 * 解压 zip 文件
 */
const unZip = async (data): Promise<FileData[]> => {
  const zip = new JSZip();
  const zipData = await zip.loadAsync(data)

  const p = []
  zipData.forEach((relativePath, file) => {
    // 判断是否为目录
    if (!file.dir) {
      p.push(
        zip
          .file(file.name)
          .async('uint8array')
          .then((u8) => ({
            filename: file.name,
            blob: new Blob([u8])
          }))
      )
    }
  })

  const u8ArrRes = await Promise.all(p)

  return u8ArrRes
}

export {
  unZip
}
