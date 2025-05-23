document.addEventListener('DOMContentLoaded', function() {
  const togglePassword = document.querySelector('#togglePassword');
  const toggleConfirmPassword = document.querySelector('#toggleConfirmPassword');
  const password = document.querySelector('#password');
  const confirmPassword = document.querySelector('#confirm-password');
  
  togglePassword.addEventListener('click', function() {
    // Toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // Toggle the eye icon
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
  });
  
  toggleConfirmPassword.addEventListener('click', function() {
    // Toggle the type attribute
    const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPassword.setAttribute('type', type);
    // Toggle the eye icon
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
  });
});



document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.signup-card form');

  function setError(input, message) {
    const errorDiv = input.nextElementSibling;
    errorDiv.textContent = message;
    input.classList.add('is-invalid');
  }

  function clearError(input) {
    const errorDiv = input.nextElementSibling;
    errorDiv.textContent = '';
    input.classList.remove('is-invalid');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    let isValid = true;

    [nameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput].forEach(clearError);

    if (name === '') {
      setError(nameInput, 'Full Name is required.');
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
      setError(emailInput, 'Email is required.');
      isValid = false;
    } else if (!emailPattern.test(email)) {
      setError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    }

    const phonePattern = /^(\+92|0)3\d{9}$/;
    if (phone === '') {
      setError(phoneInput, 'Phone number is required.');
      isValid = false;
    } else if (!phonePattern.test(phone)) {
      setError(phoneInput, 'Enter a valid Pakistani phone number.');
      isValid = false;
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (password === '') {
      setError(passwordInput, 'Password is required.');
      isValid = false;
    } else if (!passwordPattern.test(password)) {
      setError(passwordInput, 'Password must have 8 characters, an uppercase, a digit & a special character.');
      isValid = false;
    }

    if (confirmPassword === '') {
      setError(confirmPasswordInput, 'Please confirm your password.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setError(confirmPasswordInput, 'Passwords do not match.');
      isValid = false;
    }

    if (isValid) {
      const data = { name, email, phone, password };

      fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(result => {
          if (result.message.includes("OTP")) {
            alert('Registration successful! Please check your email for OTP.');

            // Show OTP Input
          const otpFormHtml = `
<div class="otp-verify-container">
  <div class="otp-focus-box text-center">
    <h4 class="mb-4">SECURITY VERIFICATION</h4>
    <div class="mb-4">
      <input type="text" 
             class="form-control otp-input text-center" 
             id="otp" 
             placeholder="• • • • • •" 
             maxlength="6"
             autocomplete="off"
             autofocus>
      <div class="error-message text-danger small mt-2"></div>
    </div>
    <button type="submit" 
            class="btn btn-custom w-100 py-2" 
            id="verify-otp-btn">
      VERIFY NOW
    </button>
    <div class="text-muted mt-3 small">
      <i class="fas fa-lock"></i> Code sent to your registered email
    </div>
  </div>
</div>

<style>
.otp-verify-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  padding: 20px;
}

.otp-focus-box {
  max-width: 350px;
  width: 100%;
  padding: 30px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.otp-input {
  font-size: 24px;
  letter-spacing: 10px;
  padding: 12px;
  font-weight: bold;
  border: 2px solid #e0e0e0;
}

.otp-input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
}

#verify-otp-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
}
</style>
            `;
            document.querySelector('.signup-card').innerHTML = otpFormHtml;

            // Handle OTP Submit
            document.getElementById('verify-otp-btn').addEventListener('click', function (e) {
              e.preventDefault();
              const otp = document.getElementById('otp').value.trim();
              console.log(otp);

              if (otp === '') {
                alert('Please enter the OTP.');
                return;
              }

              fetch('http://localhost:3000/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
              })
                .then(res => res.json())
                .then(result => {
                  if (result.success) {
                    alert('OTP verified successfully! You are now verified.');
                    window.location.href = 'login.html';
                  } else {
                    alert(result.message);
                  }
                })
                .catch(error => {
                  console.error('Error:', error);
                  alert('Error verifying OTP. Please try again.');
                });
            });
          }
        })
        .catch(error => console.error('Error:', error));
    }
  });
  // Google Sign Up
document.querySelector('.google-btn').addEventListener('click', function (e) {
  e.preventDefault();

  // Create a Google provider instance
  const provider = new firebase.auth.GoogleAuthProvider();

  // Sign in with a popup
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      alert("Signed in successfully as: " + user.displayName);

      // Optional: redirect to another page
      // window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.error("Error during Google sign-in:", error.message);
      alert("Google Sign-In failed: " + error.message);
    });
});

});