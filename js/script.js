// Animate progress bar with smoother animation and better practices
function animateProgressBar() {
  const progressBar = document.querySelector('.progress-bar');
  if (!progressBar) return; // Exit if no progress bar found
  
  const targetWidth = parseInt(progressBar.getAttribute('aria-valuenow'));
  const animationDuration = 1000; // 1 second duration
  const startTime = performance.now();
  
  function updateProgress(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);
      const currentWidth = Math.floor(progress * targetWidth);
      
      progressBar.style.width = `${currentWidth}%`;
      progressBar.textContent = `${currentWidth}%`;
      
      if (progress < 1) {
          requestAnimationFrame(updateProgress);
      }
  }
  
  requestAnimationFrame(updateProgress);
}

// Trigger on page load with check for reduced motion preference
window.addEventListener('load', () => {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animateProgressBar();
  } else {
      // For users who prefer reduced motion, set immediately
      const progressBar = document.querySelector('.progress-bar');
      if (progressBar) {
          const targetWidth = progressBar.getAttribute('aria-valuenow');
          progressBar.style.width = `${targetWidth}%`;
          progressBar.textContent = `${targetWidth}%`;
      }
  }
});

// Newsletter Form Submission with basic validation
document.querySelector('.newsletter-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const emailInput = this.querySelector('input[type="email"]');
  const email = emailInput.value.trim();
  
  // Basic email validation
  if (!email || !email.includes('@')) {
      emailInput.classList.add('error');
      emailInput.setAttribute('aria-invalid', 'true');
      return;
  }
  
  // Remove any error state
  emailInput.classList.remove('error');
  emailInput.setAttribute('aria-invalid', 'false');
  
  // Show success message (consider replacing alert with a proper UI message)
  alert(`Thank you for subscribing with ${email}! We'll keep you updated.`);
  
  // Reset form
  this.reset();
  
  // Focus management for better accessibility
  emailInput.focus();
});



// Scripts
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"></script>
<script>
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // PesaPal integration
    document.addEventListener('DOMContentLoaded', function() {
        // Enable button by default
        const pesapalButton = document.getElementById('pesapal-payment-button');
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
            alert("Payment service is currently unavailable. Please try again later.");
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
                alert("Error initiating payment. Please try again.");
            }
        });
    }

    // Rest of your existing PayPal and callback code...
</script>
