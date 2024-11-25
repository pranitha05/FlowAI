// reset_password.js
import CONFIG from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    const resetPasswordMessage = document.getElementById('resetPasswordMessage');
    const backendUrl = CONFIG.BACKEND_BASE_URL || 'http://localhost:8000';
    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
  
    if (!token) {
      resetPasswordMessage.textContent = 'Invalid or missing token.';
      resetPasswordForm.style.display = 'none';
      return;
    }
  
    resetPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      resetPasswordMessage.textContent = '';
  
      const password = document.getElementById('reset-password').value;
      const confirmPassword = document.getElementById('reset-confirm-password').value;
  
      if (!password || !confirmPassword) {
        resetPasswordMessage.textContent = 'Please fill in all fields.';
        resetPasswordMessage.style.color = 'red';
        return;
      }
  
      if (password !== confirmPassword) {
        resetPasswordMessage.textContent = 'Passwords do not match.';
        resetPasswordMessage.style.color = 'red';
        return;
      }
  
      try {
        const response = await fetch(`${backendUrl}/user/reset_password/${token}`, { // Update with BACKEND_BASE_URL
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });
  
        const data = await response.json();
  
        if (response.ok) {
          resetPasswordMessage.style.color = 'green';
          resetPasswordMessage.textContent = data.message || 'Password has been reset successfully.';
          // Redirect to login after a delay
          setTimeout(() => {
            window.location.href = '/auth';
          }, 3000);
        } else {
          resetPasswordMessage.style.color = 'red';
          resetPasswordMessage.textContent = data.error || 'Reset failed.';
        }
      } catch (error) {
        resetPasswordMessage.style.color = 'red';
        resetPasswordMessage.textContent = 'An error occurred. Please try again.';
        console.error('Reset Password Error:', error);
      }
    });
  });