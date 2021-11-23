// import request from '@/utils/request'
//
// export function login(data) {
//   return request({
//     url: '/vue-admin-template/user/login',
//     method: 'post',
//     data
//   })
// }
//
// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }
//
// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }

import request from '@/utils/request'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {}
}

export function login (data) {
  // 返回一个axios对象 promise
  return request({
    url: '/sys/login', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'post',
    data
  })
}

export function getInfo (token) {

}

export function logout () {

}
