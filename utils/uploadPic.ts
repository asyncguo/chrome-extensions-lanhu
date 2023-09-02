const addPrefix = (url: string): string => {
  return `https://pic${Math.ceil(Math.random() * 6)}.zhuanstatic.com/zhuanzh/${url}`
}

/**
 * 上传图片
 */
const uploadPic = async (file: Blob) => {
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
  uploadPic
}