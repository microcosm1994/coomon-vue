<template>
  <el-form
    :model="ruleForm"
    ref="ruleForm"
    label-width="140px"
    size="mini"
    :hide-required-asterisk="true"
    :status-icon="true"
    class="demo-ruleForm">
    <el-form-item label="ID" prop="name">
      <el-input v-model="ruleForm.id" disabled></el-input>
    </el-form-item>
    <el-form-item label="英文名" prop="name">
      <el-input v-model="ruleForm.name" disabled></el-input>
    </el-form-item>
    <el-form-item label="中文名" prop="name">
      <el-input v-model="ruleForm.chinese" disabled></el-input>
    </el-form-item>
    <div style="text-align: center" v-if="datatype === 0">
      <el-button size="mini" type="danger" @click="del()">删除</el-button>
      <el-button size="mini" @click="cancel">取消</el-button>
    </div>
    <div style="text-align: center" v-if="datatype === 1">
      <el-button size="mini" type="danger" @click="foreverDel()">永久删除</el-button>
      <el-button size="mini" @click="cancel">取消</el-button>
    </div>
  </el-form>
</template>

<script>
  export default {
    name: 'put',
    data () {
      return {
        datatype: 0, //数据：0与回收站：1
        ruleForm: {}, // 页面数据
      }
    },
    computed: {
      // 获取要删除得数据
      delData: function () {
        return this.$store.state.delData
      },
      // 数据：0与回收站：1
      dataType: function () {
        return this.$store.state.dataType
      }
    },
    watch: {
      // 删除数据
      delData: function (n, o) {
        this.ruleForm = n
      },
      // 数据：0与回收站：1
      dataType: function (n, o) {
        this.datatype = n
      }
    },
    mounted () {
      this.datatype = this.dataType // 数据：0与回收站：1
      this.ruleForm = this.delData // 页面数据
    },
    methods: {
      // 回收站
      del() {
        this.$confirm('确认放到回收站？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }).then(() => {
          let delArr = this.ruleForm
          delArr.deleted = 1
          this.$http.post('/api/device/struct/put', delArr).then((response) => {
            if (response.status === 200) {
              this.$message({
                message: '数据已放入回收站',
                type: 'success'
              })
              this.$store.commit('modal', false)
            }
          })
        }).catch(action => {
          console.log(2);
        });
      },
      // 永久删除
      foreverDel () {
        this.$confirm('确认永久删除？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }).then(() => {
          let delArr = [this.ruleForm.id]
          this.$http.post('/api/device/struct/del', delArr).then((response) => {
            if (response.status === 200) {
              this.$message({
                message: '数据已永久删除',
                type: 'success'
              })
              this.$store.commit('modal', false)
            }
          })
        }).catch(action => {
          console.log(2);
        });
      },
      cancel() {
        this.$store.commit('modal', false)
      }
    }
  }
</script>
