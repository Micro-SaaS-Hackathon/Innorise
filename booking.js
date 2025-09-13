// Smart Clinic Booking Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // State management
    let currentDate = new Date();
    let selectedDate = null;
    let selectedTime = null;
    let bookingData = {
        doctor: 'Dr. Ayşə Məmmədova',
        specialty: 'Kardioloq',
        date: null,
        time: null,
        patient: null,
        paymentType: 'full',
        paymentMethod: 'card',
        totalAmount: 80
    };

    // Initialize the booking page
    initializeBooking();

    function initializeBooking() {
        // Generate calendar for current month
        generateCalendar();
        
        // Set up event listeners
        setupEventListeners();
        
        // Update summary
        updateBookingSummary();
        
        console.log('Booking page initialized successfully!');
    }

    function setupEventListeners() {
        // Calendar navigation
        const prevMonthBtn = document.getElementById('prevMonth');
        const nextMonthBtn = document.getElementById('nextMonth');
        
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                generateCalendar();
            });
        }
        
        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                generateCalendar();
            });
        }

        // Form inputs
        const patientInputs = ['patientName', 'patientPhone', 'patientEmail', 'patientAge'];
        patientInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', updateBookingSummary);
            }
        });

        // Payment options
        const paymentTypeInputs = document.querySelectorAll('input[name="paymentType"]');
        paymentTypeInputs.forEach(input => {
            input.addEventListener('change', handlePaymentTypeChange);
        });

        const paymentMethodInputs = document.querySelectorAll('input[name="paymentMethod"]');
        paymentMethodInputs.forEach(input => {
            input.addEventListener('change', updateBookingSummary);
        });

        // Form submission
        const bookingForm = document.getElementById('bookingForm');
        if (bookingForm) {
            bookingForm.addEventListener('submit', handleFormSubmission);
        }

        // Change doctor button
        const changeDoctorBtn = document.querySelector('.change-doctor');
        if (changeDoctorBtn) {
            changeDoctorBtn.addEventListener('click', handleChangeDoctorClick);
        }
    }

    function generateCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        const currentMonthElement = document.getElementById('currentMonth');
        
        if (!calendarGrid || !currentMonthElement) return;

        // Update month display
        const monthNames = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 
                           'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
        currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

        // Clear existing calendar
        calendarGrid.innerHTML = '';

        // Get first day of month and number of days
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of the month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            dayElement.dataset.date = dayDate.toISOString().split('T')[0];

            // Check if day is today
            if (dayDate.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }

            // Check if day is in the past
            if (dayDate < today.setHours(0, 0, 0, 0)) {
                dayElement.classList.add('unavailable');
            } else {
                // Simulate some unavailable days (weekends and random days)
                if (dayDate.getDay() === 0 || dayDate.getDay() === 6 || Math.random() < 0.2) {
                    dayElement.classList.add('unavailable');
                } else {
                    dayElement.classList.add('available');
                    dayElement.addEventListener('click', () => handleDateSelection(dayElement, dayDate));
                }
            }

            calendarGrid.appendChild(dayElement);
        }
    }

    function handleDateSelection(dayElement, date) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });

        // Add selection to clicked day
        dayElement.classList.add('selected');
        selectedDate = date;
        bookingData.date = date;

        // Generate time slots for selected date
        generateTimeSlots(date);
        
        // Update summary
        updateBookingSummary();
        
        // Enable form validation
        validateForm();
    }

    function generateTimeSlots(date) {
        const timeSlotsContainer = document.getElementById('timeSlots');
        const noSlotsMessage = document.getElementById('noSlotsMessage');
        
        if (!timeSlotsContainer) return;

        // Clear existing slots
        timeSlotsContainer.innerHTML = '';
        
        // Define available time slots
        const timeSlots = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
        ];

        let availableSlots = 0;

        timeSlots.forEach(time => {
            const slotElement = document.createElement('button');
            slotElement.type = 'button';
            slotElement.className = 'time-slot';
            slotElement.textContent = time;

            // Simulate availability (some slots unavailable)
            if (Math.random() < 0.3) {
                slotElement.classList.add('unavailable');
            } else {
                slotElement.classList.add('available');
                availableSlots++;
                slotElement.addEventListener('click', () => handleTimeSelection(slotElement, time));
            }

            timeSlotsContainer.appendChild(slotElement);
        });

        // Show/hide no slots message
        if (availableSlots === 0) {
            timeSlotsContainer.style.display = 'none';
            noSlotsMessage.style.display = 'block';
        } else {
            timeSlotsContainer.style.display = 'grid';
            noSlotsMessage.style.display = 'none';
        }

        // Clear previous time selection
        selectedTime = null;
        bookingData.time = null;
        updateBookingSummary();
        validateForm();
    }

    function handleTimeSelection(slotElement, time) {
        // Remove previous selection
        document.querySelectorAll('.time-slot.selected').forEach(slot => {
            slot.classList.remove('selected');
        });

        // Add selection to clicked slot
        slotElement.classList.add('selected');
        selectedTime = time;
        bookingData.time = time;

        // Update summary
        updateBookingSummary();
        
        // Enable form validation
        validateForm();
    }

    function handlePaymentTypeChange(event) {
        const paymentType = event.target.value;
        bookingData.paymentType = paymentType;
        
        // Update total amount based on payment type
        if (paymentType === 'deposit') {
            bookingData.totalAmount = 30;
        } else {
            bookingData.totalAmount = 80;
        }
        
        updateBookingSummary();
    }

    function updateBookingSummary() {
        // Update doctor info
        const summaryDoctor = document.getElementById('summaryDoctor');
        const summarySpecialty = document.getElementById('summarySpecialty');
        
        if (summaryDoctor) summaryDoctor.textContent = bookingData.doctor;
        if (summarySpecialty) summarySpecialty.textContent = bookingData.specialty;

        // Update date
        const summaryDate = document.getElementById('summaryDate');
        if (summaryDate) {
            if (selectedDate) {
                const options = { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                };
                summaryDate.textContent = selectedDate.toLocaleDateString('az-AZ', options);
            } else {
                summaryDate.textContent = 'Tarix seçin';
            }
        }

        // Update time
        const summaryTime = document.getElementById('summaryTime');
        if (summaryTime) {
            summaryTime.textContent = selectedTime || 'Vaxt seçin';
        }

        // Update patient info
        const summaryPatient = document.getElementById('summaryPatient');
        const patientName = document.getElementById('patientName');
        if (summaryPatient && patientName) {
            summaryPatient.textContent = patientName.value || 'Məlumat daxil edin';
        }

        // Update payment info
        const summaryPayment = document.getElementById('summaryPayment');
        const summaryTotal = document.getElementById('summaryTotal');
        
        if (summaryPayment) {
            const paymentTypeElement = document.querySelector('input[name="paymentType"]:checked');
            if (paymentTypeElement) {
                summaryPayment.textContent = paymentTypeElement.value === 'deposit' ? 'Depozit ödənişi' : 'Tam ödəniş';
            }
        }
        
        if (summaryTotal) {
            summaryTotal.textContent = `₼${bookingData.totalAmount}`;
        }
    }

    function validateForm() {
        const submitBtn = document.querySelector('.submit-booking');
        const patientName = document.getElementById('patientName');
        const patientPhone = document.getElementById('patientPhone');
        
        if (submitBtn) {
            const isValid = selectedDate && 
                           selectedTime && 
                           patientName && patientName.value.trim() && 
                           patientPhone && patientPhone.value.trim();
            
            submitBtn.disabled = !isValid;
        }
    }

    function handleFormSubmission(event) {
        event.preventDefault();
        
        // Validate required fields
        const patientName = document.getElementById('patientName').value.trim();
        const patientPhone = document.getElementById('patientPhone').value.trim();
        
        if (!selectedDate || !selectedTime) {
            showNotification('Zəhmət olmasa tarix və vaxt seçin', 'error');
            return;
        }
        
        if (!patientName) {
            showNotification('Ad və soyad sahəsi tələb olunur', 'error');
            document.getElementById('patientName').focus();
            return;
        }
        
        if (!patientPhone) {
            showNotification('Telefon sahəsi tələb olunur', 'error');
            document.getElementById('patientPhone').focus();
            return;
        }

        // Collect form data
        bookingData.patient = {
            name: patientName,
            phone: patientPhone,
            email: document.getElementById('patientEmail').value.trim(),
            age: document.getElementById('patientAge').value,
            notes: document.getElementById('patientNotes').value.trim()
        };

        bookingData.paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        // Show loading state
        const submitBtn = document.querySelector('.submit-booking');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Təsdiq edilir...';
        submitBtn.disabled = true;

        // Simulate booking process
        setTimeout(() => {
            showSuccessModal();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    function showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (!modal) return;

        // Update modal content with booking details
        const modalDoctor = document.getElementById('modalDoctor');
        const modalDate = document.getElementById('modalDate');
        const modalTime = document.getElementById('modalTime');
        const modalPayment = document.getElementById('modalPayment');

        if (modalDoctor) modalDoctor.textContent = bookingData.doctor;
        if (modalDate && selectedDate) {
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
            };
            modalDate.textContent = selectedDate.toLocaleDateString('az-AZ', options);
        }
        if (modalTime) modalTime.textContent = selectedTime;
        if (modalPayment) {
            const paymentText = bookingData.paymentType === 'deposit' ? 
                `Depozit: ₼${bookingData.totalAmount}` : 
                `Tam ödəniş: ₼${bookingData.totalAmount}`;
            modalPayment.textContent = paymentText;
        }

        // Show modal
        modal.style.display = 'flex';
        
        // Add click outside to close
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeSuccessModal();
            }
        });
    }

    function handleChangeDoctorClick() {
        // Redirect to doctor search page
        window.location.href = 'doctor-search.html';
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

    // Global function to close success modal
    window.closeSuccessModal = function() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.style.display = 'none';
        }
    };
});
