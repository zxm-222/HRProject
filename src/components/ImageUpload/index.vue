<template>
  <div>
    <el-upload
      list-type="picture-card"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
      :file-list="fileList"
      :class="{disabled: fileComputed}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!--    进度条-->
    <el-progress v-if="showPercent" style="width: 180px" :percentage="percent" />
    <el-dialog title="图片预览" :visible.sync="showDialog">
      <img :src="imgUrl" style="width: 100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKID65rOhmcEerqdCWcVAappb8RWMxKTPVMz',
  SecretKey: 'SgfRyJQIvJTO5Xl5LTPBi4B3g4D7nFXa'
})
export default {
  // 组件名称
  name: 'ImageUpload',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    limit: {
      type: Number,
      default: 1
    }
  },
  // 组件状态值
  data () {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFileUid: '',
      percent: 0,
      showPercent: false
    }
  },
  // 计算属性
  computed: {
    // 计算是否已经上传一张
    fileComputed () {
      return this.fileList.length === this.limit
    }
  },
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
    preview (file) {
      // 弹层 里面是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    // 删除文件
    handleRemove (file) {
      // file是点击删除的文件
      // 将原来的图片排除掉 剩下的就是最新的数组
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    // 添加文件
    // 修改文件时触发
    // 此时可以用fileList 因为该方法会进来很多遍 不能每次都去push
    // fileList因为fileList参数是当前传进来的最新参数 我们只需要将其转化成数组即可 需要转化成一个新的数组
    // [] => [...fileList] [] => fileList.map()
    // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
    changeFile (file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    // 上传之前检查
    beforeUpload (file) {
      // 文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        // 不存在
        this.$message.error('图片只能上传 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 文件大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片最大不能超过5M')
        return false
      }
      // 确定要上传的就是当前的file
      this.currentFileUid = file.uid
      return true
    },
    // 上传 params参数 file对象 是我们要长传的云服务器的内容
    upload (params) {
      if (params.file) {
        // 上传
        cos.putObject({
          Bucket: 'xiaomsw-1308639053',
          Region: 'ap-beijing',
          Key: params.file.name, // 文件名
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型
          // 进度条
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          // console.log(err || data)
          if (!err && data.statusCode === 200) {
            // 文件上传成功 要获取成功的返回地址
            // fileList才能显示到上传组件上 将fileList数据中的url地址变成现在上传成功的地址
            this.fileList = this.fileList.map(item => {
              // 找和刚才记录下来的id相等的uid
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url
                return { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 2000)
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>
