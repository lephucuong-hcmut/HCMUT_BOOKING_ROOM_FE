<template>
  <div class="flex items-center justify-center min-h-screen bg-white">
    <div class="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-16">
      <div class="text-center md:text-left">
        <h1 class="text-4xl font-bold">
          <span class="text-blue-500">Appointment</span> Booking
        </h1>
        <img
           alt="Illustration"
           class="mt-4 img-custom"
           src="@/assets/home.jpg"
        />
      </div>

      <div class="w-full max-w-sm">
        <div class="bg-white shadow-md rounded-lg p-8">
          <h2 class="text-2xl font-semibold mb-6">Sign in</h2>
          <form @submit.prevent="login">
            <div class="mb-4">
              <input
                class="w-full px-4 py-2 border rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
                type="text"
                v-model.trim="email"
              />
            </div>

            <div class="mb-4 relative">
              <input
                class="w-full px-4 py-2 border rounded-lg bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                v-model.trim="password"
              />
              <i
                class="fas fa-eye absolute right-3 top-3 text-gray-500 cursor-pointer"
                @click="togglePassword"
              ></i>
            </div>

            <div class="mb-4 text-right">
              <router-link class="text-sm text-gray-500" to="/forgot-password">
                Forgot password?
              </router-link>
            </div>

            <div v-if="error" class="mb-4 text-red-500 text-sm">{{ error }}</div>

            <div class="mb-4">
              <button
                class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                type="submit"
                :disabled="loading"
              >
                {{ loading ? "Logging in..." : "Login" }}
              </button>
            </div>

            <div class="text-center">
              <router-link class="text-sm text-gray-500" to="/signup">
                Sign up
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      error: "",
      loading: false,
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async login() {
      this.error = "";
      this.loading = true;

      // Validate user input
      if (!this.email || !this.password) {
        this.error = "Vui lòng nhập đầy đủ email và mật khẩu";
        this.loading = false;
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.error = "Email không hợp lệ";
        this.loading = false;
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/auth/signin/student", {
          headers: {
            'email': this.email,
            'password': this.password
          }
        });

        if (response.data && response.data.access_token) {
          // Lưu token vào localStorage
          localStorage.setItem("currentUser", JSON.stringify({
            token: response.data.access_token,
            token_type: response.data.token_type,
            email: this.email
          }));
          
          // Lưu email riêng để dễ truy cập
          localStorage.setItem("userEmail", this.email);
          
          // Chuyển hướng đến trang home
          this.$router.push("/home");
        }
      } catch (err) {
        console.error("Login error:", err);
        if (err.response) {
          switch (err.response.status) {
            case 401:
              this.error = "Sai email hoặc mật khẩu";
              break;
            case 422:
              this.error = "Dữ liệu không hợp lệ";
              break;
            default:
              this.error = err.response.data?.detail || "Có lỗi xảy ra. Vui lòng thử lại sau";
          }
        } else {
          this.error = "Không thể kết nối đến server";
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Custom styles for the image */
.img-custom {
  width: 700px;
  height: auto;
}
</style>
