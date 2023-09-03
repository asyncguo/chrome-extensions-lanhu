/**
 * 获取图片尺寸
 * @param url 图片路径
 */
const getImageSize = async (url: string): Promise<number> => {
  const res = await fetch(url)
  const data = await res.blob()
  
  return data.size
}

export {
  getImageSize
}
