<template>
  <div class="flex items-center justify-center min-h-screen bg-white">
    <div class="w-full max-w-md bg-white shadow-md rounded-lg p-8">
      <h2 class="text-2xl font-semibold mb-6 text-center">Sign up</h2>
      <form @submit.prevent="register">
        <div class="mb-4">
          <input
            class="w-full px-4 py-2 border rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            type="email"
            v-model="email"
          />
        </div>
        <div class="mb-4">
          <input
            class="w-full px-4 py-2 border rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone Number"
            type="text"
            v-model="phone_number"
          />
        </div>
        <div class="mb-4">
          <input
            class="w-full px-4 py-2 border rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Username"
            type="text"
            v-model="user_name"
          />
        </div>
        <div class="mb-4 relative">
          <input
            class="w-full px-4 py-2 border rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
          />
          <i
            class="fas fa-eye absolute right-3 top-3 text-gray-500 cursor-pointer"
            @click="togglePassword"
          ></i>
        </div>
        <div class="mb-4 relative">
          <input
            class="w-full px-4 py-2 border rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm Password"
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="confirmPassword"
          />
          <i
            class="fas fa-eye absolute right-3 top-3 text-gray-500 cursor-pointer"
            @click="toggleConfirmPassword"
          ></i>
        </div>
        <div v-if="error" class="text-red-500 text-sm mb-2">
          {{ error }}
        </div>
        <div class="mb-4">
          <button
            class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            type="submit"
            :disabled="isLoading"
          >
            {{ isLoading ? "Registering..." : "Register" }}
          </button>
        </div>
        <div class="text-center">
          <router-link class="text-sm text-gray-500" to="/">Already have an account?</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      phone_number: '',
      user_name: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      error: null
    };
  },
  methods: {
    async register() {
      this.error = null;

      if (!this.email || !this.phone_number || !this.user_name || !this.password || !this.confirmPassword) {
        this.error = "Vui lòng nhập đầy đủ thông tin.";
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.error = "Mật khẩu không khớp.";
        return;
      }

      this.isLoading = true;

      try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/signup/student", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: this.email,
            phone_number: this.phone_number,
            user_name: this.user_name,
            password: this.password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 400) {
            this.error = "Email đã được đăng ký";
          } else {
            this.error = data.detail || "Đăng ký thất bại";
          }
          return;
        }

        alert("Đăng ký thành công!");
        this.$router.push("/");
      } catch (error) {
        this.error = "Không thể kết nối đến server";
        console.error("Registration error:", error);
      } finally {
        this.isLoading = false;
      }
    },

    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
};
</script>

<style scoped>
/* Tuỳ chọn thêm */
</style>
