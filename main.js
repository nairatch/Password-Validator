const passwordInput = document.querySelector("#passwordInput");
const validators = document.querySelectorAll("span.validator");
const actionBtns = document.querySelectorAll("span[data-action]");
const generatePasswordBtn = document.querySelector("#generatePassword");
const progressBar = document.querySelector("#passwordProgress");

const eyeIcons = {
  open: '<i class="bi bi-eye"></i>',
  closed: '<i class="bi bi-eye-slash"></i>',
};

const validatorIcons = {
  default: '<i class="bi bi-circle-fill"></i>',
  valid: '<i class="bi bi-check-lg"></i>',
  invalid: '<i class="bi bi-x-lg"></i>',
};

actionBtns.forEach((button) => {
  button.addEventListener("click", function () {
    const action = this.getAttribute("data-action");
    switch (action) {
      case "eye": {
        toggleEye(button);
        break;
      }
      case "clear": {
        clear();
        break;
      }
      default: {
        displayAlert("Incorrect action", "Error", `Cannot find action (${action})`);
        break;
      }
    }
  });
});

generatePasswordBtn.addEventListener("click", generatePassword);

passwordInput.addEventListener("keyup", function () {
  const password = this.value.trim();
  this.value = password;
  validatePassword(password);
});

function getValidatorIcon(isValid) {
  return isValid ? validatorIcons.valid : validatorIcons.invalid;
}

function displayAlert(title, icon, text = "") {
  Swal.fire({ title, icon, text });
}

function clear() {
  passwordInput.value = "";
  validators.forEach((validator) => {
    validator.innerHTML = validatorIcons.default;
  });
  updateProgressBar(0);
}

function toggleEye(button) {
  const isOpen = passwordInput.type !== "password";
  passwordInput.type = isOpen ? "password" : "text";
  button.innerHTML = isOpen ? eyeIcons.open : eyeIcons.closed;
}

function validatePassword(password) {
  if (password === "") {
    validators.forEach((validator) => {
      validator.innerHTML = validatorIcons.default;
    });
    updateProgressBar(0);
    return;
  }

  const validations = [
    password.length >= 8,
    password.length <= 22,
    /\w/.test(password),
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[!@#$%]/.test(password),
  ];

  validators.forEach((validator, index) => {
    validator.innerHTML = getValidatorIcon(validations[index]);
  });

  const validCount = validations.filter(Boolean).length;
  updateProgressBar((validCount / validations.length) * 100);
}

function updateProgressBar(value) {
  progressBar.style.width = `${value}%`;
  progressBar.setAttribute("aria-valuenow", value);
}

function generatePassword() {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  passwordInput.value = password;
  validatePassword(password);
}