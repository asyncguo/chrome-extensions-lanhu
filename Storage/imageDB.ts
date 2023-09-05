import Dexie, { type Table } from 'dexie';

const omitNullOrUndefined = (rawData: Record<string, any>) => {
  const fiterData = {}
  for (const key in rawData) {
    if (rawData.hasOwnProperty(key) && rawData[key] != null) {
      fiterData[key] = rawData[key]
    }
  }

  return fiterData
}

export interface ImageEntry {
  id?: number;
  /** 图片名称 */
  filename: string;
  /** 图片路径 */
  cdn_url: string;
  /** 图片尺寸 */
  // size?: string;
  /** 原始大小 */
  origin_size: number;
  /** 压缩后大小 */
  zip_size: number;
  /** 上传时间 */
  upload_time: number;
}

export interface ImageQueryOptions {
  filename?: string;
  startTime?: number;
  endTime?: number;
  pageSize?: number;
  pageNumber?: number;
}

class ImageEntryDexie extends Dexie {
  images!: Table<ImageEntry>;

  constructor() {
    super('lanhu_images_db');
    this.version(1).stores({
      images: '++id, filename, cdn_url, origin_size, zip_size, upload_time' // Primary key and indexed props
    });
  }

  async add(payload: ImageEntry) {
    try {
      const res = await this.images.add({
        ...payload,
        upload_time: Date.now()
      })

      return res
    } catch (error) {
      throw error
    }
  }

  async find(query: ImageQueryOptions) {
    console.log('query',query);
      
    const { 
      filename,
      startTime,
      endTime,
      pageNumber,
      pageSize
    } = query
    const offset = (pageNumber - 1) * pageSize;

    const collection = this.images
      .filter(v => filename == null || filename == '' ? true : filename === v.filename)
      .filter(v => startTime == null ? true : v.upload_time >= startTime && v.upload_time <= endTime)
    const total = await collection.count()
    const data = await collection
      .reverse()
      .offset(offset)
      .limit(pageSize)
      .toArray()

    return {
      data,
      total
    }
  }

  async deleteById(id: number) {
    try {
      const res = await this.images.where('id').equals(id).delete()
      
      return res == 1 ? true : false
    } catch (error) {
      throw error
    }
  }

  async clearAll() {
    try {
      await this.images.clear()
      return true

    } catch (error) {
      throw error 
    }
  }
}

/** 通过 IndexedDB 对已上传的图片进行存储 */
export const imagedb = new ImageEntryDexie();
