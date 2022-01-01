<template>
  <div>
    <div class="grid grid-cols-6 gap-3">
      <div class="bg-white shadow-md rounded px-5 py-3 col-span-4">
        <div class="flex flex-col mb-7">
          <label
            :class="`${
              checkFormError('fullname') ? 'text-red-500' : 'text-gray-500'
            } mb-2`"
            for="fullname"
            >Name</label
          >
          <input
            type="text"
            name="fullname"
            :disabled="loading"
            v-model="userProfile.fullname"
            id="fullname"
            :class="` ${
              checkFormError('fullname') ? 'border-red-500' : ''
            } shadow
          appearance-none border rounded w-full py-2 px-3 text-gray-700
          leading-tight focus:outline-none focus:shadow-outline`"
          />
        </div>
        <div class="flex flex-col mb-7">
          <label class="mb-2` text-gray-500" for="password">Email</label>
          <input
            type="text"
            name="email"
            v-model="email"
            :disabled="true"
            id="email"
            :class="` ${checkFormError('email') ? 'border-red-500' : ''} shadow
          appearance-none border rounded w-full py-2 px-3 text-gray-500
          leading-tight focus:outline-none focus:shadow-outline`"
          />
        </div>

        <button
          @click="updateProfile"
          class="bg-blue-500 text-white rounded shadow-md px-3 py-2"
        >
          Update
        </button>
      </div>
      <div class="col-span-2 bg-white shadow-md rounded px-5 py-3 w-full">
        <div class="flex flex-col mb-7">
          <label
            :class="`${
              checkChangePasswordFormError('password')
                ? 'text-red-500'
                : 'text-gray-500'
            } mb-2`"
            for="password"
            >Password</label
          >
          <input
            type="password"
            name="password"
            :disabled="loading"
            placeholder="*********"
            v-model="changePassword.password"
            id="password"
            :class="` ${
              checkChangePasswordFormError('password') ? 'border-red-500' : ''
            } shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`"
          />
        </div>
        <div class="flex flex-col mb-7">
          <label
            :class="`${
              checkChangePasswordFormError('confirmPassword')
                ? 'text-red-500'
                : 'text-gray-500'
            } mb-2`"
            for="password"
            >Confirm Password</label
          >
          <input
            type="password"
            name="confirmPassword"
            :disabled="loading"
            v-model="changePassword.confirmPassword"
            placeholder="*********"
            id="confirmPassword"
            :class="` ${
              checkChangePasswordFormError('confirmPassword')
                ? 'border-red-500'
                : ''
            } shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`"
          />
        </div>

        <button
          @click="updatePassword"
          class="bg-blue-500 text-white px-3 py-2 rounded shadow-md"
        >
          Change Password
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { axiosInstance } from '../plugins/axios'
import { toast } from '../plugins/swal'
export default {
  data: () => ({
    userProfile: {
      fullname: '',
    },
    changePassword: {
      password: '',
      confirmPassword: '',
    },
    email: '',
    userProfileFormError: [],
    changePasswordFormError: [],
    loading: false,
  }),

  methods: {
    checkFormError(key) {
      const err = this.userProfileFormError.find(
        (error) => error.property === key,
      )

      return Boolean(err)
    },

    checkChangePasswordFormError(key) {
      const err = this.changePasswordFormError.find(
        (error) => error.property === key,
      )

      return Boolean(err)
    },

    updateProfile() {
      this.$Progress.start()
      axiosInstance
        .put('/user/profile', this.userProfile, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        .then(() => {
          toast('Profile Updated!', 'success')
          this.fetchProfile()
        })
        .catch(({ response }) => {
          this.$Progress.fail()
          if (response.status === 403) {
            this.userProfileFormError = response.data.message
            response.data.message.forEach((res) => {
              const validationErr = Object.keys(res.constraints)
              validationErr.forEach((v) => {
                toast(res.constraints[v], 'error')
              })
            })
          } else {
            toast(response.data.message, 'error')
          }
        })
        .finally(() => {
          this.$Progress.finish()
        })
    },

    updatePassword() {
      this.$Progress.start()
      axiosInstance
        .put('/user/reset-password', this.changePassword, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        .then(() => {
          toast('Password Changed!', 'success')
          this.changePassword.password = ''
          this.changePassword.confirmPassword = ''
        })
        .catch(({ response }) => {
          this.$Progress.fail()
          if (response.status === 403) {
            this.changePassword = response.data.message
            response.data.message.forEach((res) => {
              const validationErr = Object.keys(res.constraints)
              validationErr.forEach((v) => {
                toast(res.constraints[v], 'error')
              })
            })
          } else {
            toast(response.data.message, 'error')
          }
        })
        .finally(() => {
          this.$Progress.finish()
        })
    },

    fetchProfile() {
      this.$Progress.start()
      axiosInstance
        .get('/user/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        .then(({ data }) => {
          for (const key of Object.keys(this.userProfile)) {
            this.userProfile[key] = data[key]
          }
          this.email = data.email
        })
        .catch(({ response }) => {
          this.$Progress.fail()
          if (response.status === 401 || response.status === 403) {
            toast('Invalid Session', 'error')
            this.$router.push({ name: 'Sign In' })
          }
        })
        .finally(() => {
          this.$Progress.finish()
        })
    },
  },

  mounted() {
    this.fetchProfile()
  },
}
</script>
