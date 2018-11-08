<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-row :gutter="20">
        <el-col :span="6">
          <span>卡片名称</span>
        </el-col>
        <!--搜索部分-->
        <el-col :span="10">
          <search></search>
        </el-col>
        <el-col :span="8">
          <div style="text-align: right">
            <el-button @click="refresh" icon="el-icon-refresh" size="mini" type="primary">刷新</el-button>
            <el-button @click="batchRestore" icon="el-icon-plus" size="mini" type="success">批量恢复</el-button>
            <el-button @click="batchDel" icon="el-icon-delete" size="mini" type="danger">批量永久删除</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--表格数据-->
    <el-table
      :data="tableData"
      border
      stripe
      @selection-change="handleSelectionChange">
      style="width: 100%">
      <el-table-column
        type="selection"
        fixed="left"
        width="40">
      </el-table-column>
      <el-table-column
        fixed
        prop="id"
        label="ID"
        width="50"
        fixed="left"
        :show-overflow-tooltip="true"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="Ename"
        :show-overflow-tooltip="true"
        align="center">
      </el-table-column>
      <el-table-column
        prop="chinese"
        label="中文名"
        :show-overflow-tooltip="true"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        :show-overflow-tooltip="true"
        align="center">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        :show-overflow-tooltip="true"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="restore(scope.row)" type="success">恢复</el-button>
          <el-button @click="delModal(scope.row)" size="mini" type="danger">永久删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="page">
      <el-pagination
        v-if="recyclePagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[20, 30, 50, 100]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>
    <!--弹框-->
    <el-dialog
      title="提示"
      :visible.sync="recycleModal"
      width="50%"
      :before-close="modalClose"
      center>
      <!--动态组件-->
      <component v-bind:is="componentName"></component>
    </el-dialog>
  </el-card>
</template>

<script>
  import put from './put' // 修改
  import remove from './del' // 删除
  import search from './search' // 搜索
  export default {
    name: 'recycle',
    data () {
      return {
        ID: null, // 数据父级ID
        componentName: '',
        page: {
          currentPage: 1, // 当前页码
          pageSize: 20, // 当前页显示条数
          total: 0 // 数据总数
        },
        tableData: [], // 数据
        tableDataSelect: [] // 选中数据得ID数组
      }
    },
    computed: {
      // 数据父级id
      getID: function () {
        let ID = this.$route.query.ID
        if (!ID) {
          ID = null
        }
        return ID
      },
      // 回收站弹框
      recycleModal: function () {
        return this.$store.state.recycleModal
      },
      // 分页组件
      recyclePagination: function () {
        return this.$store.state.recyclePagination
      },
      // 表格数据
      recycleData: function () {
        return this.$store.state.recycleData
      }
    },
    watch: {
      // 监听表格数据与搜索数据
      recycleData: function (n, o) {
        this.tableData = n
      },
      getID: function (n, o) {
        this.ID = n
      }
    },
    components: {
      put, // 修改组件
      remove, // 删除组件
      search // 搜索组件
    },
    mounted () {
      this.ID = this.getID // 获取父级ID
      this.get(this.page.currentPage - 1, this.page.pageSize)
    },
    methods: {
      // 获取数据
      get (n, l) {
        let condition = {
          n: n,
          l: l,
          deleted: 1
        }
        if (this.ID !== null) {
          condition.parent_id = this.ID
        }
        this.$http.post('/api/device/struct/get', condition).then((response) => {
          if (response.status === 200) {
            this.page.total = response.data.t // 数据总数
            this.$store.commit('recycleData', response.data.d) // 保存数据到vuex
            this.$store.commit('recyclePagination', true) // 显示分页组件
          }
        })
      },
      // 删除
      delModal (row) {
        this.$store.commit('delData', row)
        this.$store.commit('recycleModal', true)
        this.componentName = 'remove'
      },
      // 恢复
      restore (row) {
        this.$store.commit('putData', row)
        this.$store.commit('recycleModal', true)
        this.componentName = 'put'
      },
      // 批量恢复
      batchRestore () {
        this.$confirm('确认恢复选中数据？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '恢复',
          cancelButtonText: '取消'
        }).then(() => {
          let condition = {
            id: this.tableDataSelect, // 选中数据的ID数组
            deleted: 0
          }
          this.$http.post('/api/device/struct/put', condition).then((response) => {
            if (response.status === 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.$store.commit('recycleModal', false)
            }
          })
        }).catch(action => {
          console.log(2);
        });
      },
      batchDel () {
        this.$confirm('确认永久删除？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }).then(() => {
          let delArr = [this.tableDataSelect] // 选中数据的ID数组
          this.$http.post('/api/device/struct/del', delArr).then((response) => {
            if (response.status === 200) {
              this.$message({
                message: '数据已永久删除',
                type: 'success'
              })
              this.$store.commit('recycleModal', false)
            }
          })
        }).catch(action => {
          console.log(2);
        });
      },
      // 刷新
      refresh () {
        this.get((this.page.currentPage - 1) * this.page.pageSize, this.page.pageSize)
        this.$store.commit('recyclePagination', true)
      },
      // 关闭弹框回调
      modalClose (done) {
        this.$store.commit('recycleModal', false) // 关闭弹框
        this.refresh() // 刷新页面
        done()
      },
      // 改变表格每页显示条数
      handleSizeChange(val) {
        this.page.pageSize = val
        this.get(this.page.currentPage - 1, val)
      },
      // 改变当前页数
      handleCurrentChange(val) {
        this.page.currentPage = val
        this.get((val - 1) * this.page.pageSize, this.page.pageSize)
      },
      // 获取当前选中的表格数据
      handleSelectionChange (val) {
        let idArr = []
        for (let i = 0; i < val.length; i++) {
          idArr.push(val[i].id)
        }
        this.tableDataSelect = idArr
      }
    }
  }
</script>
