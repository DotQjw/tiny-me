import request from '@/utils/request'

export function uploadFile(data) {
  return request({
    url: '/api/v1/file/upload_file',
    method: 'post',
    data
  })
}

export function uploadAudio(data) {
  return request({
    url: '/api/v1/file/upload_audio',
    method: 'post',
    ContentType:'multipart/form-data',
    headers:{
      "ContentType":'multipart/form-data'
    },
    data
  })
}
