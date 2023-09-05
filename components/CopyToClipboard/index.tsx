import { CheckOutlined, CopyOutlined } from "@ant-design/icons"
import { message, theme } from "antd";
import { useEffect, useRef, useState } from "react";
import { CopyToClipboard as Copy } from 'react-copy-to-clipboard';

const { useToken } = theme

export interface ICopyToClipboardProps extends CopyToClipboard.Props {
}

/**
 * 复制
 */
const CopyToClipboard = (props: React.PropsWithChildren<ICopyToClipboardProps>) => {
  const {
    onCopy, 
    ...remainProps
  } = props
  const { token } = useToken()
  const [copied, setCopied] = useState(false)
  const copyIdRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cleanCopyId = () => {
    if (copyIdRef.current) {
      clearTimeout(copyIdRef.current)
    }
  }

  useEffect(() => cleanCopyId, [])

  return (
    <Copy
      {...remainProps}
      onCopy={(...args) => {
        setCopied(true)

        copyIdRef.current = setTimeout(() => {
          setCopied(false);
        }, 3000)

        if (onCopy) {
          onCopy(...args)
        } else {
          message.success('复制成功～')
        }
      }}>
        {
          copied
            ? <CheckOutlined style={{ color: token.colorPrimary }} />
            : <CopyOutlined style={{ color: token.colorPrimary }} />
        }
    </Copy>
  )
}

export default CopyToClipboard
