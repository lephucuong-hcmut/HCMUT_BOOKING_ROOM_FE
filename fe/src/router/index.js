import { createRouter, createWebHistory } from 'vue-router';
import SignIn from '../components/SignIn.vue';
import SignUp from '../components/SignUp.vue';
import ReservationBooking from '../components/ReservationBooking.vue';
import SystemAdmin from '../components/SystemAdmin.vue';
import HomePage from '../components/HomePage.vue';
import QrCheckin from '../components/QrCheckin.vue'
const routes = [
  { path: '/signin', component: SignIn, name: 'signin' }, // Đặt tên cho route
  { path: '/signup', component: SignUp, name: 'signup' }, // Đặt tên cho route
  { path: '/forgot-password', component: () => import('../components/ForgotPassword.vue'), name: 'forgotPassword' },
  { path: '/reservation', component: ReservationBooking, name: 'reservation' },
  { path: '/admin', component: SystemAdmin, name: 'admin' },
  { path: '/home', component: HomePage, name: 'home' },
  { path: '/calendar', component: () => import('../components/MyCalendar.vue'), name: 'calendar' },
  { path: '/qr-checkin', component: QrCheckin, name: 'qr-checkin' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Thêm navigation guard để debug
router.beforeEach((to, from, next) => {
  console.log(`Navigating from ${from.path} to ${to.path}`);
  next();
});

export default router;
