document.addEventListener('DOMContentLoaded', () => {
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const changeProfilePicBtn = document.getElementById('change-profile-pic-btn');
    const profilePicUpload = document.getElementById('profile-pic-upload');
  
    // Fetch user profile data on page load
    async function fetchUserProfile() {
      try {
        const response = await fetch('/get_user_profile');
        const result = await response.json();
  
        if (result.success) {
          const userData = result.user;
          
          // Populate display fields
          document.getElementById('display-name').textContent = userData.name || '';
          document.getElementById('display-username').textContent = userData.username || '';
          document.getElementById('display-email').textContent = userData.email || '';
          document.getElementById('display-gender').textContent = userData.gender || '';
          document.getElementById('display-residence').textContent = userData.placeOfResidence || '';
          document.getElementById('display-study').textContent = userData.fieldOfStudy || '';
          document.getElementById('display-language').textContent = userData.preferredLanguage || '';
          
          // Set profile picture if exists
          if (userData.profile_pic) {
            document.getElementById('profile-picture').src = userData.profile_pic;
          }
        } else {
          console.error('Failed to fetch user profile');
          alert('Failed to load user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        alert('An error occurred while fetching user profile');
      }
    }
  
    // Call fetch user profile on page load
    fetchUserProfile();
  
  });
  // Edit Profile Functionality
  editProfileBtn.addEventListener('click', () => {
      // Show edit inputs, hide displays
      document.querySelectorAll('.profile-field span').forEach(span => {
          span.style.display = 'none';
      });
      document.querySelectorAll('.edit-input').forEach(input => {
          const displayValue = input.previousElementSibling.textContent;
          input.value = displayValue;
          input.style.display = 'block';
      });

      editProfileBtn.style.display = 'none';
      saveProfileBtn.style.display = 'block';
      cancelEditBtn.style.display = 'block';
  });

  // Save Profile Functionality
  saveProfileBtn.addEventListener('click', async () => {
      const updatedProfile = {
          name: document.getElementById('edit-name').value,
          gender: document.getElementById('edit-gender').value,
          placeOfResidence: document.getElementById('edit-residence').value,
          fieldOfStudy: document.getElementById('edit-study').value,
          preferredLanguage: document.getElementById('edit-language').value
      };

      try {
          const response = await fetch('/update_profile', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(updatedProfile)
          });

          const result = await response.json();

          if (result.success) {
              // Update display values
              document.getElementById('display-name').textContent = updatedProfile.name;
              document.getElementById('display-gender').textContent = updatedProfile.gender;
              document.getElementById('display-residence').textContent = updatedProfile.placeOfResidence;
              document.getElementById('display-study').textContent = updatedProfile.fieldOfStudy;
              document.getElementById('display-language').textContent = updatedProfile.preferredLanguage;

              // Hide edit inputs, show displays
              document.querySelectorAll('.profile-field span').forEach(span => {
                  span.style.display = 'block';
              });
              document.querySelectorAll('.edit-input').forEach(input => {
                  input.style.display = 'none';
              });

              editProfileBtn.style.display = 'block';
              saveProfileBtn.style.display = 'none';
              cancelEditBtn.style.display = 'none';
          } else {
              alert('Failed to update profile: ' + result.message);
          }
      } catch (error) {
          console.error('Error updating profile:', error);
          alert('An error occurred while updating profile');
      }
  });

  // Cancel Edit Functionality
  cancelEditBtn.addEventListener('click', () => {
      // Hide edit inputs, show displays
      document.querySelectorAll('.profile-field span').forEach(span => {
          span.style.display = 'block';
      });
      document.querySelectorAll('.edit-input').forEach(input => {
          input.style.display = 'none';
      });

      editProfileBtn.style.display = 'block';
      saveProfileBtn.style.display = 'none';
      cancelEditBtn.style.display = 'none';
  });

  // Profile Picture Upload Functionality
  changeProfilePicBtn.addEventListener('click', () => {
      profilePicUpload.click();
  });

  profilePicUpload.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (file) {
          const formData = new FormData();
          formData.append('profile_pic', file);

          try {
              const response = await fetch('/upload_profile_picture', {
                  method: 'POST',
                  body: formData
              });

              const result = await response.json();

              if (result.success) {
                  // Update profile picture
                  document.getElementById('profile-picture').src = result.profile_pic_url;
              } else {
                  alert('Failed to upload profile picture: ' + result.message);
              }
          } catch (error) {
              console.error('Error uploading profile picture:', error);
              alert('An error occurred while uploading profile picture');
          }
      }
  });
