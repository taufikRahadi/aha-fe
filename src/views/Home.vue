<template>
  <div>
    <Navbar />
    <div class="px-10 py-5">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { axiosInstance } from '../plugins/axios'
import Navbar from '@/components/Navbar.vue'
import { toast } from '../plugins/swal'
export default {
  name: 'Home',
  components: {
    Navbar,
  },
  mounted() {
    const token = localStorage.getItem('access_token')
    axiosInstance
      .get('/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch(({ response }) => {
        toast(response.data.message, 'error')
        this.$router.push({ name: 'Sign In' })
      })
  },
}
</script>
