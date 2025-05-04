<template>
  <div class="flex h-screen">
    <AppSidebar />
    <!-- Main Content -->
    <div class="flex-1 p-6 pl-0">
      <!-- Header -->
      <header class="flex justify-between items-center mb-6 px-6">
        <h1 class="text-2xl font-bold text-blue-600">Home</h1>
        <button 
          @click="navigateToReservation" 
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow"
          style="width: 140px; height: 36px;"
        >
          <i class="fas fa-plus mr-2"></i>
          Add New Booking
        </button>
      </header>
      
      <div class="flex gap-4">
        <!-- Left Column - Calendar -->
        <div class="w-1/6">
          <!-- Calendar -->
          <div class="bg-white shadow rounded-lg p-2">
            <div class="flex justify-between items-center mb-1">
              <button @click="changeMonth(-1)" class="text-blue-600 hover:text-blue-800 text-xs">
                <i class="fas fa-arrow-left"></i>
              </button>
              <span class="text-xs font-semibold text-gray-700">{{ monthYear }}</span>
              <button @click="changeMonth(1)" class="text-blue-600 hover:text-blue-800 text-xs">
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
            <div class="calendar">
              <div v-for="day in weekDays" :key="day" class="header text-gray-600 text-xs font-medium">{{ day }}</div>
              <div v-for="blank in blanks" :key="'blank-' + blank"></div>
              <div 
                v-for="day in days" 
                :key="day"
                :class="getDayClasses(day)"
                @click="selectDay(day)"
                class="text-center py-0.5 text-xs cursor-pointer transition-colors duration-200"
              >
                {{ day }}
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Room Schedule -->
        <div class="flex-1">
          <div class="bg-white shadow rounded-lg p-4">
            <!-- Pagination Controls -->
            <div class="flex justify-between items-center mb-3">
              <button 
                @click="changePage(-1)" 
                class="text-blue-600 hover:text-blue-800 flex items-center text-xs"
                :disabled="currentPage === 0"
              >
                <i class="fas fa-arrow-left mr-1"></i>
                Previous
              </button>
              <span class="text-gray-600 text-xs">
                Page {{ currentPage + 1 }} of {{ totalPages }}
              </span>
              <button 
                @click="changePage(1)" 
                class="text-blue-600 hover:text-blue-800 flex items-center text-xs"
                :disabled="currentPage >= totalPages - 1"
              >
                Next
                <i class="fas fa-arrow-right ml-1"></i>
              </button>
            </div>

            <!-- Room Schedule Table -->
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="bg-blue-600 text-white">
                    <th class="px-6 py-3 text-left text-sm font-bold">Tiết</th>
                    <th 
                      v-for="room in paginatedRooms" 
                      :key="room.room_id" 
                      class="px-6 py-3 text-left text-sm font-bold"
                    >
                      {{ room.room_id }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="period in 12" :key="period" class="border-b">
                    <td class="px-6 py-3 text-sm font-bold text-gray-800">
                      Tiết {{ period }} ({{ getPeriodLabel(period) }})
                    </td>
                    <td
                      v-for="room in paginatedRooms"
                      :key="room.room_id + '-' + period"
                      class="px-6 py-3 text-sm font-bold"
                      :class="getStatusClass(room.status[period - 1], period)"
                    >
                      {{ room.status[period-1] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppSidebar from './AppSidebar.vue'
import axios from 'axios';
import { checkAuth } from '@/utils/auth';


export default {
  name: 'HomePage',
  components: {
    AppSidebar
  },

  data() {
    return {
      // Calendar data
      monthYear: '',
      selectedDate: null,
      days: [],
      blanks: [],
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      selectedDay: null,
      weekDays: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],

      // Room data
      currentPage: 0,
      roomsPerPage: 5,
      roomStatus: []
    };
  },
    created() {
    if (!checkAuth(this.$router)) return;
  },
  computed: {
    paginatedRooms() {
      const start = this.currentPage * this.roomsPerPage;
      const end = start + this.roomsPerPage;
      return this.roomStatus.slice(start, end);
    },

    totalPages() {
      return Math.ceil(this.roomStatus.length / this.roomsPerPage);
    }
  },

  methods: {
    // Calendar methods
    generateCalendar() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];

      this.monthYear = `${monthNames[this.currentMonth]} ${this.currentYear}`;
      this.blanks = Array.from({ length: firstDay }, (_, i) => i);
      this.days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    },

    changeMonth(direction) {
      this.currentMonth += direction;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.generateCalendar();
    },

    isToday(day) {
      const today = new Date();
      return day === today.getDate() &&
             this.currentMonth === today.getMonth() &&
             this.currentYear === today.getFullYear();
    },

    getDayClasses(day) {
      return {
        'today': this.isToday(day),
        'selected': day === this.selectedDay,
        'cursor-pointer': true,
        'hover:bg-blue-50': true,
        'text-gray-700': true
      };
    },

    selectDay(day) {
      this.selectedDay = day;
      this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
      this.fetchRoomStatusForDay(this.selectedDate);
    },

    // Room methods
    getStatusClass(status, period) {
      if (!this.isPeriodValid(period)) {
        return 'bg-gray-100 text-gray-500 font-bold';
      }

      return {
        'bg-emerald-100 text-emerald-900 font-bold': status === 'AVAILABLE',
        'bg-rose-100 text-rose-900 font-bold': status === 'IN_USE',
        'bg-amber-100 text-amber-900 font-bold': status === 'BOOKED'
      };
    },

    isPeriodValid(period) {
      if (!this.selectedDate) return true;

      const now = new Date();
      const selectedDate = new Date(this.selectedDate);
      
      // Reset time parts to compare only dates
      const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      
      // If selected date is in the future, all periods are valid
      if (selectedDateOnly > todayDate) {
        return true;
      }
      
      // If selected date is in the past, all periods are invalid
      if (selectedDateOnly < todayDate) {
        return false;
      }
      
      // For today, check if period end < current time
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      // Giả sử mỗi period kéo dài 1 tiếng, period 1: 6h-7h, period 2: 7h-8h, ...
      const periodStartHour = 5 + period; // period 1: 6h
      const periodEndHour = periodStartHour + 1;
      if (currentHour >= periodEndHour || (currentHour === periodEndHour && currentMinute > 0)) {
        return false;
      }
      return true;
    },

    changePage(direction) {
      const newPage = this.currentPage + direction;
      if (newPage >= 0 && newPage < this.totalPages) {
        this.currentPage = newPage;
      }
    },

    navigateToReservation() {
      this.$router.push('/reservation');
    },

    // API calls
    async fetchRoomStatusForDay(date) {
      if (!date) {
        date = this.getCurrentDate();
      }

      try {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser?.token) {
          this.$router.push('/');
          return;
        }

        const response = await axios.get(`http://127.0.0.1:8000/api/room/schedules?date=${formattedDate}`, {
          headers: {
            'Authorization': `Bearer ${currentUser.token}`
          }
        });

        if (Array.isArray(response.data)) {
          this.roomStatus = response.data;
          this.currentPage = 0;
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        this.handleApiError(error);
      }
    },

    getCurrentDate() {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    },

    handleApiError(error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            this.$router.push('/');
            break;
          case 404:
            alert('Không tìm thấy dữ liệu phòng cho ngày đã chọn');
            break;
          case 422:
            alert('Ngày không hợp lệ. Vui lòng chọn lại ngày.');
            break;
          case 400:
            alert(error.response.data.detail || 'Yêu cầu không hợp lệ');
            break;
          default:
            alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
        }
      } else if (error.message === 'Network Error') {
        alert('Không thể kết nối đến server. Vui lòng kiểm tra kết nối.');
      } else {
        alert('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
      }
    },

    getPeriodLabel(period) {
      // period 1: 6:00-7:00, period 2: 7:00-8:00, ...
      const startHour = 5 + period;
      const endHour = startHour + 1;
      // Định dạng giờ: 06:00-07:00
      const pad = (n) => n.toString().padStart(2, '0');
      return `${pad(startHour)}:00-${pad(endHour)}:00`;
    }
  },

  mounted() {
    this.generateCalendar();
    this.selectedDate = this.getCurrentDate();
    this.fetchRoomStatusForDay(this.selectedDate);
  }
};
</script>

<style scoped>
.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 1px;
}

.header {
  text-align: center;
  padding: 1px 0;
}

.today {
  background-color: #E3F2FD;
  color: #1976D2;
  font-weight: bold;
  border-radius: 50%;
}

.selected {
  background-color: #1976D2;
  color: white;
  font-weight: bold;
  border-radius: 50%;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.bg-emerald-100 {
  background-color: #D1FAE5;
}

.bg-rose-100 {
  background-color: #FFE4E6;
}

.bg-amber-100 {
  background-color: #FEF3C7;
}

.bg-gray-100 {
  background-color: #F3F4F6;
}

td:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}

td {
  border-radius: 6px;
  margin: 2px;
}

thead tr {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

td, th {
  transition: all 0.3s ease;
}

td[class*="bg-"] {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
