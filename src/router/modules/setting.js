// 导出属于员工的路由规则
import Layout from '@/layout'
// 每个子模块 其实 都是外层是layout  组件位于layout的二级路由里面
export default {
  path: '/setting', // 路径
  name: 'setting', // 给路由规则加一个name
  component: Layout, // 组件
  // 配置二级路由的路由表
  children: [{
    path: '', // 什么都不写 默认路由
    component: () => import('@/views/setting'),
    name: 'setting',
    meta: {
      title: '公司设置', // meta属性的里面的属性 随意定义 事用title 因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
      icon: 'setting'
    }
  }]
}
