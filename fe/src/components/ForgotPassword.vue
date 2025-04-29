<template>
  <div class="flex items-center justify-center min-h-screen bg-white">
    <div class="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold mb-6">Forgot Password</h2>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <input 
            class="w-full px-4 py-2 border rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Enter your email" 
            type="email" 
            v-model="email"
            required
          />
        </div>
        <div class="mb-4">
          <button 
            class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600" 
            type="submit"
          >
            Send Reset Link
          </button>
        </div>
        <div class="text-center">
          <router-link class="text-sm text-gray-500" to="/">
            Back to Sign In
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: ''
    }
  },
  methods: {
    handleSubmit() {
      // Handle password reset logic here
      console.log('Reset password for:', this.email)
    }
  }
}
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
