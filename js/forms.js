/* ==========================================================
   FORMS.JS — Contact Form Validation & UX
   Brockton Mold Experts
   ========================================================== */

(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var successEl = document.getElementById('form-success');
  var submitBtn = document.getElementById('contact-submit');

  /* --------------------------------------------------------
     VALIDATION RULES
     -------------------------------------------------------- */
  var fields = {
    'contact-name': {
      required: true,
      errorId: 'name-error',
      validate: function (val) { return val.trim().length >= 2; },
      message: 'Please enter your name.'
    },
    'contact-email': {
      required: true,
      errorId: 'email-error',
      validate: function (val) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
      },
      message: 'Please enter a valid email address.'
    },
    'contact-phone': {
      required: false,
      errorId: 'phone-error',
      validate: function (val) {
        if (!val.trim()) return true;
        return /^[\d\s\-\(\)\+\.]{7,20}$/.test(val.trim());
      },
      message: 'Please enter a valid phone number.'
    },
    'contact-service': {
      required: true,
      errorId: 'service-error',
      validate: function (val) { return val !== ''; },
      message: 'Please select a service.'
    },
    'contact-message': {
      required: true,
      errorId: 'message-error',
      validate: function (val) { return val.trim().length >= 10; },
      message: 'Please describe your situation (at least 10 characters).'
    }
  };

  /* --------------------------------------------------------
     VALIDATE SINGLE FIELD
     -------------------------------------------------------- */
  function validateField(fieldId) {
    var input = document.getElementById(fieldId);
    var config = fields[fieldId];
    if (!input || !config) return true;

    var value = input.value;
    var group = input.closest('.form-group');
    var errorEl = document.getElementById(config.errorId);
    var isValid = config.validate(value);

    if (!isValid && (config.required || value.trim() !== '')) {
      group.classList.add('has-error');
      if (errorEl) {
        errorEl.textContent = config.message;
        errorEl.style.display = 'block';
      }
      input.setAttribute('aria-invalid', 'true');
      return false;
    } else {
      group.classList.remove('has-error');
      if (errorEl) {
        errorEl.style.display = 'none';
      }
      input.removeAttribute('aria-invalid');
      return true;
    }
  }

  /* --------------------------------------------------------
     REAL-TIME VALIDATION — On blur
     -------------------------------------------------------- */
  Object.keys(fields).forEach(function (fieldId) {
    var input = document.getElementById(fieldId);
    if (!input) return;

    input.addEventListener('blur', function () {
      validateField(fieldId);
    });

    // Clear error on input
    input.addEventListener('input', function () {
      var group = this.closest('.form-group');
      if (group.classList.contains('has-error')) {
        validateField(fieldId);
      }
    });
  });

  /* --------------------------------------------------------
     PHONE FORMATTING
     -------------------------------------------------------- */
  var phoneInput = document.getElementById('contact-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      var value = this.value.replace(/\D/g, '');
      if (value.length >= 10) {
        this.value = '(' + value.slice(0, 3) + ') ' + value.slice(3, 6) + '-' + value.slice(6, 10);
      } else if (value.length >= 6) {
        this.value = '(' + value.slice(0, 3) + ') ' + value.slice(3, 6) + '-' + value.slice(6);
      } else if (value.length >= 3) {
        this.value = '(' + value.slice(0, 3) + ') ' + value.slice(3);
      }
    });
  }

  /* --------------------------------------------------------
     FORM SUBMISSION
     -------------------------------------------------------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validate all fields
    var allValid = true;
    var firstInvalid = null;

    Object.keys(fields).forEach(function (fieldId) {
      var isValid = validateField(fieldId);
      if (!isValid && allValid) {
        allValid = false;
        firstInvalid = document.getElementById(fieldId);
      }
    });

    if (!allValid) {
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Simulate submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="animate-spin" style="display:inline-block;width:18px;height:18px;border:2px solid rgba(255,255,255,0.3);border-top-color:white;border-radius:50%;"></span> Sending...';

    setTimeout(function () {
      form.style.display = 'none';
      successEl.classList.add('active');

      // Re-init lucide icons for the success checkmark
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, 1500);
  });

})();
