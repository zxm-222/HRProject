import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条插件
import 'nprogress/nprogress.css' // 进度条样式
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'
//
// NProgress.configure({ showSpinner: false }) // NProgress Configuration
//
const whiteList = ['/login', '/404'] // 定义白名单 所有不受权限控制的页面
router.beforeEach(async function (to, from, next) {
// 开启进度条
  NProgress.start()
  //
  //   // set page title
  //   document.title = getPageTitle(to.meta.title)
  //
  //   // determine whether the user has logged in
  //   const hasToken = getToken()
  // 判断有无token
  if (store.getters.token) {
    // 如果有token 判断是不是去登录页
    if (to.path === '/login') {
      // 去登录页 去主页
      next('/')
      //       NProgress.done()
    } else {
      if (!store.getters.userId) {
        // 如果没有id这个值 才会调用 vuex的获取资料的action
        // 写await 是为了想获取完资料再去放行
        await store.dispatch('user/getUserInfo')
      }
      next()
    }
  } else {
    //     没有token
    if (whiteList.indexOf(to.path) > -1) {
      //       如果找到 在名单里
      next()
    } else {
      next('/login') // 跳到登录页
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置守卫
router.afterEach(() => {
//   // finish progress bar
  NProgress.done() // 关闭进度条
})
