const dateElement = document.querySelector(".date");
if (dateElement) {
  const today = new Date();
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  dateElement.textContent = today.toLocaleDateString("en-US", options);
}

const sidebar = document.querySelector(".sidebar");
const toggleBtn = document.createElement("div");
toggleBtn.className = "toggle-btn";
toggleBtn.innerHTML = `
  <span></span>
  <span></span>
  <span></span>
`;
document.body.prepend(toggleBtn);

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

const modalOverlay = document.getElementById('modal-overlay');
const modalBody = document.getElementById('modal-body');
const modalClose = document.querySelector('.modal-close');

function openModal(content) {
  modalBody.innerHTML = content;
  modalOverlay.classList.add('active');
}

function closeModal() {
  modalOverlay.classList.remove('active');
}

if (modalClose) modalClose.addEventListener('click', closeModal);

if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

const tabs = document.querySelectorAll(".sidebar ul li");
const sections = document.querySelectorAll(".content-section");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active-tab"));
    tab.classList.add("active-tab");
    
    const tabId = tab.id;
    
    if (tabId === 'tab-important') {
      const importantTasks = tasks.filter(t => t.priority === 'High' && !t.completed);
      let content = '<h2>⭐ Important Tasks</h2>';
      if (importantTasks.length === 0) {
        content += '<div class="modal-task-item">No high priority tasks! 🎉</div>';
      } else {
        importantTasks.forEach(task => {
          content += `
            <div class="modal-task-item">
              <strong>${task.name}</strong><br>
              <small>${task.date || ''} ${task.time || ''} - ${task.category}</small>
            </div>
          `;
        });
      }
      openModal(content);
    }
    
    else if (tabId === 'tab-all') {
      let content = '<h2>📋 All Tasks</h2>';
      if (tasks.length === 0) {
        content += '<div class="modal-task-item">No tasks yet. Add some tasks!</div>';
      } else {
        tasks.forEach(task => {
          content += `
            <div class="modal-task-item">
              <strong>${task.name}</strong> 
              <span class="priority-badge priority-${task.priority.toLowerCase()}">${task.priority}</span>
              <br>
              <small>${task.date || ''} ${task.time || ''} - ${task.category}</small>
              <br>
              <small>Status: ${task.completed ? '✅ Completed' : '⏳ Pending'}</small>
            </div>
          `;
        });
      }
      openModal(content);
    }
    
    else if (tabId === 'tab-completed') {
      const completedTasks = tasks.filter(t => t.completed);
      let content = '<h2>✅ Completed Tasks</h2>';
      if (completedTasks.length === 0) {
        content += '<div class="modal-task-item">No completed tasks yet. Keep going! 💪</div>';
      } else {
        completedTasks.forEach(task => {
          content += `
            <div class="modal-task-item">
              <strong>${task.name}</strong><br>
              <small>${task.date || ''} ${task.time || ''} - ${task.category}</small>
            </div>
          `;
        });
      }
      openModal(content);
    }
    
    else if (tabId === 'tab-settings') {
      openModal(`
        <h2>⚙️ Settings</h2>
        <div class="setting-item">
          <h3>👤 Profile</h3>
          <input type="text" id="username-input-modal" placeholder="Enter your name" class="searchsm" style="width: 100%;">
          <button onclick="updateUsername()" class="searchsm" style="background:#4CAF50; color:white; margin-top: 10px;">Save Name</button>
        </div>
        <div class="setting-item">
          <h3>🎨 Theme</h3>
          <p>Use the Dark Mode toggle in the sidebar</p>
        </div>
        <div class="setting-item">
          <h3>🗑️ Clear Data</h3>
          <button onclick="clearAllTasks()" class="searchsm" style="background:#f44336; color:white;">Clear All Tasks</button>
        </div>
      `);
    }
  });
});

function updateUsername() {
  const usernameInput = document.getElementById('username-input-modal');
  const newUsername = usernameInput ? usernameInput.value.trim() : '';
  if (newUsername) {
    localStorage.setItem('username', newUsername);
    document.getElementById('display-username').textContent = newUsername;
    alert('Username updated! ✅');
    closeModal();
  }
}

function clearAllTasks() {
  if (confirm('Are you sure you want to delete all tasks?')) {
    tasks = [];
    saveTasks();
    renderTasks();
    alert('All tasks cleared! 🗑️');
    closeModal();
  }
}

sections.forEach((sec, index) => {
  sec.style.display = index === 0 ? "block" : "none";
});

const icon = document.querySelector(".search-icon");
const input = document.querySelector(".search");

if (icon && input) {
  icon.addEventListener("click", () => {
    input.classList.toggle("active");
    if (input.classList.contains("active")) input.focus();
    else input.blur();
  });
}

let tasks = [];
let currentFilter = 'all';

function loadTasks() {
  const savedTasks = localStorage.getItem('tasks');
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    renderTasks();
  }
  
  const savedUsername = localStorage.getItem('username');
  if (savedUsername) {
    document.getElementById('display-username').textContent = savedUsername;
  }
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const addTaskBtn = document.getElementById('add-task-btn');
if (addTaskBtn) {
  addTaskBtn.addEventListener('click', function() {
    const taskName = document.getElementById('task-name').value.trim();
    const taskDate = document.getElementById('task-date').value;
    const taskTime = document.getElementById('task-time').value;
    const taskPeriod = document.getElementById('task-period').value;
    const taskPriority = document.getElementById('task-priority').value;
    const taskCategory = document.getElementById('task-category').value;

    if (!taskName) {
      alert('Please enter a task name');
      return;
    }

    const newTask = {
      id: generateId(),
      name: taskName,
      date: taskDate,
      time: taskTime,
      period: taskPeriod,
      priority: taskPriority,
      category: taskCategory,
      completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    document.getElementById('task-name').value = '';
    document.getElementById('task-date').value = '';
    document.getElementById('task-time').value = '';
  });
}

function renderTasks(filter = 'all') {
  const container = document.getElementById('tasks-container');
  if (!container) return;
  
  container.innerHTML = '';

  let filteredTasks = tasks;
  if (filter === 'pending') {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (filter === 'completed') {
    filteredTasks = tasks.filter(task => task.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.setAttribute('draggable', 'true');
    li.dataset.id = task.id;

    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
      <div class="task-text">
        <strong>${task.name}</strong>
        <div style="font-size: 12px; color: #666;">
          ${task.date ? task.date : ''} ${task.time ? task.time : ''} - ${task.period}
        </div>
      </div>
      <span class="priority-badge priority-${task.priority.toLowerCase()}">${task.priority}</span>
      <span class="category-badge">${task.category}</span>
      <div class="task-actions">
        <button class="edit-btn" data-id="${task.id}">Edit</button>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
      </div>
    `;

    container.appendChild(li);
  });

  updateStats();
  addTaskEventListeners();
  addDragListeners();
}

function updateStats() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const pendingCount = document.getElementById('pending-count');
  const completedCount = document.getElementById('completed-count');
  const progressBar = document.getElementById('progress-bar');

  if (pendingCount) pendingCount.textContent = pendingTasks;
  if (completedCount) completedCount.textContent = completedTasks;

  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  if (progressBar) progressBar.style.width = progress + '%';

  if (totalTasks > 0 && completedTasks === totalTasks) triggerConfetti();
}

function addTaskEventListeners() {
  document.querySelectorAll('.task-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const taskId = this.dataset.id;
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks(currentFilter);
      }
    });
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const taskId = this.dataset.id;
      tasks = tasks.filter(t => t.id !== taskId);
      saveTasks();
      renderTasks(currentFilter);
    });
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const taskId = this.dataset.id;
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const newName = prompt('Edit task name:', task.name);
        if (newName && newName.trim()) {
          task.name = newName.trim();
          saveTasks();
          renderTasks(currentFilter);
        }
      }
    });
  });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentFilter = this.dataset.filter;
    renderTasks(currentFilter);
  });
});

const darkModeCheckbox = document.getElementById('dark-mode-checkbox');
if (darkModeCheckbox) {
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeCheckbox.checked = true;
  }

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

const searchInput = document.querySelector('.search');

function highlightText(element, searchTerm) {
  if (!element || !searchTerm) return;
  
  const originalText = element.getAttribute('data-original-text') || element.innerHTML;
  
  if (!element.hasAttribute('data-original-text')) {
    element.setAttribute('data-original-text', originalText);
  }
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const highlightedText = originalText.replace(regex, '<mark class="highlight">$1</mark>');
  element.innerHTML = highlightedText;
}

function removeHighlights() {
  document.querySelectorAll('.task-item').forEach(item => {
    const taskText = item.querySelector('.task-text strong');
    if (taskText && taskText.hasAttribute('data-original-text')) {
      taskText.innerHTML = taskText.getAttribute('data-original-text');
    }
  });
}

if (searchInput) {
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    const taskItems = document.querySelectorAll('.task-item');

    if (searchInput) {
      searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const taskItems = document.querySelectorAll('.task-item');
        
        removeHighlights();
        
        if (searchTerm === '') {
          taskItems.forEach(item => {
            item.style.display = 'flex';
            item.classList.remove('search-match');
          });
          return;
        }
        
        let firstMatch = null;
        
        taskItems.forEach(item => {
          const taskText = item.querySelector('.task-text');
          const taskTextStrong = item.querySelector('.task-text strong');
          const priorityBadge = item.querySelector('.priority-badge');
          const categoryBadge = item.querySelector('.category-badge');
          
          const taskName = taskText ? taskText.textContent.toLowerCase() : '';
          const priority = priorityBadge ? priorityBadge.textContent.toLowerCase() : '';
          const category = categoryBadge ? categoryBadge.textContent.toLowerCase() : '';
          
          const searchableText = taskName + ' ' + priority + ' ' + category;
          
          if (searchableText.includes(searchTerm)) {
            item.style.display = 'flex';
            item.classList.add('search-match');
            
            if (taskName.includes(searchTerm) && taskTextStrong) {
              highlightText(taskTextStrong, searchTerm);
            }

            if (!firstMatch) firstMatch = item;

            item.style.boxShadow = '0 0 10px rgba(33, 150, 243, 0.8)';
          } else {
            item.style.display = 'none';
            item.classList.remove('search-match');
            item.style.boxShadow = '';
          }
        });

        if (firstMatch) {
          firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }

    removeHighlights();
    
    if (searchTerm === '') {
      taskItems.forEach(item => {
        item.style.display = 'flex';
        item.classList.remove('search-match');
      });
      return;
    }
    
    taskItems.forEach(item => {
      const taskText = item.querySelector('.task-text');
      const taskTextStrong = item.querySelector('.task-text strong');
      const priorityBadge = item.querySelector('.priority-badge');
      const categoryBadge = item.querySelector('.category-badge');
      
      const taskName = taskText ? taskText.textContent.toLowerCase() : '';
      const priority = priorityBadge ? priorityBadge.textContent.toLowerCase() : '';
      const category = categoryBadge ? categoryBadge.textContent.toLowerCase() : '';
      
      const searchableText = taskName + ' ' + priority + ' ' + category;
      
      if (searchableText.includes(searchTerm)) {
        item.style.display = 'flex';
        item.classList.add('search-match');
        
        if (taskName.includes(searchTerm) && taskTextStrong) {
          highlightText(taskTextStrong, searchTerm);
        }
        
        item.style.animation = 'searchPulse 0.5s ease';
        setTimeout(() => {
          item.style.animation = '';
        }, 500);
      } else {
        item.style.display = 'none';
        item.classList.remove('search-match');
      }
    });
  });
  
  searchInput.addEventListener('blur', function() {
    if (this.value.trim() === '') {
      removeHighlights();
      const taskItems = document.querySelectorAll('.task-item');
      taskItems.forEach(item => {
        item.style.display = 'flex';
        item.classList.remove('search-match');
      });
    }
  });
}

let draggedElement = null;

function addDragListeners() {
  const taskItems = document.querySelectorAll('.task-item');
  
  taskItems.forEach(item => {
    item.addEventListener('dragstart', function() {
      draggedElement = this;
      this.classList.add('dragging');
    });

    item.addEventListener('dragend', function() {
      this.classList.remove('dragging');
    });

    item.addEventListener('dragover', function(e) {
      e.preventDefault();
      const afterElement = getDragAfterElement(document.getElementById('tasks-container'), e.clientY);
      const container = document.getElementById('tasks-container');
      if (afterElement == null) {
        container.appendChild(draggedElement);
      } else {
        container.insertBefore(draggedElement, afterElement);
      }
    });

    item.addEventListener('drop', function() {
      const taskElements = document.querySelectorAll('.task-item');
      const newOrder = [];
      taskElements.forEach(el => {
        const taskId = el.dataset.id;
        const task = tasks.find(t => t.id === taskId);
        if (task) newOrder.push(task);
      });
      tasks = newOrder;
      saveTasks();
    });
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiCount = 150;
  const confetti = [];

  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 2,
      d: Math.random() * confettiCount,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      tilt: Math.random() * 10 - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0
    });
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach((c, index) => {
      ctx.beginPath();
      ctx.lineWidth = c.r / 2;
      ctx.strokeStyle = c.color;
      ctx.moveTo(c.x + c.tilt + c.r / 4, c.y);
      ctx.lineTo(c.x + c.tilt, c.y + c.tilt + c.r / 4);
      ctx.stroke();

      c.tiltAngle += c.tiltAngleIncremental;
      c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
      c.x += Math.sin(c.d);
      c.tilt = Math.sin(c.tiltAngle - index / 3) * 15;

      if (c.y > canvas.height) {
        confetti.splice(index, 1);
      }
    });

    if (confetti.length > 0) {
      requestAnimationFrame(drawConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  drawConfetti();
}

loadTasks();

function updateISTClock() {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset + (now.getTimezoneOffset() * 60 * 1000));
  
  let hours = istTime.getHours();
  let minutes = istTime.getMinutes();
  let seconds = istTime.getSeconds();
  
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  
  const timeString = `${hours}:${minutes}:${seconds}`;
  const clockElement = document.getElementById('ist-time');
  
  if (clockElement) clockElement.textContent = timeString;
}

setInterval(updateISTClock, 1000);
updateISTClock();
