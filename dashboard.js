const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.createElement("div");
toggleBtn.className = "toggle-btn";
toggleBtn.innerHTML = `<span></span><span></span><span></span>`;
document.body.prepend(toggleBtn);

//button
toggleBtn.addEventListener("click", function() {
  sidebar.classList.toggle("collapsed");
});

const dateElement = document.querySelector('.date');
if (dateElement) {
    const today = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    dateElement.textContent = today.toLocaleDateString('en-US', options);
}

let tasks = [];


  //storage_area_imp hai

function loadTasks() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }
}

function getTotalTasks() {
  return tasks.length;
}

function getCompletedTasks() {
  let count = 0;
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].completed) {
      count++;
    }
  }
  return count;
}

function getPendingTasks() {
  let count = 0;
  for (let i = 0; i < tasks.length; i++) {
    if (!tasks[i].completed) {
      count++;
    }
  }
  return count;
}

function getCompletionRate() {
  const total = getTotalTasks();
  const completed = getCompletedTasks();
  
  if (total > 0) {
    return Math.round((completed / total) * 100);
  }
  return 0;
}
///main thing
function updateStatsDisplay() {
  const total = getTotalTasks();
  const completed = getCompletedTasks();
  const pending = getPendingTasks();
  const rate = getCompletionRate();

  const totalTasksEl = document.getElementById('total-tasks');
  const pendingTasksEl = document.getElementById('pending-tasks');
  const completedTasksEl = document.getElementById('completed-tasks');
  const completionRateEl = document.getElementById('completion-rate');

  if (totalTasksEl) {
    totalTasksEl.textContent = total;
  }
  if (pendingTasksEl) {
    pendingTasksEl.textContent = pending;
  }
  if (completedTasksEl) {
    completedTasksEl.textContent = completed;
  }
  if (completionRateEl) {
    completionRateEl.textContent = rate + '%';
  }

  const progressBar = document.getElementById('dashboard-progress-bar');
  if (progressBar) {
    progressBar.style.width = rate + '%';
  }
  
  const progressText = document.getElementById('progress-text');
  if (progressText) {
    progressText.textContent = completed + ' of ' + total + ' tasks completed';
  }

  if (total > 0 && rate === 100) {
    showConfetti();
  }
}

function showRecentTasks() {
  const recentTasksList = document.getElementById('recent-tasks-list');
  
  if (!recentTasksList) {
    return;
  }

  recentTasksList.innerHTML = '';

  if (tasks.length === 0) {
    recentTasksList.innerHTML = '<li class="activity-item">No tasks yet. <a href="index.html">Add your first task!</a></li>';
    return;
  }

  const lastFiveTasks = tasks.slice(-5).reverse();

  for (let i = 0; i < lastFiveTasks.length; i++) {
    const task = lastFiveTasks[i];
    const li = document.createElement('li');
    li.className = 'activity-item';
    
    let statusIcon = '⏳';
    let statusText = 'Pending';
    
    if (task.completed) {
      statusIcon = '✅';
      statusText = 'Completed';
    }
    
    let dateInfo = '';
    if (task.date) {
      dateInfo = ' • ' + task.date;
    }
    
    li.innerHTML = '<strong>' + statusIcon + ' ' + task.name + '</strong>' +
      '<small style="color: #666; display: block; margin-top: 5px;">' +
      task.category + ' • ' + task.priority + ' Priority • ' + statusText + dateInfo +
      '</small>';
    
    recentTasksList.appendChild(li);
  }
}

function updateDashboard() {
  loadTasks();
  updateStatsDisplay();
  showRecentTasks();
}

const searchInput = document.querySelector('.search');
const searchIcon = document.querySelector('.search-icon');

if (searchIcon && searchInput) {
  searchIcon.addEventListener('click', function() {
    searchInput.classList.toggle('active');
    if (searchInput.classList.contains('active')) {
      searchInput.focus();
    }
  });

  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const activityItems = document.querySelectorAll('.activity-item');
    
    for (let i = 0; i < activityItems.length; i++) {
      const item = activityItems[i];
      const itemText = item.textContent.toLowerCase();
      
      if (itemText.includes(searchTerm)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    }
  });
}
//darkmode
const darkModeCheckbox = document.getElementById('dark-mode-checkbox');
const savedDarkMode = localStorage.getItem('darkMode');

if (savedDarkMode === 'enabled') {
  document.body.classList.add('dark-mode');
  if (darkModeCheckbox) {
    darkModeCheckbox.checked = true;
  }
}

if (darkModeCheckbox) {
  darkModeCheckbox.addEventListener('change', function() {
    if (this.checked) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
    }
  });

  
}

const savedUsername = localStorage.getItem('username');
if (savedUsername) {
  const usernameDisplay = document.querySelector('.sidebar-footer p');
  if (usernameDisplay) {
    usernameDisplay.textContent = 'Logged in as: ' + savedUsername;
  }
}

function showConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) {
    return;
  }
  
  const ctx = canvas.getContext('2d');

  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiPieces = [];
  const numberOfPieces = 150;

  for (let i = 0; i < numberOfPieces; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      radius: Math.random() * 6 + 2,
      density: Math.random() * numberOfPieces,
      color: 'hsl(' + (Math.random() * 360) + ', 100%, 50%)',
      tilt: Math.random() * 10 - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0
    });
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < confettiPieces.length; i++) {
      const piece = confettiPieces[i];
      
      ctx.beginPath();
      ctx.lineWidth = piece.radius / 2;
      ctx.strokeStyle = piece.color;
      ctx.moveTo(piece.x + piece.tilt + piece.radius / 4, piece.y);
      ctx.lineTo(piece.x + piece.tilt, piece.y + piece.tilt + piece.radius / 4);
      ctx.stroke();

      piece.tiltAngle = piece.tiltAngle + piece.tiltAngleIncremental;
      piece.y = piece.y + (Math.cos(piece.density) + 3 + piece.radius / 2) / 2;
      piece.x = piece.x + Math.sin(piece.density);
      piece.tilt = Math.sin(piece.tiltAngle - i / 3) * 15;

      if (piece.y > canvas.height) {
        confettiPieces.splice(i, 1);
        i--;
      }
    }

    if (confettiPieces.length > 0) {
      requestAnimationFrame(drawConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }






  }

  drawConfetti();
}
setInterval(function() {
  updateDashboard();
}, 3000);
updateDashboard();