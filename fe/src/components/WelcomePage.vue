<template>
  <div class="welcome-container">
    <div class="overlay">
      <h1>HCMUT BOOKING ROOM</h1>
      <div class="button-group">
        <button @click="goToSignIn">Sign in</button>
        <button @click="goToSignUp">Sign up</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WelcomePage',
  methods: {
    goToSignIn() {
      this.$router.push({ name: 'signin' });
    },
    goToSignUp() {
      this.$router.push({ name: 'signup' });
    }
  }
}
</script>

<style scoped>
.welcome-container {
  height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay {
  background-color: rgba(0, 0, 0, 0.6); /* nền tối mờ */
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  color: #fff;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

h1 {
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: bold;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

button {
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  background-color: #00bcd4;
  color: white;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #008ba3;
}
</style>
