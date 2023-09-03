import Dexie, { type Table } from 'dexie';

export interface ImageEntry {
  id?: number;
  /** 图片名称 */
  name: string;
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
  pageNumber?: number;
  pageSize?: number;
  updateTime?: number;
}

class ImageEntryDexie extends Dexie {
  images!: Table<ImageEntry>;

  constructor() {
    super('lanhu_images_db');
    this.version(1).stores({
      images: '++id, name, cdn_url, origin_size, zip_size, upload_time' // Primary key and indexed props
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
    const { pageNumber, pageSize } = query
    const offset = (pageNumber - 1) * pageSize;
    const data = await this.images
      .reverse()
      .offset(offset)
      .limit(pageSize)
      .toArray()
    
    const total = await this.images.count()

    return {
      data,
      total
    }
  }
}

/** 通过 IndexedDB 对已上传的图片进行存储 */
export const imageDB = new ImageEntryDexie();
