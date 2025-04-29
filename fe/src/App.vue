<template>
  <div class="container-fluid p-0">
    <!-- Navbar -->
    <nav class="navbar navbar-light bg-white border-bottom shadow-sm" v-if="!isAuthPage">
      <div class="container-fluid px-4">
        <div class="d-flex justify-content-between align-items-center w-100">
          <!-- Brand -->
          <div class="d-flex align-items-center">
            <img src="@/assets/room.png" alt="Logo" class="me-2" style="height: 32px;">
            <a class="navbar-brand fw-bold text-primary m-0" href="#">HCMUT BOOKING ROOM</a>
          </div>

        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userEmail: localStorage.getItem('userEmail')
    }
  },
  computed: {
    isAuthPage() {
      return this.$route.name === 'signin' || this.$route.name === 'signup' || this.$route.name === 'forgotPassword';
    }
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('userEmail');
      this.userEmail = null;
      this.$router.push('/signin');
    }
  },
  watch: {
    '$route'() {
      this.userEmail = localStorage.getItem('userEmail');
    }
  }
}
</script>

<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.navbar {
  height: 60px;
}

.navbar-brand {
  font-size: 1.25rem;
  letter-spacing: 0.5px;
}

.btn-outline-primary {
  border-width: 1.5px;
}

.btn-outline-primary:hover {
  background-color: #0d6efd;
  color: white;
}
</style>
