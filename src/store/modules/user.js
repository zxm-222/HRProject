import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'

// 状态
const state = {
  token: getToken() // 设置token初始状态
}
// 修改状态
const mutations = {
  // 设置token
  setToken (state, token) {
    state.token = token // 设置token只是修改state的数据
    setToken(token) // vuex 和 缓存的数据同步
  },
  // 删除缓存
  removeToken (state) {
    state.token = null // 删除vuex和token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  }
}
// 执行异步
const actions = {
  // 经过响应拦截器的处理之后 这里的result实际上就是 token
  // 定义login action 同样需要参数 调用action时 传递过来的参数
  async login (context, data) {
    const result = await login(data)
    // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    // 现在有用户token
    // actions 修改state 必须通过mutations
    context.commit('setToken', result)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

