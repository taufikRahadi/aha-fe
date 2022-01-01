<template>
  <div>
    <div
      class="flex items-center justify-between w-screen bg-white shadow-md py-3 px-5 h-16"
    >
      <div>
        <h3 class="font-black text-xl text-gray-600">Backend Test</h3>
      </div>

      <div class="flex">
        <button @click="logout">Sign Out</button>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from '../plugins/swal'
export default {
  methods: {
    logout() {
      this.$swal
        .fire({
          title: 'Are you sure?',
          text: 'You have to sign in again to see this page!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!',
        })
        .then(({ isConfirmed }) => {
          if (isConfirmed) {
            localStorage.removeItem('user_info')
            localStorage.removeItem('access_token')
            toast('Logout success', 'succes')
            this.$router.push({
              name: 'Sign In',
            })
          }
        })
    },
  },
}
</script>
