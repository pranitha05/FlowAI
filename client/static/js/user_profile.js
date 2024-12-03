// user_profile.js

import CONFIG from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const backendUrl = CONFIG.BACKEND_BASE_URL || 'http://localhost:8000';
  
    // Get the user ID from localStorage
    const userId = localStorage.getItem('userId');
    console.log('Retrieved userId:', userId); // Debugging
  
    if (!userId) {
        alert('User ID not found. Please log in again.');
        window.location.href = 'login.html'; // Redirect to login if userId is missing
        return;
    }
  
    // DOM Elements
    const displayName = document.getElementById('display-name');
    const displayUsername = document.getElementById('display-username');
    const displayEmail = document.getElementById('display-email');
    const displayGender = document.getElementById('display-gender');
    const displayResidence = document.getElementById('display-residence');
    const displayStudy = document.getElementById('display-study');
    const displayLanguage = document.getElementById('display-language');
  
    const editName = document.getElementById('edit-name');
    const editGender = document.getElementById('edit-gender');
    const editResidence = document.getElementById('edit-residence');
    const editStudy = document.getElementById('edit-study');
    const editLanguage = document.getElementById('edit-language');
  
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
  
    const profilePic = document.getElementById('profile-picture');
    const profilePicUpload = document.getElementById('profile-pic-upload');
    // Removed changeProfilePicBtn and profilePictureField
  
    const editProfilePic = document.querySelector('.edit-profile-pic'); // New
    const themeToggleCheckbox = document.querySelector('.theme-toggle input[type="checkbox"]');
  
    // Fetch and display user profile
    async function fetchUserProfile() {
      try {
        const response = await fetch( `${backendUrl}/user/profile/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Include authentication headers if necessary
            // 'Authorization': `Bearer ${token}`,
          },
          cache: 'no-cache', // Prevent caching
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          alert(`Error: ${errorData.error || 'Failed to fetch user profile.'}`);
          return;
        }
  
        const data = await response.json();
        console.log('Fetched user profile:', data); // Debugging
        populateProfile(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        alert('An unexpected error occurred while fetching your profile.');
      }
    }
  
    // Populate the profile fields with fetched data
    function populateProfile(data) {
      displayName.textContent = data.name || 'N/A';
      displayUsername.textContent = data.username || 'N/A';
      displayEmail.textContent = data.email || 'N/A';
      displayGender.textContent = capitalizeFirstLetter(data.gender) || 'N/A';
      displayResidence.textContent = data.placeOfResidence || 'N/A';
      displayStudy.textContent = data.fieldOfStudy || 'N/A';
      displayLanguage.textContent = getLanguageName(data.preferredLanguage) || 'N/A';
  
      // Set profile picture with cache busting
      if (data.profile_picture) {
        let imageUrl;
        if (data.profile_picture.startsWith('http') || data.profile_picture.startsWith('https')) {
          imageUrl = data.profile_picture; // Absolute URL
        } else {
          imageUrl = `${backendUrl}${data.profile_picture}`; // Relative path
        }
  
        // Append timestamp to prevent caching
        const timestamp = new Date().getTime();
        profilePic.src = `${imageUrl}?t=${timestamp}`;
      } else {
        profilePic.src = '../static/images/default_user_icon.png'; // Fallback
      }
    }

    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
      if (!string) return '';
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  
    // Helper function to get language name from code
    function getLanguageName(code) {
      const languages = {
        en: 'English',
        ta: 'Tamil',
        hi: 'Hindi',
        ml: 'Malayalam',
        fr: 'French',
        zh: 'Chinese',
      };
      return languages[code] || code;
    }
  
    // Edit Profile Button Click
    editProfileBtn.addEventListener('click', () => {
      toggleEditMode(true);
    });
  
    // Save Profile Button Click
    saveProfileBtn.addEventListener('click', async () => {
      const updatedData = {
        name: editName.value.trim(),
        gender: editGender.value,
        placeOfResidence: editResidence.value.trim(),
        fieldOfStudy: editStudy.value.trim(),
        preferredLanguage: editLanguage.value,
      };
  
      // Validate input fields as needed
      if (!updatedData.name) {
        alert('Name cannot be empty.');
        return;
      }
  
      try {
        const formData = new FormData();
        for (const key in updatedData) {
          formData.append(key, updatedData[key]);
        }
  
        // If a new profile picture is selected
        if (profilePicUpload.files[0]) {
          formData.append('profile_picture', profilePicUpload.files[0]);
          console.log('New profile picture appended:', profilePicUpload.files[0]); // Debugging
        }
  
        const response = await fetch(`${backendUrl}/user/profile/${userId}`, {
          method: 'PATCH',
          body: formData,
          // If you're using JSON, set headers accordingly and send JSON.stringify(updatedData)
          // headers: {
          //   'Content-Type': 'application/json',
          //   'Authorization': `Bearer ${token}`,
          // },
          // body: JSON.stringify(updatedData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          alert(`Error: ${errorData.error || 'Failed to update profile.'}`);
          return;
        }
  
        const successData = await response.json();
        alert(successData.message || 'Profile updated successfully.');
        toggleEditMode(false);
        fetchUserProfile(); // Refresh the profile data
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('An unexpected error occurred while updating your profile.');
      }
    });
  
    // Cancel Edit Button Click
    cancelEditBtn.addEventListener('click', () => {
      toggleEditMode(false);
      fetchUserProfile(); // Reset to original data
    });
  
    // Toggle Edit Mode
    function toggleEditMode(isEditMode) {
      if (isEditMode) {
        // Show input fields
        editName.style.display = 'block';
        editGender.style.display = 'block';
        editResidence.style.display = 'block';
        editStudy.style.display = 'block';
        editLanguage.style.display = 'block';
        // Removed profilePictureField.style.display
  
        // Hide display spans
        displayName.style.display = 'none';
        displayGender.style.display = 'none';
        displayResidence.style.display = 'none';
        displayStudy.style.display = 'none';
        displayLanguage.style.display = 'none';
  
        // Populate input fields with current data
        editName.value = displayName.textContent;
        editGender.value = displayGender.textContent.toLowerCase();
        editResidence.value = displayResidence.textContent;
        editStudy.value = displayStudy.textContent;
        editLanguage.value = getLanguageCode(displayLanguage.textContent);
  
        // Show save and cancel buttons, hide edit button
        saveProfileBtn.style.display = 'inline-block';
        cancelEditBtn.style.display = 'inline-block';
        editProfileBtn.style.display = 'none';
  
        // Show edit profile picture icon
        if (editProfilePic) {
          editProfilePic.style.display = 'block';
        }
      } else {
        // Hide input fields
        editName.style.display = 'none';
        editGender.style.display = 'none';
        editResidence.style.display = 'none';
        editStudy.style.display = 'none';
        editLanguage.style.display = 'none';
        // Removed profilePictureField.style.display = 'none';
  
        // Show display spans
        displayName.style.display = 'inline';
        displayGender.style.display = 'inline';
        displayResidence.style.display = 'inline';
        displayStudy.style.display = 'inline';
        displayLanguage.style.display = 'inline';
  
        // Show edit button, hide save and cancel buttons
        saveProfileBtn.style.display = 'none';
        cancelEditBtn.style.display = 'none';
        editProfileBtn.style.display = 'inline-block';
  
        // Hide edit profile picture icon
        if (editProfilePic) {
          editProfilePic.style.display = 'none';
        }
      }
    }
    // Event Listener for Edit Profile Button
    editProfileBtn.addEventListener('click', () => {
    toggleEditMode(true);
  });
  
    // Event Listener for Cancel Edit Button
    cancelEditBtn.addEventListener('click', () => {
        toggleEditMode(false);
    });
    // Helper function to get language code from name
    function getLanguageCode(name) {
      const languages = {
        English: 'en',
        Tamil: 'ta',
        Hindi: 'hi',
        Malayalam: 'ml',
        French: 'fr',
        Chinese: 'zh',
      };
      return languages[name] || 'en';
    }
  
    // Profile Picture Upload Change
    profilePicUpload.addEventListener('change', () => {
      const file = profilePicUpload.files[0];
      if (file) {
        // Preview the selected image
        const reader = new FileReader();
        reader.onload = (e) => {
          profilePic.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  
    // Theme Toggle Functionality
    function loadTheme() {
      const savedTheme = localStorage.getItem('theme') || 'dark';
      document.documentElement.setAttribute('data-theme', savedTheme);
      themeToggleCheckbox.checked = savedTheme === 'light';
    }
  
    function toggleTheme() {
      const isLight = themeToggleCheckbox.checked;
      const newTheme = isLight ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    }
  
    themeToggleCheckbox.addEventListener('change', toggleTheme);
  
    // Initialize theme on page load
    loadTheme();
  
    // Logout Function
    window.logout = function () {
      // Clear authentication tokens (e.g., JWT, cookies)
      // Example for JWT stored in localStorage:
      localStorage.removeItem('token');
      // Remove userId as well
      localStorage.removeItem('userId');
      // Redirect to login page
      window.location.href = 'login.html';
    };
  
    // Initial fetch of user profile
    fetchUserProfile();
  });
