import React, { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { imageDB } from '~Storage';
import type { ImageEntry } from '~Storage/imageDB';
import { ProTable, type ProColumns, PageContainer } from '@ant-design/pro-components';
import "antd/dist/reset.css"

const Size = ({
  size
}:{
  size: number
}) => {
  if (!size) return '-'

  return (
    <>
      {Number(size / 1024).toFixed(2)} KB
    </>
  )
}

const columns: ProColumns<ImageEntry>[] = [
  { dataIndex: 'name', title: '图片名称' },
  { 
    dataIndex: 'cdn_url',
    title: '图片路径',
    hideInSearch: true,
    valueType: 'image',
  },
  { 
    dataIndex: 'origin_size',
    title: '原始大小',
    hideInSearch: true,
    render: (_, record) => {
      return <Size size={record.origin_size}/>
    }
  },
  { 
    dataIndex: 'zip_size',
    title: '压缩后大小',
    hideInSearch: true,
    render: (_, record) => {
      return <Size size={record.zip_size}/>
    }
  },
  {
    dataIndex: 'upload_time',
    title: '上传时间',
    valueType: 'dateTime'
  },
  { 
    title: '操作',
    valueType: 'option',
    render: (_, record) => {
      return (
        <a key='copy'>复制路径</a>
      )
    }
  },
];

function ImageRecord() {
  return (
    <PageContainer
      title='图片上传记录'>
      <ProTable
        rowKey='id'
        columns={columns}
        request={async (params) => {
          const res = await imageDB.find({
            pageNumber: params.current,
            pageSize: params.pageSize,
            updateTime: params.updateTime
          })          

          return {
            success: true,
            data: res.data || [],
            total: res.total
          }
        }}
        pagination={{
          pageSize: 10
        }}/>
    </PageContainer>
  );
}

export default ImageRecord