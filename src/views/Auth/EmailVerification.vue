<template>
  <div>
    <img src="@/assets/certificate.png" />

    <div class="text-center">
      <h3 class="text-3xl my-3">Thank You!</h3>
      <p class="text-gray-700 mb-5">
        You're account has fully active, you can sign in to continue using
        you're account.
      </p>

      <router-link
        :to="{ name: 'Sign In' }"
        class="mb-2 text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >Sign In Now</router-link
      >
    </div>
  </div>
</template>

<script>
import { axiosInstance } from '../../plugins/axios'
import { toast } from '../../plugins/swal'

export default {
  methods: {
    verify(token) {
      this.$Progress.start()
      axiosInstance
        .post('/auth/verify', {
          token,
        })
        .catch(({ response }) => {
          toast(response.data.error, 'error')
          this.$Progress.fail()
        })
        .finally(() => {
          this.$Progress.finish()
        })
    },
  },

  beforeMount() {
    const token = this.$route.params.token
    this.verify(token)
  },
}
</script>
