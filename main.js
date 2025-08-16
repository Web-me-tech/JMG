// IMPLEMENTED USING ONLY PLAIN HTML, CSS & JAVASCRIPT — NO FRAMEWORKS — NO BUILD STEP

(function() {
    'use strict';

    // Global state
    let currentStep = 1;
    let currentProjectSlide = 0;
    let currentTestimonial = 0;
    let testimonialInterval;

    // DOM Elements
    const elements = {
        themeToggle: document.getElementById('theme-toggle'),
        navToggle: document.getElementById('nav-toggle'),
        navMenu: document.getElementById('nav-menu'),
        floatingToggle: document.getElementById('floating-toggle'),
        floatingActions: document.getElementById('floating-actions'),
        floatingMenu: document.getElementById('floating-menu'),
        multiStepForm: document.getElementById('multi-step-form'),
        newsletterForm: document.getElementById('newsletter-form'),
        projectCarousel: document.getElementById('project-carousel'),
        projectTrack: document.getElementById('project-track'),
        prevBtn: document.getElementById('prev-btn'),
        nextBtn: document.getElementById('next-btn'),
        carouselPagination: document.getElementById('carousel-pagination'),
        testimonialCarousel: document.getElementById('testimonial-carousel'),
        toastContainer: document.getElementById('toast-container')
    };

    // Initialize app
    function init() {
        setupThemeToggle();
        setupNavigation();
        setupFloatingActions();
        setupKPICounters();
        setupProjectCarousel();
        setupTestimonials();
        setupMultiStepForm();
        setupNewsletterForm();
        setupSmoothScrolling();
        setupDropdowns();
    }

    // Theme Toggle
    function setupThemeToggle() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        document.documentElement.setAttribute('data-theme', theme);
        
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener('click', toggleTheme);
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add a subtle animation
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    // Navigation
    function setupNavigation() {
        if (elements.navToggle && elements.navMenu) {
            elements.navToggle.addEventListener('click', toggleMobileMenu);
        }

        // Close mobile menu when clicking on links
        const navLinks = elements.navMenu?.querySelectorAll('.nav__link');
        navLinks?.forEach(link => {
            link.addEventListener('click', () => {
                elements.navMenu.classList.remove('active');
            });
        });

        // Handle sticky header
        window.addEventListener('scroll', handleHeaderScroll);
    }

    function toggleMobileMenu() {
        elements.navMenu.classList.toggle('active');
        
        // Update toggle lines animation
        const lines = elements.navToggle.querySelectorAll('.nav__toggle-line');
        lines.forEach((line, index) => {
            line.style.transform = elements.navMenu.classList.contains('active') 
                ? getToggleLineTransform(index)
                : 'none';
        });
    }

    function getToggleLineTransform(index) {
        const transforms = [
            'rotate(45deg) translate(6px, 6px)',
            'opacity: 0',
            'rotate(-45deg) translate(6px, -6px)'
        ];
        return transforms[index] || 'none';
    }

    function handleHeaderScroll() {
        const header = document.getElementById('header');
        if (!header) return;

        const scrolled = window.scrollY > 50;
        header.style.background = scrolled 
            ? 'rgba(255, 255, 255, 0.98)' 
            : 'rgba(255, 255, 255, 0.95)';
        
        // Dark mode adjustment
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            header.style.background = scrolled 
                ? 'rgba(18, 20, 23, 0.98)' 
                : 'rgba(18, 20, 23, 0.95)';
        }
    }

    // Floating Actions
    function setupFloatingActions() {
        if (elements.floatingToggle && elements.floatingActions) {
            elements.floatingToggle.addEventListener('click', toggleFloatingMenu);
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!elements.floatingActions?.contains(e.target)) {
                elements.floatingActions?.classList.remove('active');
            }
        });
    }

    function toggleFloatingMenu(e) {
        e.stopPropagation();
        elements.floatingActions.classList.toggle('active');
    }

    // KPI Counters
    function setupKPICounters() {
        const counters = document.querySelectorAll('[data-count]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        counters.forEach(counter => observer.observe(counter));
    }

    function animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        let current = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(Math.floor(current));
            }
        }, 16);
    }

    // Project Carousel
    function setupProjectCarousel() {
        if (!elements.projectCarousel) return;

        const slides = elements.projectTrack?.children || [];
        const totalSlides = slides.length;

        if (totalSlides === 0) return;

        // Create pagination dots
        createPaginationDots(totalSlides);

        // Event listeners
        elements.prevBtn?.addEventListener('click', () => navigateCarousel('prev'));
        elements.nextBtn?.addEventListener('click', () => navigateCarousel('next'));

        // Touch/swipe support
        setupCarouselTouch();

        // Auto-play (optional)
        // setInterval(() => navigateCarousel('next'), 5000);
    }

    function createPaginationDots(count) {
        if (!elements.carouselPagination) return;

        elements.carouselPagination.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('button');
            dot.className = `pagination-dot ${i === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            elements.carouselPagination.appendChild(dot);
        }
    }

    function navigateCarousel(direction) {
        const slides = elements.projectTrack?.children || [];
        const totalSlides = slides.length;

        if (totalSlides === 0) return;

        if (direction === 'next') {
            currentProjectSlide = (currentProjectSlide + 1) % totalSlides;
        } else {
            currentProjectSlide = (currentProjectSlide - 1 + totalSlides) % totalSlides;
        }

        updateCarousel();
    }

    function goToSlide(index) {
        currentProjectSlide = index;
        updateCarousel();
    }

    function updateCarousel() {
        if (!elements.projectTrack) return;

        const slideWidth = 370; // 350px + 20px gap
        const offset = -currentProjectSlide * slideWidth;
        
        elements.projectTrack.style.transform = `translateX(${offset}px)`;

        // Update pagination
        const dots = elements.carouselPagination?.querySelectorAll('.pagination-dot');
        dots?.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentProjectSlide);
        });
    }

    function setupCarouselTouch() {
        if (!elements.projectTrack) return;

        let startX = 0;
        let isDragging = false;

        elements.projectTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        elements.projectTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });

        elements.projectTrack.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) { // Minimum swipe distance
                navigateCarousel(diff > 0 ? 'next' : 'prev');
            }

            isDragging = false;
        });
    }

    // Testimonials Carousel
    function setupTestimonials() {
        const testimonials = document.querySelectorAll('.testimonial');
        if (testimonials.length === 0) return;

        // Start auto-rotation
        testimonialInterval = setInterval(nextTestimonial, 5000);

        // Pause on hover
        elements.testimonialCarousel?.addEventListener('mouseenter', () => {
            clearInterval(testimonialInterval);
        });

        elements.testimonialCarousel?.addEventListener('mouseleave', () => {
            testimonialInterval = setInterval(nextTestimonial, 5000);
        });
    }

    function nextTestimonial() {
        const testimonials = document.querySelectorAll('.testimonial');
        if (testimonials.length === 0) return;

        testimonials[currentTestimonial]?.classList.remove('active');
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial]?.classList.add('active');
    }

    // Multi-Step Form
    function setupMultiStepForm() {
        if (!elements.multiStepForm) return;

        elements.multiStepForm.addEventListener('submit', handleFormSubmit);

        // Setup validation for real-time feedback
        const inputs = elements.multiStepForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        const errorElement = document.getElementById(`${fieldName}-error`);
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        if (errorElement) {
            errorElement.textContent = '';
        }
        field.classList.remove('error');

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'This field is required.';
            isValid = false;
        }

        // Email validation
        else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address.';
                isValid = false;
            }
        }

        // Phone validation for Nigerian numbers
        else if (field.type === 'tel' && value) {
            const phoneRegex = /^(\+234|234|0)[789]\d{9}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                errorMessage = 'Please enter a valid Nigerian phone number.';
                isValid = false;
            }
        }

        // Service selection validation
        else if (fieldName === 'services') {
            const checkedServices = elements.multiStepForm.querySelectorAll('input[name="services"]:checked');
            if (checkedServices.length === 0) {
                errorMessage = 'Please select at least one service.';
                isValid = false;
            }
        }

        if (!isValid) {
            if (errorElement) {
                errorElement.textContent = errorMessage;
            }
            field.classList.add('error');
        }

        return isValid;
    }

    function clearFieldError(field) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
        field.classList.remove('error');
    }

    function validateStep(step) {
        const currentStepElement = document.querySelector(`[data-step="${step}"].active`);
        if (!currentStepElement) return false;

        const inputs = currentStepElement.querySelectorAll('input, select, textarea');
        let isStepValid = true;

        inputs.forEach(input => {
            if (!validateField(input)) {
                isStepValid = false;
            }
        });

        // Special validation for services checkboxes
        if (step === 3) {
            const checkedServices = currentStepElement.querySelectorAll('input[name="services"]:checked');
            if (checkedServices.length === 0) {
                const errorElement = document.getElementById('services-error');
                if (errorElement) {
                    errorElement.textContent = 'Please select at least one service.';
                }
                isStepValid = false;
            }
        }

        return isStepValid;
    }

    async function handleFormSubmit(e) {
        e.preventDefault();

        // Validate final step
        if (!validateStep(3)) {
            showToast('Please correct the errors before submitting.', 'error');
            return;
        }

        // Check honeypot
        const honeypot = document.getElementById('honeypot');
        if (honeypot && honeypot.value) {
            // Potential spam, silently reject
            return;
        }

        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(elements.multiStepForm);
            const data = Object.fromEntries(formData.entries());
            
            // Handle multiple services
            const services = Array.from(elements.multiStepForm.querySelectorAll('input[name="services"]:checked'))
                .map(cb => cb.value);
            data.services = services;

            // Attempt to send to server (will fail in demo)
            const response = await fetch('/api/quote-request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                showToast('Quote request submitted successfully! We\'ll contact you within 24 hours.', 'success');
                elements.multiStepForm.reset();
                currentStep = 1;
                updateFormStep();
            } else {
                throw new Error('Server error');
            }
        } catch (error) {
            // Fallback to mailto
            const formData = new FormData(elements.multiStepForm);
            const data = Object.fromEntries(formData.entries());
            const services = Array.from(elements.multiStepForm.querySelectorAll('input[name="services"]:checked'))
                .map(cb => cb.value);
            
            const emailBody = createEmailBody(data, services);
            const mailtoLink = `mailto:info@jmglimited.ng?subject=Quote Request - ${data.company}&body=${encodeURIComponent(emailBody)}`;
            
            window.location.href = mailtoLink;
            
            showToast('Opening email client with your quote request...', 'info');
            
            // Reset form after a short delay
            setTimeout(() => {
                elements.multiStepForm.reset();
                currentStep = 1;
                updateFormStep();
            }, 1000);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    function createEmailBody(data, services) {
        return `
Quote Request Details:

CONTACT INFORMATION:
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}

COMPANY INFORMATION:
Company: ${data.company}
City: ${data.city}
Industry: ${data.industry || 'Not specified'}

PROJECT REQUIREMENTS:
Services Required: ${services.join(', ')}
Budget Range: ${data.budget || 'Not specified'}
Timeline: ${data.timeline || 'Not specified'}

Project Details:
${data.message || 'No additional details provided'}

---
This request was submitted via the JMG Limited website quote form.
        `.trim();
    }

    // Newsletter Form
    function setupNewsletterForm() {
        if (!elements.newsletterForm) return;

        elements.newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('newsletter-email');
            const email = emailInput.value.trim();

            if (!email || !validateEmail(email)) {
                showToast('Please enter a valid email address.', 'error');
                return;
            }

            try {
                // Attempt to submit to server (will fail in demo)
                const response = await fetch('/api/newsletter-signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                });

                if (response.ok) {
                    showToast('Successfully subscribed to newsletter!', 'success');
                    emailInput.value = '';
                } else {
                    throw new Error('Server error');
                }
            } catch (error) {
                // Fallback - just show success message for demo
                showToast('Thanks for subscribing! (Demo mode - no actual signup)', 'info');
                emailInput.value = '';
            }
        });
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Dropdown menus
    function setupDropdowns() {
        const dropdowns = document.querySelectorAll('.nav__dropdown');
        
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.nav__dropdown-toggle');
            const menu = dropdown.querySelector('.nav__dropdown-menu');
            
            if (!toggle || !menu) return;
            
            // Keyboard accessibility
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                    toggle.setAttribute('aria-expanded', !isExpanded);
                }
                
                if (e.key === 'Escape') {
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.focus();
                }
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Smooth Scrolling
    function setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (!target) return;
                
                e.preventDefault();
                const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                const targetTop = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetTop,
                    behavior: 'smooth'
                });
            });
        });
    }

    // Form Navigation Functions (Global scope for button onclick)
    window.nextStep = function() {
        if (!validateStep(currentStep)) {
            showToast('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        if (currentStep < 3) {
            currentStep++;
            updateFormStep();
        }
    };

    window.prevStep = function() {
        if (currentStep > 1) {
            currentStep--;
            updateFormStep();
        }
    };

    function updateFormStep() {
        // Hide all steps
        const steps = document.querySelectorAll('.form-step');
        steps.forEach(step => step.classList.remove('active'));
        
        // Show current step
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
        
        // Update progress indicators
        const progressSteps = document.querySelectorAll('.progress-step');
        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 === currentStep);
        });
    }

    // Toast Notifications
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.innerHTML = `
            <div class="toast__message">${message}</div>
            <button class="toast__close" aria-label="Close notification">&times;</button>
        `;
        
        elements.toastContainer.appendChild(toast);
        
        // Auto-remove after 5 seconds
        const autoRemoveTimer = setTimeout(() => {
            removeToast(toast);
        }, 5000);
        
        // Manual close
        const closeBtn = toast.querySelector('.toast__close');
        closeBtn.addEventListener('click', () => {
            clearTimeout(autoRemoveTimer);
            removeToast(toast);
        });
    }

    function removeToast(toast) {
        toast.style.animation = 'slideOutRight 0.3s ease-in-out';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // Download Brochure Function (Global scope)
    window.downloadBrochure = function(type) {
        // In a real application, this would trigger a file download
        // For demo purposes, we'll show a toast
        const fileName = getBrochureFileName(type);
        showToast(`Downloading ${fileName}... (Demo mode - no actual download)`, 'info');
        
        // Simulate download analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'download', {
                'event_category': 'Brochure',
                'event_label': type
            });
        }
    };

    function getBrochureFileName(type) {
        const fileNames = {
            'company-profile': 'JMG_Company_Profile.pdf',
            'cooling': 'Trane_Cooling_Solutions.pdf',
            'power': 'Power_Generation_Systems.pdf',
            'elevators': 'Elevator_Solutions.pdf',
            'compressors': 'Industrial_Compressors.pdf',
            'electrical': 'Electrical_Infrastructure.pdf',
            'solar': 'Solar_Energy_Solutions.pdf'
        };
        return fileNames[type] || 'JMG_Brochure.pdf';
    }

    // Utility Functions
    function formatNumber(num) {
        return new Intl.NumberFormat('en-NG').format(num);
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    }

    function formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('234')) {
            return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
        } else if (cleaned.startsWith('0')) {
            return `+234 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
        }
        return phone;
    }

    // Make utility functions globally available
    window.formatNumber = formatNumber;
    window.formatCurrency = formatCurrency;
    window.formatPhone = formatPhone;

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(testimonialInterval);
        } else {
            testimonialInterval = setInterval(nextTestimonial, 5000);
        }
    });

})();