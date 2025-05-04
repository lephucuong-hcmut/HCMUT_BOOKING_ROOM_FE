export function checkAuth(router) {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('Vui lòng đăng nhập lại');
      router.push('/signin');
      return false;
    }
    return true;
  }