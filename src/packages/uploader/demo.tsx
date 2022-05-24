import React, { useRef } from 'react'
import { Uploader, FileItem, FileType } from './uploader'
import Button from '@/packages/button'

interface uploadRefState {
  submit: () => void
}
const UploaderDemo = () => {
  const uploadRef = useRef<uploadRefState>(null)
  const uploadUrl = 'https://my-json-server.typicode.com/linrufeng/demo/posts'
  const formData = {
    custom: 'test',
  }
  const defaultFileList: FileType<string>[] = [
    {
      name: '文件1.png',
      url: 'https://m.360buyimg.com/babel/jfs/t1/164410/22/25162/93384/616eac6cE6c711350/0cac53c1b82e1b05.gif',
      status: 'success',
      message: '上传成功',
      type: 'image',
      uid: '123',
    },
    {
      name: '文件2.png',
      url: 'https://m.360buyimg.com/babel/jfs/t1/164410/22/25162/93384/616eac6cE6c711350/0cac53c1b82e1b05.gif',
      status: 'error',
      message: '上传失败',
      type: 'image',
      uid: '124',
    },
    {
      name: '文件3.png',
      url: 'https://m.360buyimg.com/babel/jfs/t1/164410/22/25162/93384/616eac6cE6c711350/0cac53c1b82e1b05.gif',
      status: 'uploading',
      message: '上传中...',
      type: 'image',
      uid: '125',
    },
  ]
  const fileToDataURL = (file: Blob): Promise<any> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = (e) => resolve((e.target as FileReader).result)
      reader.readAsDataURL(file)
    })
  }
  const dataURLToImage = (dataURL: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.src = dataURL
    })
  }
  const canvastoFile = (
    canvas: HTMLCanvasElement,
    type: string,
    quality: number
  ): Promise<Blob | null> => {
    return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), type, quality))
  }
  const onOversize = (files: File[]) => {
    console.log('oversize 触发 文件大小不能超过 50kb', files)
  }
  const onStart = () => {
    console.log('start 触发')
  }
  const onDelete = (file: FileItem, fileList: FileItem[]) => {
    console.log('delete 事件触发', file, fileList)
  }
  const beforeUpload = async (files: File[]) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    const base64 = await fileToDataURL(files[0])
    const img = await dataURLToImage(base64)
    canvas.width = img.width
    canvas.height = img.height
    context.clearRect(0, 0, img.width, img.height)
    context.drawImage(img, 0, 0, img.width, img.height)
    const blob = (await canvastoFile(canvas, 'image/jpeg', 0.5)) as Blob // quality:0.5可根据实际情况计算
    const f = await new File([blob], files[0].name, { type: files[0].type })
    return [f]
  }
  const submitUpload = () => {
    ;(uploadRef.current as uploadRefState).submit()
  }
  return (
    <>
      <div className="demo bg-w">
        <h2>基础用法</h2>
        <Uploader url={uploadUrl} start={onStart} />

        <h2>上传状态</h2>
        <Uploader
          url={uploadUrl}
          defaultFileList={defaultFileList}
          removeImage={onDelete}
          maximum="3"
          multiple
          uploadIcon="dongdong"
        />
        <h2>自定义上传样式</h2>
        <Uploader url={uploadUrl}>
          <Button type="success" size="small">
            上传文件
          </Button>
        </Uploader>
        <h2>直接调起摄像头（移动端生效）</h2>
        <Uploader url={uploadUrl} capture />
        <h2>上传状态</h2>
        <Uploader url={uploadUrl} multiple removeImage={onDelete} />
        <h2>限制上传数量5个</h2>
        <Uploader url={uploadUrl} multiple maximum="5" />
        <h2>限制上传大小（每个文件最大不超过 50kb）</h2>
        <Uploader url={uploadUrl} multiple maximize={1024 * 50} oversize={onOversize} />
        <h2>图片压缩（在beforeupload钩子中处理）</h2>
        <Uploader url={uploadUrl} multiple beforeUpload={beforeUpload} />
        <h2>自定义数据 FormData 、 headers </h2>
        <Uploader url={uploadUrl} data={formData} headers={formData} withCredentials />
        <h2>选中文件后，通过按钮手动执行上传 </h2>
        <Uploader url={uploadUrl} maximum="5" autoUpload={false} ref={uploadRef} />
        <br />
        <Button type="success" size="small" onClick={submitUpload}>
          执行上传
        </Button>
        <h2>禁用状态</h2>
        <Uploader disabled />
      </div>
    </>
  )
}

export default UploaderDemo
