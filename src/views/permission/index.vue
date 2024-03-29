<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(1, '0')">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table border="" :data="list" row-key="id">
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button v-if="row.type === 1" type="text" @click="addPermission(2,row.id)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <!-- 放置一个弹层 用来编辑新增节点 -->
    <el-dialog :title="`${showText}权限点`" :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form ref="permForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, updatePermission, addPermission, getPermissionDetail, delPermission } from '@/api/permission'
import { tranListToTreeData } from '@/utils'

export default {
  // 组件名称
  name: '',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {},
  // 组件状态值
  data () {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false
    }
  },
  // 计算属性
  computed: {
    showText () {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
   */
  created () {
    this.getPermissionList()
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted () {
  },
  // 组件方法
  methods: {
    async getPermissionList () {
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
    // 删除操作
    async delPermission (id) {
      try {
        await this.$confirm('确定要删除该数据吗')
        await delPermission(id)
        await this.getPermissionList()
        this.$message.success('删除成功')
      } catch (e) {
        console.log(e)
      }
    },
    btnOK () {
      this.$refs.permForm.validate().then(() => {
        if (this.formData.id) {
          // 修改权限
          return updatePermission(this.formData)
        }
        // 添加权限
        return addPermission(this.formData)
      }).then(() => {
        // 提示消息
        this.$message.success('新增成功')
        this.getPermissionList()
        this.showDialog = false
      })
    },
    btnCancel () {
      this.formData = {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: '0' // 开启
      }
      this.$refs.permForm.resetFields()
      this.showDialog = false
    },
    addPermission (type, pid) {
      // 访问权限type等于1 按钮操作权限type等于2
      // pid 当前数据的父节点标识
      // 记录下当前添加的类型和父标识
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    async editPermission (id) {
      // 根据获取到的id 获取详情
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    }
  }
}
</script>

<style scoped lang="less">

</style>
