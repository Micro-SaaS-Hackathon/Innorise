// Smart Clinic Doctor Profile JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // State management
    let selectedDate = null;
    let selectedTime = null;
    let currentBookingData = {
        date: '17 Yanvar 2024, Çərşənbə',
        time: '10:00',
        price: '₼80'
    };

    // Get DOM elements
    let calendarDays, timeSlots, bookAppointmentBtn, loadMoreReviewsBtn, quickActionBtns;

    function initializeDoctorProfile() {
        // Get DOM elements after DOM is loaded
        calendarDays = document.querySelectorAll('.calendar-day');
        timeSlots = document.querySelectorAll('.time-slot');
        bookAppointmentBtn = document.querySelector('.book-appointment-btn');
        loadMoreReviewsBtn = document.querySelector('.load-more-reviews .btn-outline');
        quickActionBtns = document.querySelectorAll('.quick-actions button');
        
        // Set up event listeners
        setupEventListeners();
        
        // Set initial selected date and time
        const initialSelectedDay = document.querySelector('.calendar-day.selected');
        const initialSelectedTime = document.querySelector('.time-slot.selected');
        
        if (initialSelectedDay) {
            selectedDate = initialSelectedDay.dataset.date;
        }
        
        if (initialSelectedTime) {
            selectedTime = initialSelectedTime.textContent;
        }
        
        // Initialize animations
        initializeAnimations();
        
        console.log('Doctor profile initialized successfully!');
    }

    function setupEventListeners() {
        // Calendar day selection
        calendarDays.forEach(day => {
            if (day.classList.contains('available')) {
                day.addEventListener('click', handleDateSelection);
            }
        });

        // Time slot selection
        timeSlots.forEach(slot => {
            if (slot.classList.contains('available')) {
                slot.addEventListener('click', handleTimeSelection);
            }
        });

        // Book appointment button
        if (bookAppointmentBtn) {
            bookAppointmentBtn.addEventListener('click', handleBookAppointment);
        }

        // Load more reviews
        if (loadMoreReviewsBtn) {
            loadMoreReviewsBtn.addEventListener('click', handleLoadMoreReviews);
        }

        // Quick action buttons
        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', handleQuickAction);
        });

        // Smooth scrolling for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    function handleDateSelection(e) {
        const clickedDay = e.currentTarget;
        
        if (clickedDay.classList.contains('unavailable')) {
            return;
        }

        // Remove selection from other days
        calendarDays.forEach(day => {
            day.classList.remove('selected');
        });

        // Add selection to clicked day
        clickedDay.classList.add('selected');
        selectedDate = clickedDay.dataset.date;

        // Update booking summary
        updateBookingSummary();

        // Add click animation
        clickedDay.style.transform = 'scale(0.95)';
        setTimeout(() => {
            clickedDay.style.transform = '';
        }, 150);

        // Generate available time slots for selected date
        generateTimeSlots(selectedDate);
    }

    function handleTimeSelection(e) {
        const clickedSlot = e.currentTarget;
        
        if (clickedSlot.classList.contains('unavailable')) {
            return;
        }

        // Remove selection from other slots
        timeSlots.forEach(slot => {
            slot.classList.remove('selected');
        });

        // Add selection to clicked slot
        clickedSlot.classList.add('selected');
        selectedTime = clickedSlot.textContent;

        // Update booking summary
        updateBookingSummary();

        // Add click animation
        clickedSlot.style.transform = 'scale(0.95)';
        setTimeout(() => {
            clickedSlot.style.transform = '';
        }, 150);
    }

    function updateBookingSummary() {
        const summaryItems = document.querySelectorAll('.summary-item');
        
        summaryItems.forEach(item => {
            const label = item.querySelector('.label').textContent;
            const valueElement = item.querySelector('.value');
            
            if (label.includes('Tarix') && selectedDate) {
                valueElement.textContent = formatDate(selectedDate);
                currentBookingData.date = formatDate(selectedDate);
            } else if (label.includes('Vaxt') && selectedTime) {
                valueElement.textContent = selectedTime;
                currentBookingData.time = selectedTime;
            }
        });
    }

    function formatDate(dateString) {
        // Convert date string to readable format
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        
        // For demo purposes, return formatted string
        const dayNames = ['Bazar', 'Bazar ertəsi', 'Çərşənbə axşamı', 'Çərşənbə', 'Cümə axşamı', 'Cümə', 'Şənbə'];
        const monthNames = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
        
        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const weekday = dayNames[date.getDay()];
        
        return `${day} ${month} ${year}, ${weekday}`;
    }

    function generateTimeSlots(date) {
        // Simulate different availability for different dates
        const timeSlotElements = document.querySelectorAll('.time-slot');
        
        timeSlotElements.forEach((slot, index) => {
            // Reset classes
            slot.classList.remove('unavailable', 'selected');
            slot.classList.add('available');
            
            // Simulate some unavailable slots based on date
            if (date && date.includes('18')) {
                // Sunday - more slots unavailable
                if (index % 3 === 0) {
                    slot.classList.remove('available');
                    slot.classList.add('unavailable');
                }
            } else if (date && date.includes('21')) {
                // Weekend - all slots unavailable
                slot.classList.remove('available');
                slot.classList.add('unavailable');
            } else {
                // Randomly make some slots unavailable
                if (Math.random() < 0.2) {
                    slot.classList.remove('available');
                    slot.classList.add('unavailable');
                }
            }
        });

        // Clear time selection when date changes
        selectedTime = null;
        updateBookingSummary();
    }

    function handleBookAppointment() {
        if (!selectedDate || !selectedTime) {
            showNotification('Zəhmət olmasa tarix və vaxt seçin', 'warning');
            return;
        }

        // Show booking modal
        showBookingModal();
    }

    function showBookingModal() {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'booking-modal-overlay';
        modal.innerHTML = `
            <div class="booking-modal">
                <div class="modal-header">
                    <h3>Randevu Təsdiqi</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-content">
                    <div class="doctor-summary">
                        <div class="doctor-info-mini">
                            <img src="https://via.placeholder.com/60x60/2563eb/ffffff?text=AM" alt="Dr. Ayşə Məmmədova">
                            <div>
                                <h4>Dr. Ayşə Məmmədova</h4>
                                <p>Kardioloq</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="appointment-details">
                        <h4>Randevu Təfərrüatları</h4>
                        <div class="detail-item">
                            <i class="fas fa-calendar"></i>
                            <span>${currentBookingData.date}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>${currentBookingData.time}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-dollar-sign"></i>
                            <span>${currentBookingData.price}</span>
                        </div>
                    </div>
                    
                    <div class="patient-form">
                        <h4>Xəstə Məlumatları</h4>
                        <div class="form-group">
                            <label>Ad Soyad *</label>
                            <input type="text" id="patientName" placeholder="Adınızı və soyadınızı daxil edin" required>
                        </div>
                        <div class="form-group">
                            <label>Telefon *</label>
                            <input type="tel" id="patientPhone" placeholder="+994 XX XXX XX XX" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="patientEmail" placeholder="email@example.com">
                        </div>
                        <div class="form-group">
                            <label>Şikayət və ya qeyd</label>
                            <textarea id="patientNotes" placeholder="Şikayətinizi və ya əlavə qeydlərinizi yazın (ixtiyari)"></textarea>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="btn-outline cancel-booking">Ləğv et</button>
                        <button class="btn-primary confirm-booking">
                            <i class="fas fa-check"></i>
                            Randevunu Təsdiqlə
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add modal styles
        addBookingModalStyles();

        // Add event listeners
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.cancel-booking');
        const confirmBtn = modal.querySelector('.confirm-booking');

        closeBtn.addEventListener('click', closeBookingModal);
        cancelBtn.addEventListener('click', closeBookingModal);
        confirmBtn.addEventListener('click', confirmBooking);

        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeBookingModal();
            }
        });

        // Focus on first input
        setTimeout(() => {
            modal.querySelector('#patientName').focus();
        }, 100);
    }

    function addBookingModalStyles() {
        if (!document.getElementById('booking-modal-styles')) {
            const modalStyles = document.createElement('style');
            modalStyles.id = 'booking-modal-styles';
            modalStyles.textContent = `
                .booking-modal-overlay {
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
                
                .booking-modal {
                    background: white;
                    border-radius: 16px;
                    max-width: 500px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: slideIn 0.3s ease;
                }
                
                .booking-modal .modal-header {
                    padding: 20px 24px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: linear-gradient(135deg, #2563eb, #3b82f6);
                    color: white;
                    border-radius: 16px 16px 0 0;
                }
                
                .booking-modal .modal-header h3 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                }
                
                .booking-modal .modal-close {
                    background: none;
                    border: none;
                    font-size: 20px;
                    color: white;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                }
                
                .booking-modal .modal-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                .booking-modal .modal-content {
                    padding: 24px;
                }
                
                .doctor-summary {
                    margin-bottom: 24px;
                    padding: 16px;
                    background: #f8fafc;
                    border-radius: 12px;
                }
                
                .doctor-info-mini {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .doctor-info-mini img {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    object-fit: cover;
                }
                
                .doctor-info-mini h4 {
                    margin: 0 0 4px 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #1f2937;
                }
                
                .doctor-info-mini p {
                    margin: 0;
                    color: #2563eb;
                    font-weight: 500;
                }
                
                .appointment-details {
                    margin-bottom: 24px;
                    padding: 16px;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                }
                
                .appointment-details h4 {
                    margin: 0 0 16px 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #1f2937;
                }
                
                .detail-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                    font-size: 14px;
                    color: #4b5563;
                }
                
                .detail-item:last-child {
                    margin-bottom: 0;
                }
                
                .detail-item i {
                    color: #2563eb;
                    width: 16px;
                }
                
                .patient-form {
                    margin-bottom: 24px;
                }
                
                .patient-form h4 {
                    margin: 0 0 16px 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #1f2937;
                }
                
                .patient-form .form-group {
                    margin-bottom: 16px;
                }
                
                .patient-form .form-group label {
                    display: block;
                    margin-bottom: 6px;
                    font-weight: 500;
                    color: #374151;
                    font-size: 14px;
                }
                
                .patient-form .form-group input,
                .patient-form .form-group textarea {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: border-color 0.3s ease;
                    font-family: inherit;
                }
                
                .patient-form .form-group input:focus,
                .patient-form .form-group textarea:focus {
                    outline: none;
                    border-color: #2563eb;
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                }
                
                .patient-form .form-group textarea {
                    resize: vertical;
                    min-height: 80px;
                }
                
                .booking-modal .modal-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    margin-top: 24px;
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
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

    function closeBookingModal() {
        const modal = document.querySelector('.booking-modal-overlay');
        if (modal) {
            modal.remove();
        }
    }

    function confirmBooking() {
        const modal = document.querySelector('.booking-modal-overlay');
        const nameInput = modal.querySelector('#patientName');
        const phoneInput = modal.querySelector('#patientPhone');
        const emailInput = modal.querySelector('#patientEmail');
        const notesInput = modal.querySelector('#patientNotes');
        
        // Validate required fields
        if (!nameInput.value.trim()) {
            nameInput.focus();
            showNotification('Ad və soyad sahəsi tələb olunur', 'error');
            return;
        }
        
        if (!phoneInput.value.trim()) {
            phoneInput.focus();
            showNotification('Telefon sahəsi tələb olunur', 'error');
            return;
        }

        // Simulate booking process
        const confirmBtn = modal.querySelector('.confirm-booking');
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Təsdiq edilir...';
        confirmBtn.disabled = true;

        setTimeout(() => {
            closeBookingModal();
            showNotification('Randevunuz uğurla yaradıldı! Tezliklə sizinlə əlaqə saxlanılacaq.', 'success');
            
            // Reset booking form
            resetBookingForm();
        }, 2000);
    }

    function resetBookingForm() {
        // Reset selected date and time
        const selectedDay = document.querySelector('.calendar-day.selected');
        const selectedTimeSlot = document.querySelector('.time-slot.selected');
        
        if (selectedDay) {
            selectedDay.classList.remove('selected');
        }
        
        if (selectedTimeSlot) {
            selectedTimeSlot.classList.remove('selected');
        }
        
        selectedDate = null;
        selectedTime = null;
        
        // Reset booking summary to default
        currentBookingData = {
            date: '17 Yanvar 2024, Çərşənbə',
            time: '10:00',
            price: '₼80'
        };
        
        updateBookingSummary();
    }

    function handleLoadMoreReviews() {
        // Simulate loading more reviews
        const reviewsList = document.querySelector('.reviews-list');
        const loadMoreBtn = loadMoreReviewsBtn;
        
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yüklənir...';
        loadMoreBtn.disabled = true;

        setTimeout(() => {
            // Add new review items
            const newReviews = [
                {
                    name: 'Səbinə M.',
                    date: '2 ay əvvəl',
                    rating: 5,
                    text: 'Dr. Məmmədova çox peşəkar və diqqətli həkimdir. Mənim ürək problemlərimi həll etməkdə böyük kömək etdi.'
                },
                {
                    name: 'Elçin R.',
                    date: '2 ay əvvəl',
                    rating: 4,
                    text: 'Yaxşı həkim, vaxtında qəbul edir və ətraflı məsləhət verir. Tövsiyə edirəm.'
                }
            ];

            newReviews.forEach(review => {
                const reviewElement = createReviewElement(review);
                reviewsList.appendChild(reviewElement);
            });

            loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Daha çox rəy göstər';
            loadMoreBtn.disabled = false;
            
            // Hide button after loading more (simulate no more reviews)
            setTimeout(() => {
                loadMoreBtn.style.display = 'none';
            }, 100);
        }, 1500);
    }

    function createReviewElement(review) {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'review-item';
        
        const stars = Array(5).fill(0).map((_, i) => 
            i < review.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>'
        ).join('');
        
        reviewDiv.innerHTML = `
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="reviewer-details">
                        <h4>${review.name}</h4>
                        <span class="review-date">${review.date}</span>
                    </div>
                </div>
                <div class="review-rating">
                    ${stars}
                </div>
            </div>
            <p class="review-text">${review.text}</p>
        `;
        
        return reviewDiv;
    }

    function handleQuickAction(e) {
        const button = e.currentTarget;
        const buttonText = button.textContent.trim();
        
        // Add click animation
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);

        if (buttonText.includes('Randevu Al')) {
            // Scroll to booking section
            const bookingSection = document.querySelector('.booking-section');
            if (bookingSection) {
                bookingSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        } else if (buttonText.includes('Əlaqə')) {
            // Scroll to contact section
            const contactSection = document.querySelector('.contact-section');
            if (contactSection) {
                contactSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        } else if (buttonText.includes('Paylaş')) {
            // Share functionality
            if (navigator.share) {
                navigator.share({
                    title: 'Dr. Ayşə Məmmədova - Smart Clinic',
                    text: 'Smart Clinic-də kardioloq Dr. Ayşə Məmmədova ilə randevu alın',
                    url: window.location.href
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showNotification('Link panoya kopyalandı', 'success');
                });
            }
        }
    }

    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add notification styles if not already added
        addNotificationStyles();

        // Add to page
        document.body.appendChild(notification);

        // Add event listener for close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
    }

    function getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    function addNotificationStyles() {
        if (!document.getElementById('notification-styles')) {
            const notificationStyles = document.createElement('style');
            notificationStyles.id = 'notification-styles';
            notificationStyles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 12px;
                    padding: 16px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    border-left: 4px solid #2563eb;
                    z-index: 10001;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    max-width: 400px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                }
                
                .notification.show {
                    transform: translateX(0);
                }
                
                .notification-success {
                    border-left-color: #10b981;
                }
                
                .notification-error {
                    border-left-color: #ef4444;
                }
                
                .notification-warning {
                    border-left-color: #f59e0b;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex: 1;
                }
                
                .notification-content i {
                    font-size: 18px;
                }
                
                .notification-success .notification-content i {
                    color: #10b981;
                }
                
                .notification-error .notification-content i {
                    color: #ef4444;
                }
                
                .notification-warning .notification-content i {
                    color: #f59e0b;
                }
                
                .notification-content span {
                    font-size: 14px;
                    color: #374151;
                    font-weight: 500;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: #9ca3af;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                }
                
                .notification-close:hover {
                    background: #f3f4f6;
                    color: #6b7280;
                }
            `;
            document.head.appendChild(notificationStyles);
        }
    }

    function initializeAnimations() {
        // Add scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe sections for animation
        const sections = document.querySelectorAll('.left-column > section, .right-column > section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }

    // Initialize the doctor profile when DOM is loaded
    initializeDoctorProfile();
});
