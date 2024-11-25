
document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;
    const themeToggle = document.querySelector('.switch input');
    
    // Initialize theme based on user's preference or default to dark
    const userPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const currentTheme = localStorage.getItem('theme') || (userPrefersLight ? 'light' : 'dark');
    html.setAttribute('data-theme', currentTheme);
    themeToggle.checked = currentTheme === 'light';
  
    // Theme toggle function
    themeToggle.addEventListener('change', () => {
      const newTheme = themeToggle.checked ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      initializeParticles(newTheme);
    });
  
    // Initialize particles.js
    initializeParticles(currentTheme);
  });
  
  function initializeParticles(theme) {
    const particleColor = theme === 'light' ? "#4287f5" : "#1ABC9C";
    const linkColor = theme === 'light' ? "#5ca4ff" : "#1ABC9C";
  
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 60,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": particleColor
        },
        "shape": {
          "type": "circle"
        },
        "opacity": {
          "value": 0.6,
          "random": true
        },
        "size": {
          "value": 3,
          "random": true
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": linkColor,
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 2,
          "direction": "top-right",
          "random": true,
          "out_mode": "out"
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "repulse"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "repulse": {
            "distance": 100,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          }
        }
      },
      "retina_detect": true
    });
  }
  
  // Logout Function (if not already defined in individual pages)
  function logout() {
    // Add logout logic here
    alert('Logout functionality to be implemented.');
  }