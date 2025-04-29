<template>
  <div class="bg-blue-600 text-white w-72 min-h-screen flex flex-col">
    <!-- Logo Section -->
    <div class="flex items-center justify-center py-6">
      <img alt="Logo" class="w-48 h-48" src="@/assets/room.png"/>
    </div>

    <!-- Profile Section -->
    <div class="px-4 mb-4" v-if="userProfile">
      <div class="bg-blue-700 rounded-lg p-2">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <span class="text-blue-600 text-sm font-bold">
              {{ userProfile.user_name ? userProfile.user_name[0].toUpperCase() : 'U' }}
            </span>
          </div>
          <div class="overflow-hidden">
            <p class="text-sm text-white font-medium truncate">{{ userProfile.email }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="px-4 flex-1">
      <router-link 
        to="/home" 
        class="flex items-center gap-3 text-white mb-2 px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        :class="{ 'bg-blue-700': $route.path === '/home' }"
      >
        <i class="fas fa-home text-xl"></i>
        <span>Home</span>
      </router-link>

      <router-link 
        to="/reservation" 
        class="flex items-center gap-3 text-white mb-2 px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        :class="{ 'bg-blue-700': $route.path === '/reservation' }"
      >
        <i class="fas fa-bookmark text-xl"></i>
        <span>Booking</span>
      </router-link>

      <router-link 
        to="/calendar" 
        class="flex items-center gap-3 text-white mb-2 px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        :class="{ 'bg-blue-700': $route.path === '/calendar' }"
      >
        <i class="fas fa-calendar text-xl"></i>
        <span>My Calendar</span>
      </router-link>

      <router-link 
        to="/admin" 
        class="flex items-center gap-3 text-white mb-2 px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        :class="{ 'bg-blue-700': $route.path === '/admin' }"
      >
        <i class="fas fa-cog text-xl"></i>
        <span>Settings</span>
      </router-link>
    </nav>

    <!-- Sign Out Button -->
    <div class="px-4 pb-6">
      <button 
        @click="handleSignOut"
        class="flex items-center gap-3 text-white w-full px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <i class="fas fa-sign-out-alt text-xl"></i>
        <span>Sign Out</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppSidebar',
  data() {
    return {
      userProfile: {
        user_name: localStorage.getItem('userEmail')?.split('@')[0] || 'User',
        email: localStorage.getItem('userEmail')
      }
    }
  },
  methods: {
    handleSignOut() {
      localStorage.removeItem('userEmail');
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.router-link-active {
  @apply bg-blue-700;
}
</style>
