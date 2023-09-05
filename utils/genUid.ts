import { customAlphabet } from 'nanoid'

/** 生成唯一 id  */
const genUid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 16)

export {
  genUid
}