<script>

import axios from "axios";

export default {
  name: 'Logout',
  created () {
   
    axios.get('/auth/logout', {
      headers: {
        "x-access-token": localStorage.getItem("accessToken")
      }
    }).then(res => {
      delete localStorage.accessToken;
      delete localStorage.refreshToken;
      this.$router.push('/admin/login');
    }).catch(err => {
      console.log(err);
    });

    
  }
}
</script>