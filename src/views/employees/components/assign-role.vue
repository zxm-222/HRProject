<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <el-checkbox-group v-model="roleIds">
      <!--      分配角色选项-->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'

export default {
  // 组件名称
  name: 'AssignRole',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    // 使用用户的id来查询用户的角色信息
    userId: {
      type: String,
      default: null
    }
  },
  // 组件状态值
  data () {
    return {
      list: [], // 角色列表
      roleIds: []
    }
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
    this.getRoleList()
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted () {
  },
  // 组件方法
  methods: {
    // 获取所有角色
    async getRoleList () {
      const { rows } = await getRoleList()
      this.list = rows
    },
    // 获取用户当前角色
    async getUserDetailById (id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    async btnOK () {
      await assignRoles({ id: this.userId, roleIds: this.roleIds })
      this.$emit('update:showRoleDialog', false)
    },
    btnCancel () {
      // this.roleIds = []
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style scoped lang="less">

</style>
