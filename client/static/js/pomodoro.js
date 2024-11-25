// pomodoro.js

document.addEventListener('DOMContentLoaded', () => {
    let timer;
    let isRunning = false;
    let isStudySession = true;
    let studyTime = 25 * 60; // Default study time in seconds
    let breakTime = 5 * 60;  // Default break time in seconds
    let timeLeft = studyTime;
  
    const timerDisplay = document.getElementById("timerDisplay");
    const startBtn = document.getElementById("startBtn");
    const pauseBtn = document.getElementById("pauseBtn");
    const resetBtn = document.getElementById("resetBtn");
    const progress = document.getElementById("progress");
    const statusMessage = document.getElementById("statusMessage");
    const dingSound = document.getElementById("dingSound");
    const studyInput = document.getElementById("study-time");
    const breakInput = document.getElementById("break-time");
  
    // Initialize timer display and progress bar
    timerDisplay.textContent = formatTime(timeLeft);
    updateProgressBar(isStudySession ? studyTime : breakTime, timeLeft);
  
    // Update the timer display
    function formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secondsLeft = seconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
    }
  
    // Update progress bar
    function updateProgressBar(totalTime, timeLeft) {
      const progressPercentage = ((totalTime - timeLeft) / totalTime) * 100;
      progress.style.width = `${progressPercentage}%`;
    }
  
    // Switch session (study/break)
    function switchSession() {
      if (isStudySession) {
        timeLeft = breakTime;
        isStudySession = false;
        statusMessage.textContent = "Congrats! Time for a break!";
      } else {
        timeLeft = studyTime;
        isStudySession = true;
        statusMessage.textContent = "Time to study! Get back to work!";
      }
      dingSound.play();
      timerDisplay.textContent = formatTime(timeLeft);
      updateProgressBar(isStudySession ? studyTime : breakTime, timeLeft);
    }
  
    // Start the timer
    function startTimer() {
      if (isRunning) return;
      isRunning = true;
      startBtn.disabled = true;
      pauseBtn.disabled = false;
  
      timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);
        updateProgressBar(isStudySession ? studyTime : breakTime, timeLeft);
  
        if (timeLeft <= 0) {
          clearInterval(timer);
          switchSession();
          startTimer();
        }
      }, 1000);
    }
  
    // Pause the timer
    function pauseTimer() {
      clearInterval(timer);
      isRunning = false;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
    }
  
    // Reset the timer
    function resetTimer() {
      clearInterval(timer);
      isRunning = false;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      statusMessage.textContent = "";
      timeLeft = studyTime;
      timerDisplay.textContent = formatTime(timeLeft);
      progress.style.width = '0%';
    }
  
    // Event listeners for buttons
    startBtn.addEventListener("click", startTimer);
    pauseBtn.addEventListener("click", pauseTimer);
    resetBtn.addEventListener("click", resetTimer);
  
    // Event listeners for study and break time inputs
    studyInput.addEventListener("change", function() {
      const newStudyTime = parseInt(this.value);
      if (isNaN(newStudyTime) || newStudyTime < 1 || newStudyTime > 60) {
        alert("Please enter a valid study time between 1 and 60 minutes.");
        this.value = studyTime / 60;
        return;
      }
      studyTime = newStudyTime * 60;
      if (isStudySession) {
        timeLeft = studyTime;
        timerDisplay.textContent = formatTime(timeLeft);
        updateProgressBar(studyTime, timeLeft);
      }
    });
  
    breakInput.addEventListener("change", function() {
      const newBreakTime = parseInt(this.value);
      if (isNaN(newBreakTime) || newBreakTime < 1 || newBreakTime > 30) {
        alert("Please enter a valid break time between 1 and 30 minutes.");
        this.value = breakTime / 60;
        return;
      }
      breakTime = newBreakTime * 60;
      if (!isStudySession) {
        timeLeft = breakTime;
        timerDisplay.textContent = formatTime(timeLeft);
        updateProgressBar(breakTime, timeLeft);
      }
    });
  });