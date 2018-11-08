<template>
  <el-form :model="ruleForm" :rules="datatype === 0 ? rules : null" ref="ruleForm" label-width="100px" size="mini" class="demo-ruleForm">
    <el-form-item label="ID" prop="id">
      <el-input v-model="ruleForm.id" disabled></el-input>
    </el-form-item>
    <el-form-item label="英文名" prop="name">
      <el-input v-model="ruleForm.name" :disabled="datatype === 1"></el-input>
    </el-form-item>
    <el-form-item label="中文名" prop="chinese">
      <el-input v-model="ruleForm.chinese" :disabled="datatype === 1"></el-input>
    </el-form-item>
    <div style="text-align: center"  v-if="datatype === 0">
      <el-button size="mini" type="primary" @click="submitForm('ruleForm')">修改</el-button>
      <el-button size="mini" @click="cancel">取消</el-button>
    </div>
    <div style="text-align: center" v-if="datatype === 1">
      <el-button size="mini" type="success" @click="submitForm('ruleForm')">恢复</el-button>
      <el-button size="mini" @click="cancel">取消</el-button>
    </div>
  </el-form>
</template>

<script>
  export default {
    name: 'put',
    data () {
      var check = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请填写数据'));
        } else {
          callback()
        }
      }
      return {
        datatype: 0, //数据：0与回收站：1
        ruleForm: {},
        rules: {
          name:  [
            { validator: check, trigger: 'blur' }
          ],
          chinese:  [
            { validator: check, trigger: 'blur' }
          ],
        }
      }
    },
    computed: {
      putData: function () {
        return this.$store.state.putData
      },
      // 数据：0与回收站：1
      dataType: function () {
        return this.$store.state.dataType
      }
    },
    watch: {
      putData: function (n, o) {
        this.ruleForm = n
      },
      // 数据：0与回收站：1
      dataType: function (n, o) {
        this.datatype = n
      }
    },
    mounted () {
      this.datatype = this.dataType
      this.ruleForm = this.putData
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let submitData = this.ruleForm
            // 如果是回收站数据则恢复数据
            if (this.datatype === 1) {
              submitData.deleted = 0
            }
            this.$http.post('/api/device/struct/put', submitData).then((response) => {
              if (response.status === 200) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$store.commit('modal', false)
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      cancel() {
        this.$store.commit('modal', false)
      }
    }
  }
</script>
