<script>
export default {
  name: 'Logout',
  created () {
    delete localStorage.accessToken
    this.$router.push('/login')
  }
}
</script>