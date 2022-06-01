import request from '@/utils/request'

export function createCase(params) {
  return request({
    url: '/api/v1/patent/create',
    method: 'post',
    data:params
  })
}
export function editCase(params) {
  return request({
    url: '/api/v1/patent/edit',
    method: 'post',
    data:params
  })
}

export function getList(params) {
  return request({
    url: '/api/v1/patent/list',
    method: 'get',
    params
  })
}
export function techArea(params) {
  return request({
    url: '/api/v1/patent/tech_area',
    method: 'post',
    data:params
  })
}
export function planOutline(params) {
  return request({
    url: '/api/v1/patent/plan_outline',
    method: 'post',
    data:params
  })
}
export function implementPlan(params) {
  return request({
    url: '/api/v1/patent/implement_plan',
    method: 'post',
    data:params
  })
}
export function patentDetail(params) {
  return request({
    url: '/api/v1/patent/detail',
    method: 'get',
    params
  })
}
export function saveTechbg(params) {
  return request({
    url: '/api/v1/patent/tech_bg',
    method: 'post',
    data:params
  })
}
// 第五步权利要求书
export function saveClaim(params) {
  return request({
    url: '/api/v1/patent/claim',
    method: 'post',
    data:params
  })
}
// 提交
export function submit(params) {
  return request({
    url: '/api/v1/patent/submit',
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

export function userSearch(params) {
  return request({
    url: '/api/v1/user/search',
    method: 'get',
    params
  })
}
