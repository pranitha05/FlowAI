// auth.js
import CONFIG from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const formSections = document.querySelectorAll('.form-section');
    const backendUrl = CONFIG.BACKEND_BASE_URL || 'http://localhost:8000';

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            // Hide all form sections
            formSections.forEach(section => section.classList.add('hidden'));
            // Show the target form section
            const target = button.getAttribute('data-tab');
            document.getElementById(target).classList.remove('hidden');
        });
    });

    // Utility function to display messages
    const displayMessage = (element, message, isSuccess = false) => {
        element.textContent = message;
        element.style.color = isSuccess ? 'green' : 'red';
    };

    // Login Form Submission
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        displayMessage(loginMessage, '');

        const identifier = document.getElementById('login-identifier').value.trim();
        const password = document.getElementById('login-password').value;

        if (!identifier || !password) {
            displayMessage(loginMessage, 'Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Save the token securely (consider using secure storage in production)
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('preferredLanguage', data.preferredLanguage || 'en');

                // Redirect to dashboard
                window.location.href = '/dashboard';
            } else {
                displayMessage(loginMessage, data.msg || data.error || 'Login failed.');
            }
        } catch (error) {
            displayMessage(loginMessage, 'An error occurred. Please try again.');
            console.error('Login Error:', error);
        }
    });

    // Signup Form Submission
const signupForm = document.getElementById('signupForm');
const signupMessage = document.getElementById('signupMessage');

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    displayMessage(signupMessage, '');

    // Create a FormData object
    const formData = new FormData();

    // Append form fields to FormData
    formData.append('username', document.getElementById('signup-username').value.trim());
    formData.append('email', document.getElementById('signup-email').value.trim());
    formData.append('password', document.getElementById('signup-password').value);
    formData.append('name', document.getElementById('signup-name').value.trim());
    formData.append('age', parseInt(document.getElementById('signup-age').value, 10));
    formData.append('gender', document.getElementById('signup-gender').value);
    formData.append('fieldOfStudy', document.getElementById('signup-study').value.trim());
    formData.append('preferredLanguage', document.getElementById('signup-language').value);

    // Append the profile picture file if it exists
    const profilePicInput = document.getElementById('signup-profile-pic');
    if (profilePicInput.files[0]) {
        formData.append('profile_picture', profilePicInput.files[0]);
    }

    try {
        const response = await fetch(`${backendUrl}/user/signup`, {
            method: 'POST',
            body: formData // Let the browser set the Content-Type to multipart/form-data
        });

        const data = await response.json();

        if (response.ok) {
            // Save the token securely (consider using secure storage in production)
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('preferredLanguage', data.preferredLanguage || 'en');
            // Redirect to dashboard
            window.location.href = '/dashboard';
        } else {
            displayMessage(signupMessage, data.error || 'Signup failed.');
        }
    } catch (error) {
        displayMessage(signupMessage, 'An error occurred. Please try again.');
        console.error('Signup Error:', error);
    }
});

    // Forgot Password Form Submission
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const forgotPasswordMessage = document.getElementById('forgotPasswordMessage');

    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        displayMessage(forgotPasswordMessage, '');

        const email = document.getElementById('forgot-email').value.trim();

        if (!email) {
            displayMessage(forgotPasswordMessage, 'Please enter your email.');
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/user/request_reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                displayMessage(forgotPasswordMessage, data.message || 'Reset link sent to your email.', true);
            } else {
                displayMessage(forgotPasswordMessage, data.error || 'Request failed.');
            }
        } catch (error) {
            displayMessage(forgotPasswordMessage, 'An error occurred. Please try again.');
            console.error('Forgot Password Error:', error);
        }
    });

    // Show Reset Password Section
    window.showResetPassword = function() {
        document.getElementById('login').classList.add('hidden');
        document.getElementById('reset-password').classList.remove('hidden');
    }

    // Show Login Section
    window.showLogin = function() {
        document.getElementById('reset-password').classList.add('hidden');
        document.getElementById('login').classList.remove('hidden');
    }

    
});