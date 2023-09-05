const addPrefix = (url: string): string => {
  return `https://pic${Math.ceil(Math.random() * 6)}.zhuanstatic.com/zhuanzh/${url}`
}

const delay = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('https://pic2.zhuanstatic.com/zhuanzh/052569db-cfbf-4856-892a-2ef7ceb8ad88.png')
  }, Math.random() * 5000);
})

/**
 * 上传图片
 */
const uploadImage = async (file: Blob) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('path', '/zhuanzh/');
  try {
    const response = await fetch('https://tools.zhuanspirit.com/api/postMinPic', {
      method: 'POST',
      body: formData,
    })
    const res = await response.json()

    return addPrefix(res.respData)
  } catch (err) {
    throw err
  }
}

export {
  uploadImage
}