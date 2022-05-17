import request from '@/utils/request'

export function createCase(params) {
  return request({
    url: '/api/v1/patent/create',
    method: 'post',
    data:params
  })
}

export function saveTechbg(params) {
  return request({
    url: '/api/v1/patent/tech_bg',
    method: 'post',
    data:params
  })
}
export function audioToText(params) {
  return request({
    url: '/api/v1/file/audio_to_text',
    method: 'get',
    params
  })
}
