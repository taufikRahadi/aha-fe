<template>
  <div>
    <div class="mt-7">
      <div class="grid grid-cols-1">
        <div class="flex flex-col mb-5">
          <label
            :class="`${
              checkFormError('email') ? 'text-red-500' : 'text-gray-500'
            } mb-2`"
            for="email"
            >Email Address</label
          >
          <input
            type="email"
            name="email"
            v-model="formData.email"
            placeholder="user@mail.com"
            id="email"
            :disabled="loading"
            :class="` ${
              checkFormError('email') ? 'border-red-500' : ''
            } shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`"
          />
        </div>
        <div class="flex flex-col mb-7">
          <label
            :class="`${
              checkFormError('password') ? 'text-red-500' : 'text-gray-500'
            } mb-2`"
            for="password"
            >Password</label
          >
          <input
            type="password"
            v-model="formData.password"
            name="password"
            :disabled="loading"
            placeholder="*********"
            id="password"
            :class="` ${
              checkFormError('password') ? 'border-red-500' : ''
            } shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`"
          />
        </div>
        <div class="flex flex-col">
          <button
            :class="`mb-2 ${
              loading ? 'bg-gray-400' : 'bg-blue-500'
            }  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`"
            type="submit"
            @click="signIn"
            :disabled="loading"
          >
            Sign In
          </button>
          <button
            class="flex justify-center items-center mb-2 bg-white hover:shadow-lg text-gray-700 shadow-md border-2 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            v-google-signin-button="clientId"
            :disabled="loading"
          >
            <div class="mr-2">
              <img
                width="25"
                src="https://img.icons8.com/fluency/48/000000/google-logo.png"
              />
            </div>
            <div>Continue With Google</div>
          </button>
          <div class="my-2">
            <h3 class="text-center uppercase text-gray-300">or</h3>
          </div>
          <router-link
            class="mb-2 text-center bg-gray-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            :to="{ name: 'Sign Up' }"
          >
            Sign Up
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoogleSignInButton from 'vue-google-signin-button-directive'
import { axiosInstance } from '../../plugins/axios'
import { toast } from '../../plugins/swal'

export default {
  directives: {
    GoogleSignInButton,
  },

  data: () => ({
    formData: {
      email: '',
      password: '',
    },
    formError: [],
    loading: false,
    clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID,
  }),

  methods: {
    checkFormError(key) {
      const err = this.formError.find((error) => error.property === key)

      return Boolean(err)
    },

    signIn() {
      this.loading = true
      this.$Progress.start()
      axiosInstance
        .post('/auth', this.formData)
        .then(({ data }) => {
          localStorage.setItem('access_token', data.token)
          localStorage.setItem(
            'user_info',
            JSON.stringify({
              fullname: data.fullname,
              isEmailVerified: data.emailVerified,
            }),
          )
          toast('Welcome!', 'success')
          this.$Progress.finish()
          this.$router.push({
            name: 'Dashboard',
          })
        })
        .catch(({ response }) => {
          if (response.status === 403) {
            this.formError = response.data.message
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
          this.loading = false
          this.$Progress.finish()
        })
    },

    googleLogin(idToken) {
      this.loading = true
      this.$Progress.start()
      axiosInstance
        .post('/auth/google', {
          idToken,
        })
        .then(({ data }) => {
          localStorage.setItem('access_token', data.token)
          localStorage.setItem(
            'user_info',
            JSON.stringify({
              fullname: data.fullname,
              isEmailVerified: data.emailVerified,
            }),
          )
          toast('Welcome!', 'success')
          this.$Progress.finish()
          this.$router.push({
            name: 'Dashboard',
          })
        })
        .catch(() => {
          toast('Failed!', 'error')
        })
        .finally(() => {
          this.loading = false
          this.$Progress.finish()
        })
    },

    OnGoogleAuthSuccess(idToken) {
      this.googleLogin(idToken)
    },

    OnGoogleAuthFail(error) {
      console.log(error)
      toast('Google Authentication Failed!', 'error')
    },
  },
}
</script>
