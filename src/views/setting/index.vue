<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="名称" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev, pager, next"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:400px" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
            <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="roleForm.name" />
              </el-form-item>
              <el-form-item label="角色描述">
                <el-input v-model="roleForm.description" />
              </el-form-item>
            </el-form>
            <!-- 底部 -->
            <el-row slot="footer" type="flex" justify="center">
              <el-col :span="6">
                <el-button size="small" @click="btnCancel">取消</el-button>
                <el-button size="small" type="primary" @click="btnOK">确定</el-button>
              </el-col>
            </el-row>
          </el-dialog>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { addRole, deleteRole, getCompanyInfo, getRoleDetail, getRoleList, updateRole } from '@/api/setting'
import { mapGetters } from 'vuex'

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
      list: [], // 承接数组
      page: {
        // 页码相关数据
        page: 1,
        pagesize: 10,
        total: 0 // 总数
      },
      formData: {
        // 公司信息
      },
      showDialog: false,
      // 接收新增或者编辑的表单数据
      roleForm: {},
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  // 计算属性
  computed: {
    ...mapGetters(['companyId'])
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
   */
  created () {
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo()
  },
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted () {
  },
  // 组件方法
  methods: {
    async getRoleList () {
      const { total, rows } = await getRoleList(this.page)
      this.page.total = total
      this.list = rows
    },
    changePage (newPage) {
      // newPage当前点击的页码
      this.page.page = newPage
      this.getRoleList()
    },
    // 获取公司信息
    async getCompanyInfo () {
      this.formData = await getCompanyInfo(this.companyId)
    },
    // 删除角色
    async deleteRole (id) {
      // 进行提示
      try {
        await this.$confirm('确定删除该角色吗')
        // 点击确定 进入到下方
        await deleteRole(id) // 调用删除接口
        await this.getRoleList() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑角色
    async editRole (id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    async btnOK () {
      try {
        await this.$refs.roleForm.validate()
        // 校验通过 执行下面内容
        // 有id编辑 没id新增
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          // 新增
          await addRole(this.roleForm)
        }
        // 重新获取数据
        await this.getRoleList()
        this.$message.success('操作成功')
        this.showDialog = false
      } catch (err) {
        console.log(err)
      }
    },
    btnCancel () {
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style scoped lang="less">

</style>
