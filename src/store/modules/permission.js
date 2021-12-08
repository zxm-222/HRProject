// vuex的权限模块
import { constantRoutes, asyncRoutes } from '@/router'

// vuex中的permission模块 用来存放当前的 静态路由和当前用户的权限路由
const state = {
  routes: constantRoutes // 所有人拥有静态路由
}

const mutations = {
  // newRoutes 用户登录通过权限所得到的动态路由的部分
  setRoutes (state, newRoutes) {
    // 每次更新之后 都在静态路由的基础上进行添加
    state.routes = [...constantRoutes, ...newRoutes]
  }
}

const actions = {
  // 筛选权限路由
  // 第二个参数为当前用户的所拥有的菜单权限
  // menus: ["settings","permissions"]
  // asyncRoutes是所有的动态路由
  // asyncRoutes  [{path: 'setting',name: 'setting'},{}]
  filterRoutes (context, menus) {
    const routes = []
    // 筛选动态路由 和 menus 中能够对应上的路由
    menus.forEach(key => {
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    context.commit('setRoutes', routes) // 将动态路由提交给mutations
    return routes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
