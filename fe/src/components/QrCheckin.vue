<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
      <h1 class="text-2xl font-bold text-center mb-6 text-blue-700">Quét QR Check-in</h1>
      
      <!-- Camera QR Scanner -->
      <div v-if="!showQRCapture">
        <qrcode-stream @decode="onDecode" @init="onInit" @error="onQRError"></qrcode-stream>
      </div>

      <!-- QR File Upload -->
      <div class="flex gap-2 mt-4">
        <button
          class="flex-1 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
          @click="toggleQRCapture"
        >
          {{ showQRCapture ? 'Quay lại quét QR' : 'Tải ảnh QR từ máy' }}
        </button>
      </div>

      <!-- QR File Upload Component -->
      <div v-if="showQRCapture" class="mt-4">
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileUpload"
            accept="image/*"
            class="hidden"
          />
          <div 
            class="cursor-pointer text-center"
            @click="$refs.fileInput.click()"
          >
            <p v-if="!selectedFile" class="text-gray-600">Nhấn vào đây để chọn ảnh QR code</p>
            <p v-else class="text-green-600">Đã chọn file: {{ selectedFile.name }}</p>
          </div>
        </div>
      </div>

      <!-- Manual QR code text input -->
      <div class="mt-6">
        <h2 class="text-lg font-semibold text-center mb-2">Hoặc nhập mã QR thủ công</h2>
        <div class="flex flex-col gap-2">
          <input
            v-model="manualQRText"
            type="text"
            placeholder="Dán mã QR vào đây"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Check-in Button -->
      <div class="mt-4">
        <button
          @click="handleCheckIn"
          :disabled="isProcessing || (!selectedFile && !manualQRText.trim())"
          :class="{
            'bg-blue-600 hover:bg-blue-700': !isProcessing && (selectedFile || manualQRText.trim()),
            'bg-gray-400 cursor-not-allowed': isProcessing || (!selectedFile && !manualQRText.trim())
          }"
          class="w-full text-white px-4 py-2 rounded-lg font-semibold"
        >
          {{ isProcessing ? 'Đang xử lý...' : 'Check-in' }}
        </button>
      </div>

      <!-- Message Display -->
      <div v-if="message" :class="{'text-green-600': success, 'text-red-600': !success}" class="mt-6 text-center font-semibold">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import axios from 'axios'
import jsQR from 'jsqr'

export default {
  name: 'QrCheckin',
  components: { QrcodeStream },
  data() {
    return {
      message: '',
      success: false,
      showQRCapture: false,
      manualQRText: '',
      isProcessing: false,
      selectedFile: null
    }
  },
  methods: {
    toggleQRCapture() {
      this.showQRCapture = !this.showQRCapture;
      this.message = '';
      this.success = false;
      this.selectedFile = null;
      this.manualQRText = '';
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.message = '';
      }
    },

    async handleCheckIn() {
      if (this.isProcessing) return;
      
      if (!this.selectedFile && !this.manualQRText.trim()) {
        this.message = 'Vui lòng chọn ảnh QR hoặc nhập mã QR';
        this.success = false;
        return;
      }

      this.isProcessing = true;
      this.message = 'Đang xử lý...';

      try {
        let qrCode;
        
        if (this.selectedFile) {
          qrCode = await this.readQRFromFile(this.selectedFile);
        } else {
          qrCode = this.manualQRText.trim();
        }

        if (!qrCode) {
          throw new Error('Không thể đọc mã QR từ ảnh hoặc mã không hợp lệ');
        }

        if (!qrCode.includes('|')) {
          throw new Error('Mã QR không hợp lệ. Vui lòng kiểm tra lại.');
        }

        await axios.post('http://127.0.0.1:8000/api/booking/checkin-qr/qr', {
          qr_code: qrCode
        });
        
        this.message = 'Check-in thành công!';
        this.success = true;
        
        // Reset form after success
        this.selectedFile = null;
        this.manualQRText = '';
        
        // Tự động chuyển về chế độ quét camera sau 2 giây
        setTimeout(() => {
          this.showQRCapture = false;
          this.message = '';
        }, 2000);
      } catch (err) {
        if (err.response?.data?.detail) {
          this.message = err.response.data.detail;
        } else if (err.message) {
          this.message = err.message;
        } else {
          this.message = 'Check-in thất bại! Vui lòng thử lại.';
        }
        this.success = false;
      } finally {
        this.isProcessing = false;
      }
    },

    async readQRFromFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const img = new Image();
            img.src = e.target.result;
            await new Promise(resolve => img.onload = resolve);
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            
            // Sử dụng thư viện jsQR để đọc mã QR
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (code) {
              resolve(code.data);
            } else {
              reject(new Error('Không tìm thấy mã QR trong ảnh'));
            }
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },

    async onDecode(result) {
      if (this.isProcessing) return;
      
      this.isProcessing = true;
      this.message = 'Đang xử lý...';
      
      try {
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
      } finally {
        this.isProcessing = false;
      }
    },

    onInit(promise) {
      promise.catch(() => {
        this.message = 'Không thể truy cập camera!';
        this.success = false;
      });
    },

    onQRError(error) {
      console.error(error);
      this.message = 'Không thể quét mã QR. Vui lòng thử lại.';
      this.success = false;
    }
  }
}
</script>

<style scoped>
.hidden {
  display: none;
}
</style>
