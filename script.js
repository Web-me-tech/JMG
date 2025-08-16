// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 31, 68, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 31, 68, 0.95)';
        }
    });

    // Fade in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animation
    document.querySelectorAll('.benefit-card, .power-category, .product-card, .type-card, .category-card, .solution-card, .metric-card').forEach(el => {
        observer.observe(el);
    });

    // Animated counters for performance metrics
    function animateCounters() {
        const counters = document.querySelectorAll('.metric-number');
        counters.forEach(counter => {
            const target = parseFloat(counter.textContent);
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (counter.textContent.includes('%')) {
                    counter.textContent = Math.floor(current) + '%';
                } else if (counter.textContent.includes('+')) {
                    counter.textContent = Math.floor(current) + '+';
                } else if (counter.textContent.includes('/')) {
                    counter.textContent = '24/7';
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 20);
        });
    }

    // Trigger counter animation when metrics section is visible
    const metricsSection = document.querySelector('.performance-metrics');
    if (metricsSection) {
        const metricsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    metricsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        metricsObserver.observe(metricsSection);
    }

    // Button hover effects
    document.querySelectorAll('.cta-button, .calculate-btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Card hover effects
    document.querySelectorAll('.benefit-card, .power-category, .product-card, .type-card, .category-card, .solution-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        });
    });

    // Parallax effect for hero sections
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
});

// Solar Calculator Function
function calculateSolar() {
    const monthlyBill = parseFloat(document.getElementById('monthly-bill').value);
    const roofArea = parseFloat(document.getElementById('roof-area').value);
    
    if (!monthlyBill || !roofArea) {
        alert('Please enter both monthly bill amount and roof area.');
        return;
    }
    
    // Calculations based on Nigerian solar conditions
    const dailySunHours = 6; // Average daily sun hours in Nigeria
    const systemEfficiency = 0.75; // System efficiency factor
    const costPerWatt = 1000; // Naira per watt installed
    const panelWattsPerSqm = 200; // Watts per square meter
    
    // Calculate system size
    const maxSystemSize = Math.floor(roofArea * panelWattsPerSqm / 1000); // in kW
    const requiredSystemSize = Math.min(maxSystemSize, Math.ceil(monthlyBill * 12 / (dailySunHours * 365 * systemEfficiency * 250))); // 250 Naira per kWh
    
    // Calculate savings and payback
    const annualGeneration = requiredSystemSize * 1000 * dailySunHours * 365 * systemEfficiency / 1000; // kWh per year
    const annualSavings = annualGeneration * 250; // Naira savings per year
    const systemCost = requiredSystemSize * 1000 * costPerWatt;
    const paybackPeriod = Math.ceil(systemCost / annualSavings * 10) / 10;
    const lifetimeSavings = annualSavings * 25 - systemCost;
    
    // Update results
    document.getElementById('system-size').textContent = requiredSystemSize.toFixed(1) + ' kW';
    document.getElementById('annual-savings').textContent = '₦' + annualSavings.toLocaleString();
    document.getElementById('payback-period').textContent = paybackPeriod + ' years';
    document.getElementById('lifetime-savings').textContent = '₦' + lifetimeSavings.toLocaleString();
    
    // Show results with animation
    const results = document.getElementById('calculator-results');
    results.style.opacity = '0';
    results.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        results.style.transition = 'all 0.5s ease';
        results.style.opacity = '1';
        results.style.transform = 'translateY(0)';
    }, 100);
}

// Form validation and enhancement
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[type="number"]');
    
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--nigeria-green)';
            this.style.boxShadow = '0 0 0 3px rgba(0, 122, 51, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = 'rgba(0, 0, 0, 0.1)';
            this.style.boxShadow = 'none';
        });
    });
});

// Performance optimization - Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Accessibility improvements
document.addEventListener('DOMContentLoaded', function() {
    // Skip link functionality
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        left: -10000px;
        top: auto;
        width: 1px;
        height: 1px;
        overflow: hidden;
        z-index: 9999;
        background: var(--nigeria-green);
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 0 0 4px 4px;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.left = '8px';
        this.style.top = '8px';
        this.style.width = 'auto';
        this.style.height = 'auto';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.left = '-10000px';
        this.style.top = 'auto';
        this.style.width = '1px';
        this.style.height = '1px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const mainContent = document.querySelector('.hero') || document.querySelector('main') || document.body;
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
});

// Error handling for calculator
window.calculateSolar = function() {
    try {
        const monthlyBill = parseFloat(document.getElementById('monthly-bill')?.value);
        const roofArea = parseFloat(document.getElementById('roof-area')?.value);
        
        if (isNaN(monthlyBill) || isNaN(roofArea) || monthlyBill <= 0 || roofArea <= 0) {
            throw new Error('Please enter valid positive numbers for both fields.');
        }
        
        if (monthlyBill > 10000000) {
            throw new Error('Monthly bill seems too high. Please check your input.');
        }
        
        if (roofArea > 10000) {
            throw new Error('Roof area seems too large. Please check your input.');
        }
        
        // Existing calculation logic...
        const dailySunHours = 6;
        const systemEfficiency = 0.75;
        const costPerWatt = 1000;
        const panelWattsPerSqm = 200;
        
        const maxSystemSize = Math.floor(roofArea * panelWattsPerSqm / 1000);
        const requiredSystemSize = Math.min(maxSystemSize, Math.ceil(monthlyBill * 12 / (dailySunHours * 365 * systemEfficiency * 250)));
        
        if (requiredSystemSize <= 0) {
            throw new Error('Unable to calculate system size. Please check your inputs.');
        }
        
        const annualGeneration = requiredSystemSize * 1000 * dailySunHours * 365 * systemEfficiency / 1000;
        const annualSavings = annualGeneration * 250;
        const systemCost = requiredSystemSize * 1000 * costPerWatt;
        const paybackPeriod = Math.ceil(systemCost / annualSavings * 10) / 10;
        const lifetimeSavings = annualSavings * 25 - systemCost;
        
        // Update results safely
        const elements = {
            'system-size': requiredSystemSize.toFixed(1) + ' kW',
            'annual-savings': '₦' + Math.round(annualSavings).toLocaleString(),
            'payback-period': paybackPeriod + ' years',
            'lifetime-savings': '₦' + Math.round(lifetimeSavings).toLocaleString()
        };
        
        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id];
            }
        });
        
        // Animate results
        const results = document.getElementById('calculator-results');
        if (results) {
            results.style.opacity = '0';
            results.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                results.style.transition = 'all 0.5s ease';
                results.style.opacity = '1';
                results.style.transform = 'translateY(0)';
            }, 100);
        }
        
    } catch (error) {
        alert(error.message);
        console.error('Solar calculator error:', error);
    }
};
// JMG Corporate Website - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scrolling for anchor links
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

    // Animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.card, .project-card, .team-card, .news-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Project filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Form validation and submission
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            
            // Basic validation
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = '#ff4444';
                    isValid = false;
                } else {
                    field.style.borderColor = '#ddd';
                }
            });
            
            if (isValid) {
                // Show success message
                showNotification('Thank you! Your message has been sent successfully.', 'success');
                form.reset();
            } else {
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    });

    // Notification system
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Counter animation
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current);
            }, 16);
        });
    }

    // Initialize counters when they come into view
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Testimonial slider (if exists)
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
        const dots = testimonialSlider.querySelectorAll('.dot');
        let currentSlide = 0;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        // Auto-advance slides
        setInterval(nextSlide, 5000);

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        showSlide(0);
    }

    // Back to top button
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--accent-gold);
        color: var(--primary-navy);
        border: none;
        border-radius: 50%;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;

    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});