// Smart Clinic Doctor Search JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Store all doctors data
    let allDoctors = [];
    let filteredDoctors = [];
    let currentFilters = {
        search: '',
        specialty: [],
        location: [],
        rating: '',
        availability: [],
        priceMin: 0,
        priceMax: 500
    };

    // Get DOM elements
    const mainSearch = document.getElementById('mainSearch');
    const searchBtn = document.querySelector('.search-btn');
    const sortSelect = document.getElementById('sortBy');
    const clearFiltersBtn = document.querySelector('.clear-filters');
    const mobileFilterToggle = document.querySelector('.mobile-filter-toggle');
    const filtersSidebar = document.querySelector('.filters-sidebar');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const resultsCount = document.getElementById('resultsCount');
    const doctorsGrid = document.getElementById('doctorsGrid');

    // Initialize search functionality
    function initializeDoctorSearch() {
        // Get initial doctors data from DOM
        loadDoctorsFromDOM();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initial filter application
        applyFilters();
        
        console.log('Doctor search initialized successfully!');
    }

    function loadDoctorsFromDOM() {
        const doctorCards = document.querySelectorAll('.doctor-card');
        allDoctors = Array.from(doctorCards).map(card => {
            return {
                element: card,
                name: card.querySelector('h3').textContent,
                specialty: card.dataset.specialty,
                location: card.dataset.location,
                rating: parseFloat(card.dataset.rating),
                price: parseFloat(card.dataset.price),
                image: card.querySelector('.doctor-image img').src,
                experience: card.querySelector('.experience').textContent,
                ratingText: card.querySelector('.rating-text').textContent,
                locationText: card.querySelector('.location').textContent.replace(/.*\s/, ''),
                onlineStatus: card.querySelector('.online-status').classList.contains('online'),
                timeSlots: Array.from(card.querySelectorAll('.time-slot')).map(slot => ({
                    time: slot.textContent,
                    available: slot.classList.contains('available')
                }))
            };
        });
        filteredDoctors = [...allDoctors];
    }

    function setupEventListeners() {
        // Main search
        if (mainSearch) {
            mainSearch.addEventListener('input', debounce(handleSearch, 300));
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', handleSearch);
        }

        // Sort functionality
        if (sortSelect) {
            sortSelect.addEventListener('change', handleSort);
        }

        // Filter checkboxes and radio buttons
        const filterInputs = document.querySelectorAll('.filter-option input');
        filterInputs.forEach(input => {
            input.addEventListener('change', handleFilterChange);
        });

        // Price range inputs
        const priceInputs = document.querySelectorAll('.price-inputs input');
        priceInputs.forEach(input => {
            input.addEventListener('input', debounce(handlePriceChange, 300));
        });

        const priceSlider = document.getElementById('priceRange');
        if (priceSlider) {
            priceSlider.addEventListener('input', handlePriceSliderChange);
        }

        // Clear filters
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', clearAllFilters);
        }

        // Mobile filter toggle
        if (mobileFilterToggle) {
            mobileFilterToggle.addEventListener('click', toggleMobileFilters);
        }

        // Load more functionality
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', loadMoreDoctors);
        }

        // Book appointment buttons
        const bookButtons = document.querySelectorAll('.book-appointment');
        bookButtons.forEach(button => {
            button.addEventListener('click', handleBookAppointment);
        });

        // Time slot selection
        const timeSlots = document.querySelectorAll('.time-slot.available');
        timeSlots.forEach(slot => {
            slot.addEventListener('click', handleTimeSlotSelection);
        });

        // Close mobile filters when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                !filtersSidebar.contains(e.target) && 
                !mobileFilterToggle.contains(e.target) &&
                filtersSidebar.classList.contains('active')) {
                filtersSidebar.classList.remove('active');
            }
        });
    }

    function handleSearch() {
        currentFilters.search = mainSearch.value.toLowerCase().trim();
        applyFilters();
    }

    function handleSort() {
        const sortBy = sortSelect.value;
        sortDoctors(sortBy);
        renderDoctors();
    }

    function handleFilterChange(e) {
        const input = e.target;
        const filterType = input.closest('.filter-group').querySelector('h4').textContent.toLowerCase();
        const value = input.value;

        if (input.type === 'checkbox') {
            if (filterType.includes('ixtisas')) {
                if (input.checked) {
                    currentFilters.specialty.push(value);
                } else {
                    currentFilters.specialty = currentFilters.specialty.filter(s => s !== value);
                }
            } else if (filterType.includes('yerləşmə')) {
                if (input.checked) {
                    currentFilters.location.push(value);
                } else {
                    currentFilters.location = currentFilters.location.filter(l => l !== value);
                }
            } else if (filterType.includes('mövcudluq')) {
                if (input.checked) {
                    currentFilters.availability.push(value);
                } else {
                    currentFilters.availability = currentFilters.availability.filter(a => a !== value);
                }
            }
        } else if (input.type === 'radio' && filterType.includes('reytinq')) {
            currentFilters.rating = input.checked ? value : '';
        }

        applyFilters();
    }

    function handlePriceChange() {
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        
        currentFilters.priceMin = minPrice ? parseFloat(minPrice) : 0;
        currentFilters.priceMax = maxPrice ? parseFloat(maxPrice) : 500;
        
        applyFilters();
    }

    function handlePriceSliderChange(e) {
        const value = e.target.value;
        document.getElementById('maxPrice').value = value;
        currentFilters.priceMax = parseFloat(value);
        applyFilters();
    }

    function applyFilters() {
        filteredDoctors = allDoctors.filter(doctor => {
            // Search filter
            if (currentFilters.search) {
                const searchTerm = currentFilters.search;
                const searchableText = `${doctor.name} ${doctor.specialty} ${doctor.locationText}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }

            // Specialty filter
            if (currentFilters.specialty.length > 0) {
                if (!currentFilters.specialty.includes(doctor.specialty)) {
                    return false;
                }
            }

            // Location filter
            if (currentFilters.location.length > 0) {
                if (!currentFilters.location.includes(doctor.location)) {
                    return false;
                }
            }

            // Rating filter
            if (currentFilters.rating) {
                const minRating = parseFloat(currentFilters.rating);
                if (doctor.rating < minRating) {
                    return false;
                }
            }

            // Price filter
            if (doctor.price < currentFilters.priceMin || doctor.price > currentFilters.priceMax) {
                return false;
            }

            // Availability filter (simplified - in real app would check actual availability)
            if (currentFilters.availability.length > 0) {
                // For demo purposes, randomly filter some doctors based on availability
                const hasAvailableSlots = doctor.timeSlots.some(slot => slot.available);
                if (!hasAvailableSlots && currentFilters.availability.includes('today')) {
                    return false;
                }
            }

            return true;
        });

        updateResultsCount();
        renderDoctors();
    }

    function sortDoctors(sortBy) {
        switch (sortBy) {
            case 'rating':
                filteredDoctors.sort((a, b) => b.rating - a.rating);
                break;
            case 'price-low':
                filteredDoctors.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredDoctors.sort((a, b) => b.price - a.price);
                break;
            case 'availability':
                filteredDoctors.sort((a, b) => {
                    const aAvailable = a.timeSlots.filter(slot => slot.available).length;
                    const bAvailable = b.timeSlots.filter(slot => slot.available).length;
                    return bAvailable - aAvailable;
                });
                break;
            default: // relevance
                // Keep original order for relevance
                break;
        }
    }

    function renderDoctors() {
        if (!doctorsGrid) return;

        // Clear current doctors
        doctorsGrid.innerHTML = '';

        // Render filtered doctors
        filteredDoctors.forEach(doctor => {
            doctorsGrid.appendChild(doctor.element.cloneNode(true));
        });

        // Re-attach event listeners to new elements
        reattachEventListeners();

        // Add animation
        const newCards = doctorsGrid.querySelectorAll('.doctor-card');
        newCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    function reattachEventListeners() {
        // Re-attach book appointment listeners
        const bookButtons = doctorsGrid.querySelectorAll('.book-appointment');
        bookButtons.forEach(button => {
            button.addEventListener('click', handleBookAppointment);
        });

        // Re-attach time slot listeners
        const timeSlots = doctorsGrid.querySelectorAll('.time-slot.available');
        timeSlots.forEach(slot => {
            slot.addEventListener('click', handleTimeSlotSelection);
        });
    }

    function updateResultsCount() {
        if (resultsCount) {
            resultsCount.textContent = filteredDoctors.length;
        }
    }

    function clearAllFilters() {
        // Reset filters object
        currentFilters = {
            search: '',
            specialty: [],
            location: [],
            rating: '',
            availability: [],
            priceMin: 0,
            priceMax: 500
        };

        // Clear form inputs
        if (mainSearch) mainSearch.value = '';
        
        const filterInputs = document.querySelectorAll('.filter-option input');
        filterInputs.forEach(input => {
            input.checked = false;
        });

        const priceInputs = document.querySelectorAll('.price-inputs input');
        priceInputs.forEach(input => {
            input.value = '';
        });

        const priceSlider = document.getElementById('priceRange');
        if (priceSlider) {
            priceSlider.value = 250;
        }

        // Reset sort
        if (sortSelect) {
            sortSelect.value = 'relevance';
        }

        // Apply filters (will show all doctors)
        applyFilters();
    }

    function toggleMobileFilters() {
        if (filtersSidebar) {
            filtersSidebar.classList.toggle('active');
        }
    }

    function loadMoreDoctors() {
        // In a real application, this would load more doctors from the server
        console.log('Loading more doctors...');
        
        // For demo purposes, just show a message
        if (loadMoreBtn) {
            loadMoreBtn.textContent = 'Bütün həkimlər göstərildi';
            loadMoreBtn.disabled = true;
            setTimeout(() => {
                loadMoreBtn.textContent = 'Daha çox həkim göstər';
                loadMoreBtn.disabled = false;
            }, 2000);
        }
    }

    function handleBookAppointment(e) {
        const doctorCard = e.target.closest('.doctor-card');
        const doctorName = doctorCard.querySelector('h3').textContent;
        
        // Add click animation
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 150);

        // Show booking modal (simplified)
        showBookingModal(doctorName);
    }

    function handleTimeSlotSelection(e) {
        const timeSlot = e.target;
        const doctorCard = timeSlot.closest('.doctor-card');
        
        // Remove selection from other slots in the same card
        const otherSlots = doctorCard.querySelectorAll('.time-slot');
        otherSlots.forEach(slot => {
            slot.classList.remove('selected');
        });
        
        // Add selection to clicked slot
        timeSlot.classList.add('selected');
        
        // Update the book appointment button
        const bookBtn = doctorCard.querySelector('.book-appointment');
        bookBtn.innerHTML = `
            <i class="fas fa-calendar-plus"></i>
            ${timeSlot.textContent} - Randevu Al
        `;
    }

    function showBookingModal(doctorName) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'booking-modal-overlay';
        modal.innerHTML = `
            <div class="booking-modal">
                <div class="modal-header">
                    <h3>Randevu Al</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-content">
                    <p><strong>${doctorName}</strong> ilə randevu almaq istədiyinizdən əminsiniz?</p>
                    <div class="booking-form">
                        <div class="form-group">
                            <label>Ad Soyad</label>
                            <input type="text" placeholder="Adınızı daxil edin">
                        </div>
                        <div class="form-group">
                            <label>Telefon</label>
                            <input type="tel" placeholder="+994 XX XXX XX XX">
                        </div>
                        <div class="form-group">
                            <label>Qeyd</label>
                            <textarea placeholder="Əlavə qeyd (ixtiyari)"></textarea>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-outline cancel-booking">Ləğv et</button>
                        <button class="btn-primary confirm-booking">Randevu Al</button>
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
                    max-height: 80vh;
                    overflow-y: auto;
                    animation: slideIn 0.3s ease;
                }
                
                .booking-modal .modal-header {
                    padding: 20px 24px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .booking-modal .modal-header h3 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                    color: #1f2937;
                }
                
                .booking-modal .modal-close {
                    background: none;
                    border: none;
                    font-size: 20px;
                    color: #6b7280;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                }
                
                .booking-modal .modal-close:hover {
                    background: #f3f4f6;
                    color: #374151;
                }
                
                .booking-modal .modal-content {
                    padding: 24px;
                }
                
                .booking-form {
                    margin: 20px 0;
                }
                
                .booking-form .form-group {
                    margin-bottom: 20px;
                }
                
                .booking-form .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #374151;
                }
                
                .booking-form .form-group input,
                .booking-form .form-group textarea {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: border-color 0.3s ease;
                }
                
                .booking-form .form-group input:focus,
                .booking-form .form-group textarea:focus {
                    outline: none;
                    border-color: #2563eb;
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                }
                
                .booking-modal .modal-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    margin-top: 24px;
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
        const nameInput = modal.querySelector('input[type="text"]');
        const phoneInput = modal.querySelector('input[type="tel"]');
        
        if (!nameInput.value.trim() || !phoneInput.value.trim()) {
            alert('Zəhmət olmasa bütün sahələri doldurun');
            return;
        }

        // Simulate booking confirmation
        alert('Randevunuz uğurla yaradıldı! Tezliklə sizinlə əlaqə saxlanılacaq.');
        closeBookingModal();
    }

    // Utility function for debouncing
    function debounce(func, wait) {
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

    // Add selected time slot styling
    const timeSlotStyles = document.createElement('style');
    timeSlotStyles.textContent = `
        .time-slot.selected {
            background: #2563eb !important;
            border-color: #2563eb !important;
            color: white !important;
        }
        
        .time-slot.selected:hover {
            background: #1d4ed8 !important;
            border-color: #1d4ed8 !important;
        }
    `;
    document.head.appendChild(timeSlotStyles);
});
