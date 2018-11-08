<template>
  <el-form :model="ruleForm"
           ref="ruleForm"
           :rules="rules"
           label-width="140px"
           size="mini"
           :hide-required-asterisk="true"
           :status-icon="true"
           class="demo-ruleForm">
    <el-form-item label="英文名" prop="name">
      <el-input v-model="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="中文名" prop="chinese">
      <el-input v-model="ruleForm.chinese"></el-input>
    </el-form-item>
    <div style="text-align: center">
      <el-button size="mini" type="primary" @click="submitForm('ruleForm')">保存</el-button>
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
        ruleForm: {
          name: '',
          chinese: ''
        },
        rules: {
          name:  [
            { validator: check, trigger: 'blur' }
          ],
          chinese:  [
            { validator: check, trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {},
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let submitData = this.ruleForm
            this.$http.post('/api/device/struct/add', submitData).then((response) => {
              if (response.status === 200) {
                this.$message({
                  message: '添加成功',
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
