<script lang="ts">
  export default {
    created() {
      console.log('进来了啊')
      const { params, query } = this.$route
      const { path } = params
      this.$router.replace({ path: '/' + path, query })
    },
    render: function(h) {
      return h() // avoid warning message
    }
  }
  </script>
  