<template>
  <div class="flex">
    <AppSidebar />
    <!-- Main Content -->
    <div class="flex-1 p-8 bg-gray-50 min-h-screen">
      <div class="max-w-5xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">
              System Administration
            </h1>
            <p class="text-gray-500">Manage rooms and system settings</p>
          </div>
        </div>

        <!-- Room Management Section -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 class="text-xl font-semibold mb-6 flex items-center text-gray-800">
            <i class="fas fa-door-open text-blue-600 mr-3"></i>
            Room Management
          </h2>
          
          <!-- Add Room Form -->
          <div class="bg-gray-50 p-6 rounded-lg border border-gray-100 mb-6">
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Room ID</label>
                <input 
                  v-model="newRoom.room_id" 
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200" 
                  placeholder="Enter room ID"
                  type="text"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                <input 
                  v-model="newRoom.capacity" 
                  class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200" 
                  placeholder="Enter room capacity"
                  type="number"
                />
              </div>
              <div class="flex items-end">
                <button 
                  @click="addRoom"
                  class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="loading"
                >
                  <i class="fas fa-plus"></i>
                  {{ loading ? 'Adding...' : 'Add Room' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Room List -->
          <div class="bg-white rounded-lg overflow-hidden">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <th class="py-4 px-6 text-left font-semibold">
                    <div class="flex items-center gap-2">
                      <i class="fas fa-door-open"></i>
                      Room ID
                    </div>
                  </th>
                  <th class="py-4 px-6 text-left font-semibold">
                    <div class="flex items-center gap-2">
                      <i class="fas fa-users"></i>
                      Capacity
                    </div>
                  </th>
                  <th class="py-4 px-6 text-left font-semibold">
                    <div class="flex items-center gap-2">
                      <i class="fas fa-info-circle"></i>
                      Status
                    </div>
                  </th>
                  <th class="py-4 px-6 text-left font-semibold">
                    <div class="flex items-center gap-2">
                      <i class="fas fa-cog"></i>
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="room in rooms" 
                  :key="room.room_id" 
                  class="border-b border-gray-100 hover:bg-blue-50 transition-all duration-200"
                >
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-gray-800">{{ room.room_id }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-2">
                      <i class="fas fa-user-friends text-gray-400"></i>
                      <span class="font-medium text-gray-800">{{ room.capacity }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-6">
                    <span 
                      class="px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5"
                      :class="getRoomStatusClass(room.room_state)"
                    >
                      <i :class="getRoomStatusIcon(room.room_state)"></i>
                      {{ translateRoomStatus(room.room_state) }}
                    </span>
                  </td>
                  <td class="py-4 px-6">
                    <button 
                      @click="deleteRoom(room.room_id)"
                      class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                      :disabled="room.room_state === 'IN_USE'"
                      :title="room.room_state === 'IN_USE' ? 'Cannot delete room in use' : 'Delete room'"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Empty State -->
            <div v-if="rooms.length === 0" class="text-center py-16">
              <div class="text-gray-400 mb-4">
                <i class="fas fa-door-closed text-5xl"></i>
              </div>
              <h3 class="text-xl font-medium text-gray-800 mb-2">No rooms found</h3>
              <p class="text-gray-500">Add a new room to get started</p>
            </div>
          </div>
        </div>

        <!-- User Management Section -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 class="text-xl font-semibold mb-6 flex items-center text-gray-800">
            <i class="fas fa-users text-blue-600 mr-3"></i>
            User Management
          </h2>

          <!-- User List -->
          <div class="bg-white rounded-lg overflow-hidden">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <th class="py-4 px-6 text-left font-semibold">
                    <div class="flex items-center gap-2">
                      <i class="fas fa-user"></i>
                      User ID
                    </div>
                  </th>
                  <th class="py-4 px-6 text-left font-semibold">
                    <div class="flex items-center gap-2">
                      <i class="fas fa-user-tag"></i>
                      Name
                    </div>
                  </th>
                  <th class="py-4 px-6 text-left font-semibold">
                    <div class="flex items-center gap-2">
                      <i class="fas fa-envelope"></i>
                      Email
                    </div>
                  </th>
                  <th class="py-4 px-6 text-left font-semibold">
                    <div class="flex items-center gap-2">
                      <i class="fas fa-phone"></i>
                      Phone
                    </div>
                  </th>
                  <th class="py-4 px-6 text-left font-semibold">
                    <div class="flex items-center gap-2">
                      <i class="fas fa-user-shield"></i>
                      Role
                    </div>
                  </th>
                  <th class="py-4 px-6 text-left font-semibold">
                    <div class="flex items-center gap-2">
                      <i class="fas fa-cog"></i>
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="user in users" 
                  :key="user.user_id" 
                  class="border-b border-gray-100 hover:bg-blue-50 transition-all duration-200"
                >
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-gray-800">{{ user.user_id }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-gray-800">{{ user.user_name }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-gray-800">{{ user.email }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-6">
                    <div class="flex items-center gap-2">
                      <span class="font-medium text-gray-800">{{ user.phone_number }}</span>
                    </div>
                  </td>
                  <td class="py-4 px-6">
                    <span 
                      class="px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5"
                      :class="user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'"
                    >
                      <i :class="user.role === 'admin' ? 'fas fa-user-shield' : 'fas fa-user-graduate'"></i>
                      {{ user.role === 'admin' ? 'Admin' : 'Student' }}
                    </span>
                  </td>
                  <td class="py-4 px-6">
                    <button 
                      @click="deleteUser(user.user_id)"
                      class="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                      :disabled="user.role === 'admin'"
                      :title="user.role === 'admin' ? 'Không thể xóa admin' : 'Xóa user'"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Empty State -->
            <div v-if="users.length === 0" class="text-center py-16">
              <div class="text-gray-400 mb-4">
                <i class="fas fa-users text-5xl"></i>
              </div>
              <h3 class="text-xl font-medium text-gray-800 mb-2">No users found</h3>
              <p class="text-gray-500">There are no users in the system</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppSidebar from './AppSidebar.vue'
import axios from 'axios'
import { checkAuth } from '@/utils/auth';
export default {
  name: 'SystemAdmin',
  components: {
    AppSidebar
  },
  data() {
    return {
      rooms: [],
      users: [],
      loading: false,
      error: null,
      newRoom: {
        room_id: '',
        capacity: null
      }
    }
  },
  methods: {
    // Room Management Methods
    async fetchRooms() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/room');
        this.rooms = response.data;
      } catch (err) {
        console.error('Error fetching rooms:', err);
        this.error = 'Không thể tải danh sách phòng';
      }
    },

    async fetchUsers() {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || !currentUser.token) {
          this.$router.push('/signin');
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/auth/users', {
          headers: {
            'Authorization': `${currentUser.token_type} ${currentUser.token}`
          }
        });
        this.users = response.data;
      } catch (err) {
        console.error('Error fetching users:', err);
        if (err.response?.status === 401) {
          this.$router.push('/signin');
        } else {
          this.error = 'Không thể tải danh sách người dùng';
        }
      }
    },

    async addRoom() {
      if (!this.newRoom.room_id || !this.newRoom.capacity) {
        alert('Vui lòng nhập đầy đủ thông tin phòng');
        return;
      }

      this.loading = true;
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || !currentUser.token) {
          alert('Bạn cần đăng nhập để thực hiện thao tác này');
          this.$router.push('/signin');
          return;
        }

        await axios.post('http://127.0.0.1:8000/api/room', this.newRoom, {
          headers: {
            'Authorization': `${currentUser.token_type} ${currentUser.token}`
          }
        });
        await this.fetchRooms();
        this.newRoom = { room_id: '', capacity: null };
      } catch (err) {
        console.error('Error adding room:', err);
        if (err.response?.status === 401) {
          alert('Bạn không có quyền thực hiện thao tác này');
          this.$router.push('/signin');
        } else {
          alert(err.response?.data?.detail || 'Không thể thêm phòng');
        }
      } finally {
        this.loading = false;
      }
    },

    async deleteRoom(roomId) {
      if (!confirm('Bạn có chắc chắn muốn xóa phòng này?')) return;

      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || !currentUser.token) {
          alert('Bạn cần đăng nhập để thực hiện thao tác này');
          this.$router.push('/signin');
          return;
        }

        await axios.delete(`http://127.0.0.1:8000/api/room/${roomId}`, {
          headers: {
            'Authorization': `${currentUser.token_type} ${currentUser.token}`
          }
        });
        await this.fetchRooms();
      } catch (err) {
        console.error('Error deleting room:', err);
        if (err.response?.status === 401) {
          alert('Bạn không có quyền thực hiện thao tác này');
          this.$router.push('/signin');
        } else {
          alert(err.response?.data?.detail || 'Không thể xóa phòng');
        }
      }
    },

    // Status Helpers
    translateRoomStatus(status) {
      const statusMap = {
        'AVAILABLE': 'Trống',
        'IN_USE': 'Đang sử dụng',
        'BLOCKED': 'Đã khóa'
      }
      return statusMap[status] || status;
    },

    getRoomStatusClass(status) {
      const classMap = {
        'AVAILABLE': 'bg-green-100 text-green-700',
        'IN_USE': 'bg-blue-100 text-blue-700',
        'BLOCKED': 'bg-red-100 text-red-700'
      }
      return classMap[status] || '';
    },

    getRoomStatusIcon(status) {
      const iconMap = {
        'AVAILABLE': 'fas fa-check-circle',
        'IN_USE': 'fas fa-user-clock',
        'BLOCKED': 'fas fa-ban'
      }
      return iconMap[status] || 'fas fa-circle';
    },

    async deleteUser(userId) {
      if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser || !currentUser.token) {
          alert('Bạn cần đăng nhập để thực hiện thao tác này');
          this.$router.push('/signin');
          return;
        }
        await axios.delete(`http://127.0.0.1:8000/api/auth/users/${userId}`, {
          headers: {
            'Authorization': `${currentUser.token_type} ${currentUser.token}`
          }
        });
        await this.fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
        if (err.response?.status === 401) {
          alert('Bạn không có quyền thực hiện thao tác này');
          this.$router.push('/signin');
        } else {
          alert(err.response?.data?.detail || 'Không thể xóa người dùng');
        }
      }
    }
  },
  created() {
    if (!checkAuth(this.$router)) return;
    this.fetchRooms();
    this.fetchUsers();
  }
}
</script>

<style scoped>
.hover\:bg-gray-50:hover {
  background-color: rgb(249, 250, 251);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
 