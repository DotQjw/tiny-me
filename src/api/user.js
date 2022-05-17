import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/v1/login',
    // url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}


