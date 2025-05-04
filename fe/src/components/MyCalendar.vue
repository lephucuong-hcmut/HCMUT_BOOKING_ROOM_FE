<template>
  <div class="flex">
    <AppSidebar />
    <!-- Main Content -->
    <div class="w-4/5 p-8 bg-gray-50 min-h-screen">
      <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">
              My Calendar
            </h1>
            <p class="text-gray-500">Manage your room bookings and schedules</p>
          </div>
          <div class="flex gap-3">
            <button 
              class="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
              @click="handleCheckIn"
            >
              <i class="fas fa-sign-in-alt"></i>
              Check-in
            </button>
            <button 
              class="bg-green-600 hover:bg-green-700 text-white py-2.5 px-5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
              @click="handleCheckOut"
            >
              <i class="fas fa-sign-out-alt"></i>
              Check-out
            </button>
            <button 
              class="bg-red-100 hover:bg-red-200 text-red-600 py-2.5 px-5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
              @click="handleCancel"
            >
              <i class="fas fa-times-circle"></i>
              Cancel Booking
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-16">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg relative my-4 flex items-center">
          <i class="fas fa-exclamation-circle mr-3 text-xl"></i>
          <div>
            <strong class="font-medium">Error!</strong>
            <span class="ml-1">{{ error }}</span>
          </div>
        </div>

        <!-- Calendar Table -->
        <div v-else class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <th class="py-4 px-6 text-left font-semibold">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-calendar-day"></i>
                    DATE
                  </div>
                </th>
                <th class="py-4 px-6 text-left font-semibold">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-clock"></i>
                    PERIOD
                  </div>
                </th>
                <th class="py-4 px-6 text-left font-semibold">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-door-open"></i>
                    ROOM
                  </div>
                </th>
                <th class="py-4 px-6 text-left font-semibold">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-info-circle"></i>
                    STATUS
                  </div>
                </th>
                <th class="py-4 px-6 text-left font-semibold">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-qrcode"></i>
                    QR CODE
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="booking in bookings" 
                :key="booking.booking_id"
                class="border-b border-gray-100 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                :class="{'bg-blue-50 shadow-sm': selectedBooking?.booking_id === booking.booking_id}"
                @click="selectBooking(booking)"
              >
                <td class="py-4 px-6">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-800">{{ formatDate(booking.date) }}</span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="period in booking.selected_periods" 
                      :key="period"
                      class="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full font-medium"
                    >
                      Tiết {{ period }}
                    </span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-door-open text-gray-400"></i>
                    <span class="font-medium text-gray-800">{{ booking.room_name }}</span>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <span 
                    class="px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5"
                    :class="getStatusClass(booking.status)"
                  >
                    <i :class="getStatusIcon(booking.status)"></i>
                    {{ translateStatus(booking.status) }}
                  </span>
                </td>
                <td class="py-4 px-6">
                  <button 
                    v-if="booking.qr_code"
                    @click.stop="showQRCode(booking)"
                    class="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  >
                    <i class="fas fa-qrcode text-xl"></i>
                  </button>
                  <span v-else class="text-gray-400">-</span>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- QR Code Modal -->
          <div v-if="showQRModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold text-gray-800">Booking QR Code</h3>
                <button 
                  @click="showQRModal = false"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div class="flex flex-col items-center">
                <a
                  v-if="selectedQRCode"
                  :href="selectedQRCode"
                  download="booking_qrcode.png"
                  class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded mb-2"
                >
                  Tải ảnh QR về máy
                </a>
                <img 
                  :src="selectedQRCode" 
                  alt="QR Code" 
                  class="w-64 h-64 object-contain mb-4"
                />
                <p class="text-gray-600 text-sm text-center">
                  Scan this QR code to verify your booking
                </p>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="bookings.length === 0" class="text-center py-16">
            <div class="text-gray-400 mb-4">
              <i class="fas fa-calendar-times text-5xl"></i>
            </div>
            <h3 class="text-xl font-medium text-gray-800 mb-2">No bookings found</h3>
            <p class="text-gray-500">You haven't made any room bookings yet.</p>
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
  name: 'MyCalendar',
  components: {
    AppSidebar
  },
  data() {
    return {
      bookings: [],
      loading: false,
      error: null,
      selectedBooking: null,
      showQRModal: false,
      selectedQRCode: null
    }
  },
  methods: {
    async fetchCalendar() {
      this.loading = true;
      this.error = null;
      
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        this.error = 'Vui lòng đăng nhập lại';
        this.$router.push('/signin');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/booking/calendar/user', {
          params: {
            email: userEmail
          }
        });
        this.bookings = Array.isArray(response.data) ? response.data : [response.data];
      } catch (err) {
        this.error = 'Không thể tải lịch. Vui lòng thử lại sau';
        console.error('Error fetching calendar:', err);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    translateStatus(status) {
      const statusMap = {
        'COMPLETED': 'Đã hoàn thành',
        'CANCELLED': 'Đã hủy',
        'IN_USE': 'Đang sử dụng',
        'PENDING': 'Chưa sử dụng',
        'EXPIRED': 'Đã quá hạn'
      }
      return statusMap[status] || status;
    },
    getStatusClass(status) {
      const classMap = {
        'COMPLETED': 'bg-green-100 text-green-700',
        'CANCELLED': 'bg-red-100 text-red-700',
        'IN_USE': 'bg-blue-100 text-blue-700',
        'PENDING': 'bg-yellow-100 text-yellow-700',
        'EXPIRED':  'bg-yellow-100 text-yellow-700'
        
      }
      return classMap[status] || '';
    },
    getStatusIcon(status) {
      const iconMap = {
        'COMPLETED': 'fas fa-check-circle',
        'CANCELLED': 'fas fa-times-circle',
        'IN_USE': 'fas fa-play-circle',
        'PENDING': 'fas fa-clock',
        'EXPIRED': 'fas fa-hourglass-end'
      }
      return iconMap[status] || 'fas fa-circle';
    },
    async handleCheckIn() {
      if (!this.selectedBooking) {
        alert('Vui lòng chọn một lịch đặt phòng');
        return;
      }
      
      if (this.selectedBooking.status !== 'PENDING') {
        alert('Chỉ có thể check-in lịch đặt phòng chưa sử dụng');
        return;
      }

      if (!confirm('Xác nhận check-in phòng này?')) return;
      
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        alert('Vui lòng đăng nhập lại');
        this.$router.push('/signin');
        return;
      }

      this.loading = true;
      try {
        await axios.post(
          `http://127.0.0.1:8000/api/booking/checkin/${this.selectedBooking.booking_id}`,
          null,
          {
            params: {
              email: userEmail
            }
          }
        );
        await this.fetchCalendar();
      } catch (err) {
        if (err.response?.status === 400) {
          this.error = err.response.data.detail || 'Không thể check-in. Vui lòng thử lại sau.';
        } else {
          this.error = 'Không thể check-in. Vui lòng thử lại sau.';
        }
        console.error('Check-in error:', err);
      } finally {
        this.loading = false;
      }
    },
    async handleCheckOut() {
      if (!this.selectedBooking) {
        alert('Vui lòng chọn một lịch đặt phòng');
        return;
      }

      if (this.selectedBooking.status !== 'IN_USE') {
        alert('Chỉ có thể check-out lịch đặt phòng đang sử dụng');
        return;
      }

      if (!confirm('Xác nhận check-out phòng này?')) return;
      
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        alert('Vui lòng đăng nhập lại');
        this.$router.push('/signin');
        return;
      }

      this.loading = true;
      try {
        await axios.post(
          `http://127.0.0.1:8000/api/booking/checkout/${this.selectedBooking.booking_id}`,
          null,
          {
            params: {
              email: userEmail
            }
          }
        );
        await this.fetchCalendar();
      } catch (err) {
        if (err.response?.status === 400) {
          this.error = err.response.data.detail || 'Không thể check-out. Vui lòng thử lại sau.';
        } else {
          this.error = 'Không thể check-out. Vui lòng thử lại sau.';
        }
        console.error('Check-out error:', err);
      } finally {
        this.loading = false;
      }
    },
    async handleCancel() {
      if (!this.selectedBooking) {
        alert('Vui lòng chọn một lịch đặt phòng');
        return;
      }

      if (this.selectedBooking.status !== 'PENDING') {
        alert('Chỉ có thể hủy lịch đặt phòng chưa sử dụng');
        return;
      }

      if (!confirm('Bạn có chắc chắn muốn hủy lịch đặt phòng này?')) return;
      
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        alert('Vui lòng đăng nhập lại');
        this.$router.push('/signin');
        return;
      }

      this.loading = true;
      try {
        await axios.post(
          `http://127.0.0.1:8000/api/booking/cancel/${this.selectedBooking.booking_id}`,
          null,
          {
            params: {
              email: userEmail
            }
          }
        );
        await this.fetchCalendar();
      } catch (err) {
        if (err.response?.status === 400) {
          this.error = err.response.data.detail || 'Không thể hủy lịch. Vui lòng thử lại sau.';
        } else {
          this.error = 'Không thể hủy lịch. Vui lòng thử lại sau.';
        }
        console.error('Cancel booking error:', err);
      } finally {
        this.loading = false;
      }
    },
    selectBooking(booking) {
      this.selectedBooking = this.selectedBooking?.booking_id === booking.booking_id ? null : booking;
    },
    canCheckIn(booking) {
      return booking.status === 'PENDING';
    },
    canCheckOut(booking) {
      return booking.status === 'IN_USE';
    },
    canCancel(booking) {
      return booking.status === 'PENDING';
    },
    showQRCode(booking) {
      if (booking.qr_code && !booking.qr_code.startsWith('data:image')) {
        this.selectedQRCode = 'data:image/png;base64,' + booking.qr_code;
      } else {
        this.selectedQRCode = booking.qr_code;
      }
      this.showQRModal = true;
    }
  },
  created() {
    if (!checkAuth(this.$router)) return;
    this.fetchCalendar();
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Table styles */
table {
  border-spacing: 0;
}

th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}

tr:last-child td {
  border-bottom: none;
}

/* Modal styles */
.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.z-50 {
  z-index: 50;
}

.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
