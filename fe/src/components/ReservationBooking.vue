<template>
  <div class="flex h-screen bg-gray-50">
    <AppSidebar />
    <!-- Main Content -->
    <div class="flex-1 p-8 overflow-y-auto">
      <div class="max-w-5xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">
              Room Booking
            </h1>
            <p class="text-gray-500 mt-1">Fill in the details to reserve a room</p>
          </div>
          <button 
            class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            @click="handleSubmit"
          >
            <i class="fas fa-check-circle"></i>
            <span>Confirm Booking</span>
          </button>
        </div>

        <!-- Booking Form -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <!-- Form Header -->
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
            <div class="flex items-center space-x-2">
              <i class="fas fa-bookmark"></i>
              <span class="font-semibold">Booking Information</span>
            </div>
          </div>

          <!-- Form Content -->
          <div class="p-6">
            <div class="grid grid-cols-2 gap-8">
              <!-- Left Column -->
              <div class="space-y-6">
                <div>
                  <label class="block text-gray-700 font-medium mb-2">
                    <i class="fas fa-id-card mr-2 text-blue-600"></i>
                    Student ID
                  </label>
                  <input 
                    v-model="studentId" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200" 
                    placeholder="Enter your student ID"
                    type="text"
                  />
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-2">
                    <i class="fas fa-user mr-2 text-blue-600"></i>
                    Student Name
                  </label>
                  <input 
                    v-model="studentName" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200" 
                    placeholder="Enter your full name"
                    type="text"
                  />
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-2">
                    <i class="fas fa-envelope mr-2 text-blue-600"></i>
                    Email
                  </label>
                  <div class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
                    {{ userEmail || 'Loading...' }}
                  </div>
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-2">
                    <i class="fas fa-phone mr-2 text-blue-600"></i>
                    Mobile Phone
                  </label>
                  <input 
                    v-model="phone" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200" 
                    placeholder="Enter your phone number"
                    type="tel"
                  />
                </div>
              </div>

              <!-- Right Column -->
              <div class="space-y-6">
                <div>
                  <label class="block text-gray-700 font-medium mb-2">
                    <i class="fas fa-door-open mr-2 text-blue-600"></i>
                    Room
                  </label>
                  <select 
                    v-model="selectedRoom" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200"
                  >
                    <option disabled value="">Select a room</option>
                    <option 
                      v-for="room in rooms" 
                      :key="room._id" 
                      :value="room.room_id"
                      :disabled="room.room_state !== 'AVAILABLE'"
                      :class="{'text-gray-400': room.room_state !== 'AVAILABLE'}"
                    >
                      {{ room.room_id }} (Capacity: {{ room.capacity }}) - {{ room.room_state }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-2">
                    <i class="fas fa-calendar mr-2 text-blue-600"></i>
                    Date
                  </label>
                  <input 
                    v-model="date" 
                    type="date" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200" 
                    :min="getCurrentDate()"
                  />
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-2">
                    <i class="fas fa-tasks mr-2 text-blue-600"></i>
                    Purpose of Room Usage
                  </label>
                  <input 
                    v-model="purpose" 
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200" 
                    placeholder="Enter purpose of booking"
                    type="text"
                  />
                </div>

                <div>
                  <label class="block text-gray-700 font-medium mb-2">
                    <i class="fas fa-clock mr-2 text-blue-600"></i>
                    Select Periods
                  </label>
                  <div class="grid grid-cols-6 gap-2">
                    <button 
                      v-for="n in 12" 
                      :key="'period-btn-'+n"
                      @click="togglePeriod(n)"
                      :class="[
                        'p-2 rounded-lg font-medium transition-all duration-200 text-sm',
                        selectedPeriods.includes(n) 
                          ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      ]"
                    >
                      {{ n }}
                    </button>
                  </div>
                  <div v-if="selectedPeriods.length > 0" class="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p class="text-sm text-blue-700">
                      <i class="fas fa-info-circle mr-2"></i>
                      Selected periods: {{ selectedPeriods.sort((a,b) => a-b).join(', ') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import AppSidebar from './AppSidebar.vue';
import axios from 'axios';
export function checkAuth(router) {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) {
    alert('Vui lòng đăng nhập lại');
    router.push('/signin');
    return false;
  }
  return true;
}
export default {
  name: 'ReservationBooking',
  components: {
    AppSidebar
  },
  setup() {
    const studentId = ref('');
    const studentName = ref('');
    const selectedRoom = ref('');
    const purpose = ref('');
    const userEmail = ref('');
    const phone = ref('');
    const selectedPeriods = ref([]);
    const date = ref('');
    const rooms = ref([]);

    const getCurrentDate = () => {
      const today = new Date();
      return today.toISOString().split('T')[0];
    };

    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/room/');
        rooms.value = response.data;
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    onMounted(() => {
      fetchRooms();
      date.value = getCurrentDate();
      
      // Get user email from localStorage
      const email = localStorage.getItem('userEmail');
      if (!email) {
        alert('Vui lòng đăng nhập lại');
        // Assuming you have router configured
        window.location.href = '/signin';
        return;
      }
      userEmail.value = email;
    });

    const togglePeriod = (period) => {
      const index = selectedPeriods.value.indexOf(period);
      if (index === -1) {
        selectedPeriods.value.push(period);
      } else {
        selectedPeriods.value.splice(index, 1);
      }
    };

    const handleSubmit = async () => {
      try {
        if (!selectedRoom.value) {
          alert('Please select a room');
          return;
        }
        if (selectedPeriods.value.length === 0) {
          alert('Please select at least one period');
          return;
        }
        if (!date.value) {
          alert('Please select a date');
          return;
        }

        const bookingData = {
          room_id: selectedRoom.value,
          student_id: studentId.value,
          student_name: studentName.value,
          purpose: purpose.value,
          selected_periods: selectedPeriods.value.sort((a,b) => a-b),
          date: date.value,
          email: userEmail.value,
          phone: phone.value
        };

        const response = await axios.post(`http://127.0.0.1:8000/api/booking/${selectedRoom.value}`, bookingData);
        if (response.status === 200) {
          alert('Booking successful!');
          // Reset form
          studentId.value = '';
          studentName.value = '';
          selectedRoom.value = '';
          purpose.value = '';
          phone.value = '';
          selectedPeriods.value = [];
          date.value = '';
        }
      } catch (error) {
        console.error('Error creating booking:', error);
        alert(error.response?.data?.detail || 'Error creating booking');
      }
    };

    return {
      studentId,
      studentName,
      selectedRoom,
      purpose,
      userEmail,
      phone,
      selectedPeriods,
      date,
      rooms,
      togglePeriod,
      getCurrentDate,
      handleSubmit
    };
  }
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  padding: 5px;
  filter: invert(0.5);
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}
</style>
