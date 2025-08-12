document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // Initialize carousel with autoplay and pause on hover
    const heroCarousel = document.getElementById('heroMediaCarousel');
    if (heroCarousel) {
        const carousel = new bootstrap.Carousel(heroCarousel, {
            interval: 6000,
            pause: 'hover',
            wrap: true,
            touch: true
        });

        // Keyboard navigation for carousel
        heroCarousel.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                carousel.prev();
            } else if (e.key === 'ArrowRight') {
                carousel.next();
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Newsletter form handling
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            // Enhanced email validation
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                emailInput.classList.add('is-invalid');
                return;
            }
            
            // Remove error state
            emailInput.classList.remove('is-invalid');
            
            // Show success message (replace with your actual submission logic)
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success mt-3';
            successMessage.textContent = `Thank you for subscribing with ${email}! We'll keep you updated.`;
            successMessage.setAttribute('role', 'alert');
            
            // Insert after form
            this.parentNode.insertBefore(successMessage, this.nextSibling);
            
            // Reset form
            this.reset();
            
            // Remove message after 5 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        });
    });

    // Cookie consent banner
    const cookieConsent = document.getElementById('cookieConsent');
    if (cookieConsent && !localStorage.getItem('cookieConsent')) {
        cookieConsent.classList.remove('d-none');
        
        document.getElementById('acceptCookies').addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'true');
            cookieConsent.classList.add('d-none');
        });
        
        document.getElementById('declineCookies').addEventListener('click', function() {
            localStorage.setItem('cookieConsent', 'false');
            cookieConsent.classList.add('d-none');
        });
    }

    // Lazy loading images with Intersection Observer
    if ('IntersectionObserver' in window) {
        const lazyImages = [].slice.call(document.querySelectorAll('img.lazy-load'));
        const lazyObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.add('loaded');
                    lazyObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyObserver.observe(lazyImage);
        });
    }

    // PesaPal payment integration
    const pesapalButton = document.getElementById('pesapal-payment-button');
    if (pesapalButton) {
        // Enable button by default
        pesapalButton.disabled = false;

        // PesaPal amount selection
        const pesapalAmountButtons = document.querySelectorAll('.pesapal-amount');
        pesapalAmountButtons.forEach(button => {
            button.addEventListener('click', function() {
                pesapalAmountButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                document.getElementById('pesapalCustomAmount').value = this.dataset.amount;
                validatePesapalForm();
            });
        });

        // PesaPal custom amount handling
        document.getElementById('pesapalCustomAmount').addEventListener('input', function() {
            pesapalAmountButtons.forEach(btn => btn.classList.remove('active'));
            validatePesapalForm();
        });

        // Add input listeners for all required fields
        const requiredFields = ['pesapalFirstName', 'pesapalLastName', 'pesapalEmail', 'pesapalPhone'];
        requiredFields.forEach(fieldId => {
            document.getElementById(fieldId).addEventListener('input', validatePesapalForm);
        });

        // Form validation function
        function validatePesapalForm() {
            const amount = document.getElementById('pesapalCustomAmount').value || 
                          document.querySelector('.pesapal-amount.active')?.dataset.amount;
            const firstName = document.getElementById('pesapalFirstName').value;
            const lastName = document.getElementById('pesapalLastName').value;
            const email = document.getElementById('pesapalEmail').value;
            const phone = document.getElementById('pesapalPhone').value;
            
            const isValid = amount && firstName && lastName && email && phone;
            pesapalButton.disabled = !isValid;
        }

        // Initial validation check
        validatePesapalForm();

        // PesaPal payment button handler
        pesapalButton.addEventListener('click', function() {
            if (this.disabled) return;
            
            const amount = document.getElementById('pesapalCustomAmount').value || 
                          document.querySelector('.pesapal-amount.active').dataset.amount;
            const firstName = document.getElementById('pesapalFirstName').value;
            const lastName = document.getElementById('pesapalLastName').value;
            const email = document.getElementById('pesapalEmail').value;
            const phone = document.getElementById('pesapalPhone').value;
            
            initiatePesapalPayment(amount, firstName, lastName, email, phone);
        });

        function initiatePesapalPayment(amount, firstName, lastName, email, phone) {
            // PesaPal API credentials
            const consumerKey = '2wox6FcqZuKDvXKiIY0oay2mDoiDhnPa';
            const consumerSecret = 'u1VQmY/clDp5pz5TqcdlPvKsgxI=';
            
            // Generate a unique reference
            const reference = 'ASFA-' + Date.now();
            
            // Payment details
            const desc = "Donation to ASFA Foundation";
            const callbackUrl = "https://armstretchfoundationafricaltd.org/donate.html";
            
            // Check if Pesapal is loaded
            if (typeof Pesapal === 'undefined') {
                console.error("PesaPal script not loaded!");
                showAlert("Payment service is currently unavailable. Please try again later.", 'danger');
                return;
            }
            
            // Initialize PesaPal
            Pesapal.initialize({
                credentials: {
                    consumer_key: consumerKey,
                    consumer_secret: consumerSecret
                },
                environment: "production"
            });
            
            // Submit the order
            Pesapal.submitOrder({
                params: {
                    Amount: amount,
                    Description: desc,
                    Type: "MERCHANT",
                    Reference: reference,
                    FirstName: firstName,
                    LastName: lastName,
                    Email: email,
                    PhoneNumber: phone,
                    Currency: "USD",
                    CallBackURL: callbackUrl
                },
                onSuccess: function(response) {
                    console.log("PesaPal success:", response);
                    window.location.href = response.redirect_url;
                },
                onError: function(error) {
                    console.error("PesaPal error:", error);
                    showAlert("Error initiating payment. Please try again.", 'danger');
                }
            });
        }
    }

    // Helper function to show alerts
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const container = document.querySelector('.container') || document.body;
        container.prepend(alertDiv);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alertDiv);
            bsAlert.close();
        }, 5000);
    }

    // Initialize PayPal if needed
    if (document.getElementById('paypal-button-container')) {
        loadPayPalSDK().then(initializePayPal).catch(error => {
            console.error('PayPal initialization failed:', error);
            showAlert('Unable to load PayPal payment options. Please try again later.', 'danger');
        });
    }
});

// Load PayPal SDK dynamically
function loadPayPalSDK() {
    return new Promise((resolve, reject) => {
        if (window.paypal) return resolve(); // Already loaded

        const script = document.createElement('script');
        script.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Initialize PayPal buttons
function initializePayPal() {
    if (!window.paypal) {
        throw new Error('PayPal SDK not loaded');
    }

    // One-Time Donation Button
    if (document.getElementById('paypal-onetime-container')) {
        paypal.Buttons({
            style: {
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'donate'
            },
            createOrder: function(data, actions) {
                const amount = document.getElementById('donationAmount').value || '25.00';
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: amount,
                            currency_code: 'USD'
                        },
                        description: 'Donation to ASFA Foundation'
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    showAlert(`Thank you, ${details.payer.name.given_name}! Your donation of $${details.purchase_units[0].amount.value} was processed successfully.`, 'success');
                });
            },
            onError: function(err) {
                console.error('PayPal error:', err);
                showAlert('There was an error processing your donation. Please try again.', 'danger');
            }
        }).render('#paypal-onetime-container');
    }

    // Monthly Donation Button
    if (document.getElementById('paypal-monthly-container')) {
        paypal.Buttons({
            style: {
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'subscribe'
            },
            createSubscription: function(data, actions) {
                const amount = document.getElementById('monthlyAmount').value || '10.00';
                return actions.subscription.create({
                    plan_id: getPlanIdForAmount(amount)
                });
            },
            onApprove: function(data, actions) {
                showAlert('Thank you for your monthly commitment! We\'ve sent a confirmation to your email.', 'success');
            },
            onError: function(err) {
                console.error('PayPal subscription error:', err);
                showAlert('There was an error setting up your monthly donation. Please try again.', 'danger');
            }
        }).render('#paypal-monthly-container');
    }
}

// Helper function to get PayPal plan ID based on amount
function getPlanIdForAmount(amount) {
    // In production, this should be handled server-side
    // This is just a mock implementation
    const plans = {
        '5.00': 'P-5MONTHLY',
        '10.00': 'P-10MONTHLY',
        '25.00': 'P-25MONTHLY',
        '50.00': 'P-50MONTHLY'
    };
    
    return plans[amount] || plans['10.00'];
}
