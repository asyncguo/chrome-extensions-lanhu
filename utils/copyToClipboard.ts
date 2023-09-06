/**
 * 复制到剪切板
 */
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {    
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.setAttribute('value',text)
    input.select()

    if (document.execCommand('copy')) {
      document.execCommand('copy')
    }
    document.body.removeChild(input)

    return true
  }
}

export {
  copyToClipboard
}