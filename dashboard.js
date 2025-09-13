// Smart Clinic Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();
    
    // Sidebar toggle functionality
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked nav item
            this.parentElement.classList.add('active');
            
            // Update page title
            const pageTitle = document.querySelector('.page-title');
            const linkText = this.querySelector('span').textContent;
            pageTitle.textContent = linkText;
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            // Implement search logic here
            console.log('Searching for:', searchTerm);
        });
    }

    // Notification functionality
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            // Toggle notification dropdown
            console.log('Notifications clicked');
            showNotifications();
        });
    }

    // User menu functionality
    const userMenuBtn = document.querySelector('.user-menu-btn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', function() {
            // Toggle user menu dropdown
            console.log('User menu clicked');
            showUserMenu();
        });
    }

    // Quick action buttons
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const actionText = this.querySelector('span').textContent;
            console.log('Quick action clicked:', actionText);
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Handle specific actions
            handleQuickAction(actionText);
        });
    });

    // Appointment actions
    const appointmentActions = document.querySelectorAll('.appointment-actions .btn-icon');
    appointmentActions.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.querySelector('i').classList.contains('fa-edit') ? 'edit' : 'delete';
            const appointmentItem = this.closest('.appointment-item');
            const patientName = appointmentItem.querySelector('h4').textContent;
            
            console.log(`${action} appointment for:`, patientName);
            handleAppointmentAction(action, patientName);
        });
    });

    // Initialize charts
    initializeCharts();
    
    // Initialize real-time updates
    initializeRealTimeUpdates();
    
    // Initialize keyboard shortcuts
    initializeKeyboardShortcuts();
    
    console.log('Smart Clinic Dashboard initialized successfully!');
});

function initializeDashboard() {
    // Animate stats cards on load
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Animate dashboard cards
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, (index + statCards.length) * 100);
    });
}

function initializeCharts() {
    // Appointments Chart
    const appointmentsCtx = document.getElementById('appointmentsChart');
    if (appointmentsCtx) {
        new Chart(appointmentsCtx, {
            type: 'line',
            data: {
                labels: ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyun', 'İyul', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'],
                datasets: [{
                    label: 'Randevular',
                    data: [120, 135, 150, 140, 165, 180, 175, 190, 185, 200, 195, 210],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#2563eb',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#f3f4f6'
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    }
                },
                elements: {
                    point: {
                        hoverBackgroundColor: '#2563eb'
                    }
                }
            }
        });
    }

    // Doctor Performance Chart
    const doctorCtx = document.getElementById('doctorChart');
    if (doctorCtx) {
        new Chart(doctorCtx, {
            type: 'doughnut',
            data: {
                labels: ['Dr. Ayşə Məmmədova', 'Dr. Məhəmməd Qasımov', 'Dr. Səbinə Əliyeva', 'Dr. Nigar Həsənova', 'Digərləri'],
                datasets: [{
                    data: [25, 20, 18, 15, 22],
                    backgroundColor: [
                        '#2563eb',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#6b7280'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            color: '#374151'
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }
}

function initializeRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
        updateNotificationBadge();
        updateActivityFeed();
    }, 30000); // Update every 30 seconds

    // Update time displays
    setInterval(() => {
        updateTimeDisplays();
    }, 60000); // Update every minute
}

function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        const currentCount = parseInt(badge.textContent);
        const newCount = Math.max(0, currentCount + Math.floor(Math.random() * 3) - 1);
        badge.textContent = newCount;
        badge.style.display = newCount > 0 ? 'block' : 'none';
    }
}

function updateActivityFeed() {
    const activityList = document.querySelector('.activity-list');
    if (activityList && Math.random() > 0.7) {
        const activities = [
            {
                icon: 'success',
                iconClass: 'fa-check',
                text: '<strong>Dr. Rəşad Əliyev</strong> yeni xəstə qəbul etdi',
                time: 'İndi'
            },
            {
                icon: 'primary',
                iconClass: 'fa-calendar-plus',
                text: '<strong>Yeni randevu</strong> yaradıldı',
                time: '2 dəqiqə əvvəl'
            },
            {
                icon: 'info',
                iconClass: 'fa-user-plus',
                text: '<strong>Yeni həkim</strong> sistemə əlavə edildi',
                time: '5 dəqiqə əvvəl'
            }
        ];

        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        const newActivity = createActivityItem(randomActivity);
        
        activityList.insertBefore(newActivity, activityList.firstChild);
        
        // Remove last item if more than 4 activities
        if (activityList.children.length > 4) {
            activityList.removeChild(activityList.lastChild);
        }
    }
}

function createActivityItem(activity) {
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.innerHTML = `
        <div class="activity-icon ${activity.icon}">
            <i class="fas ${activity.iconClass}"></i>
        </div>
        <div class="activity-info">
            <p>${activity.text}</p>
            <span class="activity-time">${activity.time}</span>
        </div>
    `;
    return item;
}

function updateTimeDisplays() {
    const timeElements = document.querySelectorAll('.appointment-time .time');
    timeElements.forEach(element => {
        // Update relative time displays if needed
    });
}

function handleQuickAction(actionText) {
    switch(actionText) {
        case 'Yeni Randevu':
            showNewAppointmentModal();
            break;
        case 'Xəstə Əlavə Et':
            showNewPatientModal();
            break;
        case 'Tibbi Qeyd':
            showMedicalNoteModal();
            break;
        case 'Hesabat Yarat':
            generateReport();
            break;
        case 'Təcili Hal':
            handleEmergency();
            break;
        case 'Dərman Yazın':
            showPrescriptionModal();
            break;
        default:
            console.log('Unknown action:', actionText);
    }
}

function handleAppointmentAction(action, patientName) {
    if (action === 'edit') {
        showEditAppointmentModal(patientName);
    } else if (action === 'delete') {
        showDeleteConfirmation(patientName);
    }
}

function showNewAppointmentModal() {
    showModal('Yeni Randevu', `
        <form class="appointment-form">
            <div class="form-group">
                <label>Xəstə Adı</label>
                <input type="text" placeholder="Xəstə adını daxil edin">
            </div>
            <div class="form-group">
                <label>Həkim</label>
                <select>
                    <option>Dr. Ayşə Məmmədova</option>
                    <option>Dr. Məhəmməd Qasımov</option>
                    <option>Dr. Səbinə Əliyeva</option>
                </select>
            </div>
            <div class="form-group">
                <label>Tarix və Vaxt</label>
                <input type="datetime-local">
            </div>
            <div class="form-actions">
                <button type="button" class="btn-outline" onclick="closeModal()">Ləğv et</button>
                <button type="submit" class="btn-primary">Yadda saxla</button>
            </div>
        </form>
    `);
}

function showNewPatientModal() {
    showModal('Yeni Xəstə', `
        <form class="patient-form">
            <div class="form-group">
                <label>Ad Soyad</label>
                <input type="text" placeholder="Xəstənin ad soyadını daxil edin">
            </div>
            <div class="form-group">
                <label>Telefon</label>
                <input type="tel" placeholder="+994 XX XXX XX XX">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" placeholder="email@example.com">
            </div>
            <div class="form-group">
                <label>Doğum Tarixi</label>
                <input type="date">
            </div>
            <div class="form-actions">
                <button type="button" class="btn-outline" onclick="closeModal()">Ləğv et</button>
                <button type="submit" class="btn-primary">Yadda saxla</button>
            </div>
        </form>
    `);
}

function showMedicalNoteModal() {
    showModal('Tibbi Qeyd', `
        <form class="note-form">
            <div class="form-group">
                <label>Xəstə</label>
                <select>
                    <option>Leyla Həsənova</option>
                    <option>Rəşad Əliyev</option>
                    <option>Günel Qasımova</option>
                </select>
            </div>
            <div class="form-group">
                <label>Qeyd</label>
                <textarea rows="5" placeholder="Tibbi qeydi daxil edin..."></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-outline" onclick="closeModal()">Ləğv et</button>
                <button type="submit" class="btn-primary">Yadda saxla</button>
            </div>
        </form>
    `);
}

function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-content">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles if not already added
    if (!document.getElementById('modal-styles')) {
        const modalStyles = document.createElement('style');
        modalStyles.id = 'modal-styles';
        modalStyles.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .modal {
                background: white;
                border-radius: 16px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                animation: slideIn 0.3s ease;
            }
            
            .modal-header {
                padding: 20px 24px;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .modal-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #1f2937;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 20px;
                color: #6b7280;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.3s ease;
            }
            
            .modal-close:hover {
                background: #f3f4f6;
                color: #374151;
            }
            
            .modal-content {
                padding: 24px;
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: #374151;
            }
            
            .form-group input,
            .form-group select,
            .form-group textarea {
                width: 100%;
                padding: 10px 12px;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                font-size: 14px;
                transition: border-color 0.3s ease;
            }
            
            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #2563eb;
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            }
            
            .form-actions {
                display: flex;
                gap: 12px;
                justify-content: flex-end;
                margin-top: 24px;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(modalStyles);
    }
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function showNotifications() {
    const notifications = [
        { type: 'info', message: 'Yeni randevu tələbi alındı', time: '2 dəqiqə əvvəl' },
        { type: 'success', message: 'Sistem yenilənməsi tamamlandı', time: '1 saat əvvəl' },
        { type: 'warning', message: 'Server yaddaşı 85% dolub', time: '2 saat əvvəl' }
    ];
    
    console.log('Notifications:', notifications);
    // Implement notification dropdown here
}

function showUserMenu() {
    const userMenuItems = [
        { icon: 'fa-user', text: 'Profil', action: 'profile' },
        { icon: 'fa-cog', text: 'Parametrlər', action: 'settings' },
        { icon: 'fa-question-circle', text: 'Yardım', action: 'help' },
        { icon: 'fa-sign-out-alt', text: 'Çıxış', action: 'logout' }
    ];
    
    console.log('User menu items:', userMenuItems);
    // Implement user menu dropdown here
}

function generateReport() {
    console.log('Generating report...');
    // Implement report generation logic
}

function handleEmergency() {
    console.log('Emergency protocol activated');
    // Implement emergency handling logic
}

function showPrescriptionModal() {
    showModal('Dərman Yazın', `
        <form class="prescription-form">
            <div class="form-group">
                <label>Xəstə</label>
                <select>
                    <option>Leyla Həsənova</option>
                    <option>Rəşad Əliyev</option>
                    <option>Günel Qasımova</option>
                </select>
            </div>
            <div class="form-group">
                <label>Dərman Adı</label>
                <input type="text" placeholder="Dərman adını daxil edin">
            </div>
            <div class="form-group">
                <label>Dozaj</label>
                <input type="text" placeholder="Dozajı daxil edin">
            </div>
            <div class="form-group">
                <label>İstifadə Təlimatı</label>
                <textarea rows="3" placeholder="İstifadə təlimatını daxil edin..."></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-outline" onclick="closeModal()">Ləğv et</button>
                <button type="submit" class="btn-primary">Yadda saxla</button>
            </div>
        </form>
    `);
}

function showEditAppointmentModal(patientName) {
    showModal('Randevunu Redaktə Et', `
        <form class="appointment-form">
            <div class="form-group">
                <label>Xəstə Adı</label>
                <input type="text" value="${patientName}" readonly>
            </div>
            <div class="form-group">
                <label>Həkim</label>
                <select>
                    <option>Dr. Ayşə Məmmədova</option>
                    <option>Dr. Məhəmməd Qasımov</option>
                    <option>Dr. Səbinə Əliyeva</option>
                </select>
            </div>
            <div class="form-group">
                <label>Tarix və Vaxt</label>
                <input type="datetime-local">
            </div>
            <div class="form-actions">
                <button type="button" class="btn-outline" onclick="closeModal()">Ləğv et</button>
                <button type="submit" class="btn-primary">Yenilə</button>
            </div>
        </form>
    `);
}

function showDeleteConfirmation(patientName) {
    showModal('Randevunu Sil', `
        <div class="confirmation-content">
            <div class="confirmation-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h4>Randevunu silmək istədiyinizdən əminsiniz?</h4>
            <p><strong>${patientName}</strong> üçün olan randevu silinəcək və bu əməliyyat geri alına bilməz.</p>
            <div class="form-actions">
                <button type="button" class="btn-outline" onclick="closeModal()">Ləğv et</button>
                <button type="button" class="btn-danger" onclick="confirmDelete('${patientName}')">Sil</button>
            </div>
        </div>
    `);
}

function confirmDelete(patientName) {
    console.log('Deleting appointment for:', patientName);
    closeModal();
    // Implement actual deletion logic here
}

function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-box input');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            closeModal();
        }
        
        // Ctrl/Cmd + N for new appointment
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            showNewAppointmentModal();
        }
    });
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
});

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});
