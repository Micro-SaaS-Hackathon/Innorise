// Smart Clinic SPA Router
// Handles dynamic page loading with embedded content (no AJAX needed)

class SPARouter {
    constructor() {
        this.currentPage = null;
        this.pageContent = this.initializePageContent();
        this.init();
    }

    init() {
        // Set up navigation event listeners
        this.setupNavigation();
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.loadPage(e.state.page, false);
            }
        });

        // Load initial page based on URL hash
        this.loadInitialPage();
        
        console.log('SPA Router initialized successfully!');
    }

    initializePageContent() {
        return {
            'dashboard': `
                <!-- Sidebar -->
                <aside class="sidebar">
                    <div class="sidebar-header">
                        <div class="logo">
                            <i class="fas fa-heartbeat"></i>
                            <span>Smart Clinic</span>
                        </div>
                    </div>
                    <nav class="sidebar-nav">
                        <ul>
                            <li class="nav-item active">
                                <a href="#dashboard" class="nav-link">
                                    <i class="fas fa-chart-pie"></i>
                                    <span>Dashboard</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="#appointments" class="nav-link">
                                    <i class="fas fa-calendar-alt"></i>
                                    <span>Randevular</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="#patients" class="nav-link">
                                    <i class="fas fa-users"></i>
                                    <span>Xəstələr</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="#doctors" class="nav-link">
                                    <i class="fas fa-user-md"></i>
                                    <span>Həkimlər</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="#reports" class="nav-link">
                                    <i class="fas fa-chart-bar"></i>
                                    <span>Hesabatlar</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="#settings" class="nav-link">
                                    <i class="fas fa-cog"></i>
                                    <span>Parametrlər</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <div class="sidebar-footer">
                        <div class="user-profile">
                            <div class="user-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="user-info">
                                <span class="user-name">Dr. Əli Məmmədov</span>
                                <span class="user-role">Administrator</span>
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- Main Content -->
                <main class="main-content">
                    <!-- Header -->
                    <header class="header">
                        <div class="header-left">
                            <button class="sidebar-toggle">
                                <i class="fas fa-bars"></i>
                            </button>
                            <h1 class="page-title">Dashboard</h1>
                        </div>
                        <div class="header-right">
                            <div class="search-box">
                                <i class="fas fa-search"></i>
                                <input type="text" placeholder="Axtarış...">
                            </div>
                            <div class="notifications">
                                <button class="notification-btn">
                                    <i class="fas fa-bell"></i>
                                    <span class="notification-badge">3</span>
                                </button>
                            </div>
                            <div class="user-menu">
                                <button class="user-menu-btn">
                                    <div class="user-avatar">
                                        <i class="fas fa-user"></i>
                                    </div>
                                    <i class="fas fa-chevron-down"></i>
                                </button>
                            </div>
                        </div>
                    </header>

                    <!-- Dashboard Content -->
                    <div class="dashboard-content">
                    <!-- Stats Cards -->
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon primary">
                                <i class="fas fa-users"></i>
                            </div>
                            <div class="stat-info">
                                <h3 class="stat-number">1,247</h3>
                                <p class="stat-label">Ümumi Xəstələr</p>
                                <span class="stat-change positive">
                                    <i class="fas fa-arrow-up"></i>
                                    +12%
                                </span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon success">
                                <i class="fas fa-calendar-check"></i>
                            </div>
                            <div class="stat-info">
                                <h3 class="stat-number">24</h3>
                                <p class="stat-label">Bu Gün Randevular</p>
                                <span class="stat-change positive">
                                    <i class="fas fa-arrow-up"></i>
                                    +8%
                                </span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon warning">
                                <i class="fas fa-user-md"></i>
                            </div>
                            <div class="stat-info">
                                <h3 class="stat-number">18</h3>
                                <p class="stat-label">Aktiv Həkimlər</p>
                                <span class="stat-change neutral">
                                    <i class="fas fa-minus"></i>
                                    0%
                                </span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon info">
                                <i class="fas fa-dollar-sign"></i>
                            </div>
                            <div class="stat-info">
                                <h3 class="stat-number">₼15,420</h3>
                                <p class="stat-label">Bu Ay Gəlir</p>
                                <span class="stat-change positive">
                                    <i class="fas fa-arrow-up"></i>
                                    +15%
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Charts and Tables Row -->
                    <div class="dashboard-row">
                        <!-- Appointments Chart -->
                        <div class="dashboard-card chart-card">
                            <div class="card-header">
                                <h3>Aylıq Randevu Statistikası</h3>
                                <div class="card-actions">
                                    <button class="btn-icon">
                                        <i class="fas fa-ellipsis-h"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="card-content">
                                <canvas id="appointmentsChart"></canvas>
                            </div>
                        </div>

                        <!-- Doctor Performance -->
                        <div class="dashboard-card chart-card">
                            <div class="card-header">
                                <h3>Həkim Performansı</h3>
                                <div class="card-actions">
                                    <button class="btn-icon">
                                        <i class="fas fa-ellipsis-h"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="card-content">
                                <canvas id="doctorChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Upcoming Appointments and Quick Actions -->
                    <div class="dashboard-row">
                        <!-- Upcoming Appointments -->
                        <div class="dashboard-card appointments-card">
                            <div class="card-header">
                                <h3>Gələcək Randevular</h3>
                                <div class="card-actions">
                                    <button class="btn-primary btn-sm">
                                        <i class="fas fa-plus"></i>
                                        Yeni Randevu
                                    </button>
                                </div>
                            </div>
                            <div class="card-content">
                                <div class="appointments-list">
                                    <div class="appointment-item">
                                        <div class="appointment-time">
                                            <span class="time">09:30</span>
                                            <span class="date">Bu gün</span>
                                        </div>
                                        <div class="appointment-info">
                                            <h4>Leyla Həsənova</h4>
                                            <p>Dr. Ayşə Məmmədova - Kardioloq</p>
                                            <span class="appointment-status confirmed">Təsdiqlənib</span>
                                        </div>
                                        <div class="appointment-actions">
                                            <button class="btn-icon">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn-icon">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="appointment-item">
                                        <div class="appointment-time">
                                            <span class="time">11:00</span>
                                            <span class="date">Bu gün</span>
                                        </div>
                                        <div class="appointment-info">
                                            <h4>Rəşad Əliyev</h4>
                                            <p>Dr. Məhəmməd Qasımov - Nevroloq</p>
                                            <span class="appointment-status pending">Gözləyir</span>
                                        </div>
                                        <div class="appointment-actions">
                                            <button class="btn-icon">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn-icon">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="appointment-item">
                                        <div class="appointment-time">
                                            <span class="time">14:30</span>
                                            <span class="date">Bu gün</span>
                                        </div>
                                        <div class="appointment-info">
                                            <h4>Günel Qasımova</h4>
                                            <p>Dr. Səbinə Əliyeva - Dermatoloq</p>
                                            <span class="appointment-status confirmed">Təsdiqlənib</span>
                                        </div>
                                        <div class="appointment-actions">
                                            <button class="btn-icon">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn-icon">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="appointment-item">
                                        <div class="appointment-time">
                                            <span class="time">16:00</span>
                                            <span class="date">Sabah</span>
                                        </div>
                                        <div class="appointment-info">
                                            <h4>Kamran Məmmədov</h4>
                                            <p>Dr. Nigar Həsənova - Pediatr</p>
                                            <span class="appointment-status confirmed">Təsdiqlənib</span>
                                        </div>
                                        <div class="appointment-actions">
                                            <button class="btn-icon">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn-icon">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Quick Actions -->
                        <div class="dashboard-card quick-actions-card">
                            <div class="card-header">
                                <h3>Tez Əməliyyatlar</h3>
                            </div>
                            <div class="card-content">
                                <div class="quick-actions-grid">
                                    <button class="quick-action-btn">
                                        <div class="action-icon primary">
                                            <i class="fas fa-calendar-plus"></i>
                                        </div>
                                        <span>Yeni Randevu</span>
                                    </button>
                                    <button class="quick-action-btn">
                                        <div class="action-icon success">
                                            <i class="fas fa-user-plus"></i>
                                        </div>
                                        <span>Xəstə Əlavə Et</span>
                                    </button>
                                    <button class="quick-action-btn">
                                        <div class="action-icon warning">
                                            <i class="fas fa-file-medical"></i>
                                        </div>
                                        <span>Tibbi Qeyd</span>
                                    </button>
                                    <button class="quick-action-btn">
                                        <div class="action-icon info">
                                            <i class="fas fa-chart-line"></i>
                                        </div>
                                        <span>Hesabat Yarat</span>
                                    </button>
                                    <button class="quick-action-btn">
                                        <div class="action-icon danger">
                                            <i class="fas fa-exclamation-triangle"></i>
                                        </div>
                                        <span>Təcili Hal</span>
                                    </button>
                                    <button class="quick-action-btn">
                                        <div class="action-icon secondary">
                                            <i class="fas fa-pills"></i>
                                        </div>
                                        <span>Dərman Yazın</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div class="dashboard-card activity-card">
                        <div class="card-header">
                            <h3>Son Fəaliyyətlər</h3>
                            <div class="card-actions">
                                <button class="btn-outline btn-sm">
                                    Hamısını Gör
                                </button>
                            </div>
                        </div>
                        <div class="card-content">
                            <div class="activity-list">
                                <div class="activity-item">
                                    <div class="activity-icon success">
                                        <i class="fas fa-check"></i>
                                    </div>
                                    <div class="activity-info">
                                        <p><strong>Dr. Ayşə Məmmədova</strong> Leyla Həsənova ilə randevunu tamamladı</p>
                                        <span class="activity-time">5 dəqiqə əvvəl</span>
                                    </div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-icon primary">
                                        <i class="fas fa-calendar-plus"></i>
                                    </div>
                                    <div class="activity-info">
                                        <p><strong>Yeni randevu</strong> Rəşad Əliyev tərəfindən yaradıldı</p>
                                        <span class="activity-time">15 dəqiqə əvvəl</span>
                                    </div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-icon warning">
                                        <i class="fas fa-exclamation-triangle"></i>
                                    </div>
                                    <div class="activity-info">
                                        <p><strong>Sistem xəbərdarlığı:</strong> Server yaddaşı 85% dolub</p>
                                        <span class="activity-time">1 saat əvvəl</span>
                                    </div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-icon info">
                                        <i class="fas fa-user-plus"></i>
                                    </div>
                                    <div class="activity-info">
                                        <p><strong>Yeni xəstə</strong> Kamran Məmmədov qeydiyyatdan keçdi</p>
                                        <span class="activity-time">2 saat əvvəl</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            'doctor-search': `
                <div class="doctor-search-container">
                    <div class="search-header">
                        <h1>Həkim Axtarışı</h1>
                        <p>İxtisas və ya həkim adı əsasında axtarış edin</p>
                    </div>

                    <div class="search-filters">
                        <div class="search-bar-container">
                            <div class="search-input-group">
                                <i class="fas fa-search"></i>
                                <input type="text" placeholder="Həkim adı və ya ixtisas axtarın..." class="search-input">
                                <button class="search-btn">Axtar</button>
                            </div>
                        </div>
                    </div>

                    <div class="doctors-grid">
                        <div class="doctor-card">
                            <div class="doctor-avatar">
                                <i class="fas fa-user-md"></i>
                            </div>
                            <div class="doctor-info">
                                <h3>Dr. Ayşə Məmmədova</h3>
                                <p class="specialty">Kardioloq</p>
                                <div class="rating">
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <span>4.9 (127 rəy)</span>
                                </div>
                                <p class="experience">15 il təcrübə</p>
                            </div>
                            <div class="doctor-actions">
                                <button class="btn-primary" onclick="loadPage('doctor-profile')">Profil</button>
                                <button class="btn-outline" onclick="loadPage('booking')">Randevu</button>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            'doctor-profile': `
                <div class="doctor-profile-container">
                    <div class="profile-header">
                        <div class="doctor-avatar-large">
                            <i class="fas fa-user-md"></i>
                        </div>
                        <div class="doctor-details">
                            <h1>Dr. Ayşə Məmmədova</h1>
                            <p class="specialty">Kardioloq</p>
                            <div class="rating">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <span>4.9 (127 rəy)</span>
                            </div>
                            <p class="experience">15 il təcrübə</p>
                        </div>
                        <div class="profile-actions">
                            <button class="btn-primary btn-large" onclick="loadPage('booking')">
                                <i class="fas fa-calendar-plus"></i>
                                Randevu Al
                            </button>
                        </div>
                    </div>

                    <div class="profile-content">
                        <div class="profile-main">
                            <div class="about-section">
                                <h2>Haqqında</h2>
                                <p>Dr. Ayşə Məmmədova 15 ildən çox təcrübəyə malik kardioloqdur. Ürək xəstəlikləri sahəsində ixtisaslaşıb və yüzlərlə xəstəni müalicə edib.</p>
                            </div>

                            <div class="education-section">
                                <h2>Təhsil</h2>
                                <div class="education-item">
                                    <h4>Azərbaycan Tibb Universiteti</h4>
                                    <p>Tibb Doktoru - Kardiologiya</p>
                                    <span>2005-2010</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            'booking': `
                <div class="booking-container">
                    <div class="booking-header">
                        <h1>Randevu Al</h1>
                        <p>Həkim seçin və uyğun vaxt slotunu seçərək randevu alın</p>
                    </div>

                    <div class="booking-content">
                        <div class="booking-form">
                            <div class="form-section">
                                <h3>Həkim Seçimi</h3>
                                <select class="form-select">
                                    <option>Dr. Ayşə Məmmədova - Kardioloq</option>
                                    <option>Dr. Rəşad Əliyev - Dermatoloq</option>
                                    <option>Dr. Leyla Həsənova - Nevroloq</option>
                                </select>
                            </div>

                            <div class="form-section">
                                <h3>Tarix Seçimi</h3>
                                <div class="calendar-container">
                                    <div class="calendar-header">
                                        <button class="calendar-nav"><</button>
                                        <span class="calendar-month">Yanvar 2025</span>
                                        <button class="calendar-nav">></button>
                                    </div>
                                    <div class="calendar-grid">
                                        <div class="calendar-day">15</div>
                                        <div class="calendar-day">16</div>
                                        <div class="calendar-day selected">17</div>
                                        <div class="calendar-day">18</div>
                                        <div class="calendar-day">19</div>
                                    </div>
                                </div>
                            </div>

                            <div class="form-section">
                                <h3>Vaxt Seçimi</h3>
                                <div class="time-slots">
                                    <button class="time-slot">09:00</button>
                                    <button class="time-slot">10:30</button>
                                    <button class="time-slot selected">14:30</button>
                                    <button class="time-slot">16:00</button>
                                </div>
                            </div>

                            <div class="form-section">
                                <h3>Əlaqə Məlumatları</h3>
                                <div class="form-group">
                                    <label>Ad Soyad</label>
                                    <input type="text" class="form-input" placeholder="Adınızı daxil edin">
                                </div>
                                <div class="form-group">
                                    <label>Telefon</label>
                                    <input type="tel" class="form-input" placeholder="+994 XX XXX XX XX">
                                </div>
                                <div class="form-group">
                                    <label>Email</label>
                                    <input type="email" class="form-input" placeholder="email@example.com">
                                </div>
                            </div>

                            <div class="form-actions">
                                <button class="btn-primary btn-large">
                                    <i class="fas fa-check"></i>
                                    Randevunu Təsdiqlə
                                </button>
                            </div>
                        </div>

                        <div class="booking-summary">
                            <h3>Randevu Xülasəsi</h3>
                            <div class="summary-item">
                                <span>Həkim:</span>
                                <span>Dr. Ayşə Məmmədova</span>
                            </div>
                            <div class="summary-item">
                                <span>İxtisas:</span>
                                <span>Kardioloq</span>
                            </div>
                            <div class="summary-item">
                                <span>Tarix:</span>
                                <span>17 Yanvar 2025</span>
                            </div>
                            <div class="summary-item">
                                <span>Vaxt:</span>
                                <span>14:30</span>
                            </div>
                            <div class="summary-item">
                                <span>Qiymət:</span>
                                <span>50 AZN</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
        };
    }

    setupNavigation() {
        // Add click listeners to navigation links
        document.querySelectorAll('.nav-link[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.loadPage(page);
            });
        });
    }

    loadInitialPage() {
        const hash = window.location.hash.substring(1);
        const validPages = ['dashboard', 'doctor-search', 'doctor-profile', 'booking'];
        
        if (hash && validPages.includes(hash)) {
            this.loadPage(hash, false);
        }
    }

    loadPage(pageName, updateHistory = true) {
        try {
            // Show loading indicator
            this.showLoading();

            // Update navigation active state
            this.updateNavigation(pageName);

            // Update URL hash if needed
            if (updateHistory) {
                window.history.pushState({ page: pageName }, '', `#${pageName}`);
            }

            // Get page content from embedded content
            const content = this.pageContent[pageName];
            
            if (!content) {
                throw new Error(`Page content not found for: ${pageName}`);
            }

            // Update page content
            this.updatePageContent(content);

            // Initialize page-specific functionality
            this.initializePageFunctionality(pageName);

            // Update page title
            this.updatePageTitle(pageName);

            this.currentPage = pageName;

            // Hide loading indicator
            this.hideLoading();

            console.log(`Page '${pageName}' loaded successfully`);

        } catch (error) {
            console.error(`Error loading page '${pageName}':`, error);
            this.showError(`Səhifə yüklənərkən xəta baş verdi: ${pageName}`);
            this.hideLoading();
        }
    }

    updatePageContent(content) {
        const contentContainer = document.getElementById('content');
        if (contentContainer) {
            contentContainer.innerHTML = content;
            
            // Scroll to top
            window.scrollTo(0, 0);
        }
    }

    updateNavigation(activePage) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current page link
        const activeLink = document.querySelector(`.nav-link[data-page="${activePage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    updatePageTitle(pageName) {
        const pageTitles = {
            'dashboard': 'Dashboard - Smart Clinic',
            'doctor-search': 'Həkim Axtarışı - Smart Clinic',
            'doctor-profile': 'Həkim Profili - Smart Clinic',
            'booking': 'Randevu Al - Smart Clinic'
        };

        document.title = pageTitles[pageName] || 'Smart Clinic';
    }

    showLoading() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'flex';
        }
    }

    hideLoading() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }

    initializePageFunctionality(pageName) {
        // Initialize page-specific functionality based on the loaded page
        setTimeout(() => {
            switch (pageName) {
                case 'dashboard':
                    this.initializeDashboard();
                    break;
                case 'doctor-search':
                    this.initializeDoctorSearch();
                    break;
                case 'doctor-profile':
                    this.initializeDoctorProfile();
                    break;
                case 'booking':
                    this.initializeBooking();
                    break;
                default:
                    console.log(`No specific initialization for page: ${pageName}`);
            }
        }, 100); // Small delay to ensure DOM is ready
    }

    initializeDashboard() {
        // Dashboard functionality
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
            });
        });

        // Appointment actions
        const appointmentActions = document.querySelectorAll('.appointment-actions button');
        appointmentActions.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const action = this.textContent.trim();
                console.log('Appointment action:', action);
                
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });

        // Animate stats cards
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

        // Initialize Charts
        this.initializeCharts();

        console.log('Dashboard functionality initialized');
    }

    initializeCharts() {
        // Appointments Chart
        const appointmentsCtx = document.getElementById('appointmentsChart');
        if (appointmentsCtx && typeof Chart !== 'undefined') {
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
        if (doctorCtx && typeof Chart !== 'undefined') {
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

    initializeDoctorSearch() {
        // Doctor search functionality
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        const doctorCards = document.querySelectorAll('.doctor-card');

        if (searchInput) {
            searchInput.addEventListener('input', this.debounce((e) => {
                const searchTerm = e.target.value.toLowerCase();
                this.filterDoctors(searchTerm);
            }, 300));
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const searchTerm = searchInput.value.toLowerCase();
                this.filterDoctors(searchTerm);
            });
        }

        // Doctor card interactions
        doctorCards.forEach(card => {
            const profileBtn = card.querySelector('.btn-primary');
            const bookBtn = card.querySelector('.btn-outline');

            if (profileBtn) {
                profileBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.loadPage('doctor-profile');
                });
            }

            if (bookBtn) {
                bookBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.loadPage('booking');
                });
            }
        });

        console.log('Doctor search functionality initialized');
    }

    initializeDoctorProfile() {
        // Doctor profile functionality
        const bookingBtn = document.querySelector('.btn-primary.btn-large');
        
        if (bookingBtn) {
            bookingBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadPage('booking');
            });
        }

        // Animate profile sections
        const profileSections = document.querySelectorAll('.about-section, .education-section');
        profileSections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                section.style.transition = 'all 0.6s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 200);
        });

        console.log('Doctor profile functionality initialized');
    }

    initializeBooking() {
        // Booking functionality
        const calendarDays = document.querySelectorAll('.calendar-day');
        const timeSlots = document.querySelectorAll('.time-slot');
        const confirmBtn = document.querySelector('.btn-primary.btn-large');

        // Calendar day selection
        calendarDays.forEach(day => {
            day.addEventListener('click', function() {
                // Remove selection from other days
                calendarDays.forEach(d => d.classList.remove('selected'));
                // Add selection to clicked day
                this.classList.add('selected');
                
                // Update summary
                const summaryDate = document.querySelector('.summary-item:nth-child(3) span:last-child');
                if (summaryDate) {
                    summaryDate.textContent = `${this.textContent} Yanvar 2025`;
                }
            });
        });

        // Time slot selection
        timeSlots.forEach(slot => {
            slot.addEventListener('click', function() {
                // Remove selection from other slots
                timeSlots.forEach(s => s.classList.remove('selected'));
                // Add selection to clicked slot
                this.classList.add('selected');
                
                // Update summary
                const summaryTime = document.querySelector('.summary-item:nth-child(4) span:last-child');
                if (summaryTime) {
                    summaryTime.textContent = this.textContent;
                }
            });
        });

        // Form validation and submission
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const nameInput = document.querySelector('input[type="text"]');
                const phoneInput = document.querySelector('input[type="tel"]');
                const emailInput = document.querySelector('input[type="email"]');
                
                if (!nameInput.value.trim() || !phoneInput.value.trim() || !emailInput.value.trim()) {
                    alert('Zəhmət olmasa bütün sahələri doldurun');
                    return;
                }
                
                // Show success message
                alert('Randevunuz uğurla yaradıldı! Tezliklə sizinlə əlaqə saxlanılacaq.');
                
                // Reset form
                nameInput.value = '';
                phoneInput.value = '';
                emailInput.value = '';
            });
        }

        console.log('Booking functionality initialized');
    }

    filterDoctors(searchTerm) {
        const doctorCards = document.querySelectorAll('.doctor-card');
        
        doctorCards.forEach(card => {
            const doctorName = card.querySelector('h3').textContent.toLowerCase();
            const specialty = card.querySelector('.specialty').textContent.toLowerCase();
            
            if (doctorName.includes(searchTerm) || specialty.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    if (card.style.opacity === '0') {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    showError(message) {
        const errorModal = document.getElementById('error-modal');
        const errorMessage = document.getElementById('error-message');
        
        if (errorModal && errorMessage) {
            errorMessage.textContent = message;
            errorModal.style.display = 'flex';
        } else {
            // Fallback to alert
            alert(message);
        }
    }
}

// Global functions for easy access
window.loadPage = function(pageName) {
    if (window.spaRouter) {
        window.spaRouter.loadPage(pageName);
    }
};

window.closeErrorModal = function() {
    const errorModal = document.getElementById('error-modal');
    if (errorModal) {
        errorModal.style.display = 'none';
    }
};

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.spaRouter = new SPARouter();
    console.log('SPA Router ready - no AJAX needed!');
});
