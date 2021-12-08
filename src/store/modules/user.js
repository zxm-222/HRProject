import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login } from '@/api/user'
import { getUserInfo } from '@/api/user'
import { getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
// 状态
const state = {
  token: getToken(), // 设置token初始状态
  userInfo: {} // // 定义一个空的对象 不是null 因为后边开发userInfo的属性给别人用
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
  },
  // 设置用户信息
  setUserInfo (state, userInfo) {
    // state.userInfo = userInfo
    state.userInfo = { ...userInfo } // 使用浅拷贝的方式去赋值对象 （数据更新之后 才会触发组件的更新）
  },
  // 删除用户的信息
  removeUserInfo (state) {
    state.userInfo = {}
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
    // 写入时间戳
    // 将当前最新的时间写入缓存
    setTimeStamp()
  },
  // 获取用户资料action
  async getUserInfo (context) {
    const result = await getUserInfo() // 获取返回值 result 就是用户的基本资料
    const baseInfo = await getUserDetailById(result.userId) // 为了获取头像
    const baseResult = { ...result, ...baseInfo } // 将两个接口结果合并
    context.commit('setUserInfo', baseResult) // 将整个人的信息设置到用户的vuex数据中
    return result
  },
  // 登出的action
  logout (context) {
    // 删除token
    context.commit('removeToken') // 删除了vuex中的 还删除了缓存中的
    // 删除用户的资料
    context.commit('removeUserInfo')
    // 重置路由
    resetRouter()
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

