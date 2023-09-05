import React, { useMemo } from "react";

type ByteUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB'

export interface IByteSizeProps {
  /** 输入的大小，单位默认为 B，可通过 input 进行修改 */
  size: number;
  /** 输入单位 */
  input?: ByteUnit
  /** 输出单位 */
  output?: ByteUnit
}

const ByteSize = (props: React.PropsWithChildren<IByteSizeProps>) => {
  const { size, input = 'B', output = 'KB' } = props

  const outputSize = useMemo(() => {
    // TODO: 当前只处理 B => KB 的转换，后续补充。。。
    return Number(size / 1024).toFixed(2)
  }, [size, input, output])

  if (!size) return '-'

  return (
    <>
      {outputSize} {output}
    </>
  )
}

export default ByteSize;
