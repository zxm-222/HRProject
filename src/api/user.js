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

export function getUserInfo () {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

export function logout () {

}

// 获取用户的基本信息
export function getUserDetailById (id) {
  return request({
    url: `/sys/user/${id}`
  })
}

