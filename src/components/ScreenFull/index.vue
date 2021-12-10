<template>
  <!--  放置图标-->
  <div>
    <!--    放置svg图标-->
    <svg-icon icon-class="fullscreen" style="color: #fff; width: 20px; height: 20px" @click="changeScreen" />
  </div>
</template>

<script>
import ScreenFull from 'screenfull'
export default {
  // 组件名称
  name: '',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data () {
    return {}
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
   */
  created () {
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted () {
  },
  // 组件方法
  methods: {
    // 改变全屏
    changeScreen () {
      if (!ScreenFull.isEnabled) {
        this.$message.warning('此时全屏组件不可用')
        return
      }
      // 如果可用 就全屏
      ScreenFull.toggle()
    }
  }
}
</script>

<style scoped lang="less">

</style>
