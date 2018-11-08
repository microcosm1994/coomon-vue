<template>
  <el-input placeholder="请输入搜索内容" v-model="search.text" class="input-with-select" size="mini" @keyup.native.13="find" clearable>
    <el-select v-model="search.select" slot="prepend" placeholder="请选择">
      <el-option label="设备类型编号" value="id"></el-option>
      <el-option label="设备类型程序名" value="name"></el-option>
    </el-select>
    <el-button slot="append" icon="el-icon-search" @click="find"></el-button>
  </el-input>
</template>

<script>
  export default {
    name: 'search',
    data () {
      return {
        search: { // 搜索内容
          text: '',
          select: ''
        },
        datatype: 0 // 数据：0与回收站：1
      }
    },
    computed: {
      // 数据：0与回收站：1
      dataType: function () {
        return this.$store.state.dataType
      }
    },
    watch: {
      // 数据：0与回收站：1
      dataType: function (n, o) {
        this.datatype = n
      }
    },
    mounted () {},
    methods: {
      find () {
        let condition = {
          n: 0,
          l: 1000,
          deleted: this.datatype
        }
        if (this.search.select !== '' && this.search.text !== '') {
          condition[this.search.select] = this.search.text
          this.$http.post('/api/device/struct/get', condition).then((response) => {
            if (response.status === 200) {
              if (this.datatype === 0) {
                this.$store.commit('getData', response.data.d) // 保存数据到vuex
                this.$store.commit('pagination', false) // 数据页面分页
              } else {
                this.$store.commit('recycleData', response.data.d) // 保存回收站数据到vuex
                this.$store.commit('recyclePagination', false) // 回收站分页
              }
            }
          })
        }
      }
    }
  }
</script>
