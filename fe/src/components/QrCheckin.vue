<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
      <h1 class="text-2xl font-bold text-center mb-6 text-blue-700">Quét QR Check-in</h1>
      <qrcode-stream @decode="onDecode" @init="onInit" @error="onQRError"></qrcode-stream>
      <button
        class="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded mt-4"
        @click="showQRCapture = true"
      >
        Hoặc tải ảnh QR từ máy
      </button>

      <!-- Manual QR code text input -->
      <div class="mt-6">
        <h2 class="text-lg font-semibold text-center mb-2">Hoặc nhập mã QR thủ công</h2>
        <div class="flex gap-2">
          <input
            v-model="manualQRText"
            type="text"
            placeholder="Dán mã QR vào đây"
            class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="submitManualQR"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Check-in
          </button>
        </div>
      </div>

      <div v-if="message" :class="{'text-green-600': success, 'text-red-600': !success}" class="mt-6 text-center font-semibold">
        {{ message }}
      </div>
    </div>
  </div>

  <!-- Modal upload QR -->
  <div v-if="showQRCapture" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4 flex flex-col items-center">
      <div class="flex justify-between items-center w-full mb-4">
        <h3 class="text-xl font-semibold text-gray-800">Tải ảnh QR để check-in</h3>
        <button @click="showQRCapture = false" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <qrcode-capture @decode="onDecode" @init="onInit" @error="onQRError"></qrcode-capture>
      <p class="text-gray-600 text-sm mt-4">Chọn ảnh QR code từ máy để check-in</p>
    </div>
  </div>
</template>

<script>
import { QrcodeStream, QrcodeCapture } from 'vue-qrcode-reader'
import axios from 'axios'

export default {
  name: 'QrCheckin',
  components: { QrcodeStream, QrcodeCapture },
  data() {
    return {
      message: '',
      success: false,
      showQRCapture: false,
      manualQRText: ''
    }
  },
  methods: {
    async onDecode(result) {
      console.log('QR decode result:', result);
      this.showQRCapture = false;
      this.message = '';
      try {
        // Validate QR code format
        if (!result.includes('|')) {
          throw new Error('Mã QR không hợp lệ. Vui lòng quét lại mã QR chính xác.');
        }

        await axios.post('http://127.0.0.1:8000/api/booking/checkin-qr/qr', {
          qr_code: result
        });
        
        this.message = 'Check-in thành công!';
        this.success = true;
      } catch (err) {
        if (err.response?.data?.detail) {
          this.message = err.response.data.detail;
        } else if (err.message) {
          this.message = err.message;
        } else {
          this.message = 'Check-in thất bại! Vui lòng thử lại.';
        }
        this.success = false;
      }
    },
    onInit(promise) {
      promise.catch(() => {
        this.message = 'Không thể truy cập camera hoặc file!';
        this.success = false;
      });
    },
    onQRError(e) {
      console.log('QR error:', e);
      this.message = 'Không nhận diện được mã QR trong ảnh hoặc camera!';
      this.success = false;
    },
    async submitManualQR() {
      if (!this.manualQRText.trim()) {
        this.message = 'Vui lòng nhập mã QR!';
        this.success = false;
        return;
      }

      try {
        // Validate QR code format
        if (!this.manualQRText.includes('|')) {
          throw new Error('Mã QR không hợp lệ. Vui lòng nhập mã QR chính xác.');
        }

        await axios.post('http://127.0.0.1:8000/api/booking/checkin-qr/qr', {
          qr_code: this.manualQRText
        });
        
        this.message = 'Check-in thành công!';
        this.success = true;
        this.manualQRText = '';
      } catch (err) {
        if (err.response?.data?.detail) {
          this.message = err.response.data.detail;
        } else if (err.message) {
          this.message = err.message;
        } else {
          this.message = 'Check-in thất bại! Vui lòng thử lại.';
        }
        this.success = false;
      }
    }
  }
}

</script>

<style scoped>
body, html, #app {
  height: 100%;
}
</style>
