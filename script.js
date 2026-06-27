const dobInput = document.getElementById('dob');
const refInput = document.getElementById('ref');
const calcBtn  = document.getElementById('calc-btn');
const result   = document.getElementById('result');
const dobError = document.getElementById('dob-error');
const refError = document.getElementById('ref-error');

// Default the reference date to today
const today = new Date();
const pad = n => String(n).padStart(2, '0');
refInput.value = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

function calcAge(dob, ref) {
  let years  = ref.getFullYear()  - dob.getFullYear();
  let months = ref.getMonth()     - dob.getMonth();
  let days   = ref.getDate()      - dob.getDate();

  if (days < 0) {
    months--;
    // Number of days in the month before the reference month
    const prevMonthDays = new Date(ref.getFullYear(), ref.getMonth(), 0).getDate();
    days += prevMonthDays;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

function plural(n, word) {
  return `${n} ${word}${n !== 1 ? 's' : ''}`;
}

function clearErrors() {
  dobInput.classList.remove('has-error');
  refInput.classList.remove('has-error');
  dobError.classList.remove('visible');
  refError.classList.remove('visible');
}

function validate() {
  clearErrors();
  let valid = true;

  if (!dobInput.value) {
    dobInput.classList.add('has-error');
    dobError.classList.add('visible');
    valid = false;
  }

  if (!refInput.value) {
    refInput.classList.add('has-error');
    refError.textContent = 'Please enter a reference date.';
    refError.classList.add('visible');
    valid = false;
  }

  if (valid) {
    const dob = new Date(dobInput.value + 'T00:00:00');
    const ref = new Date(refInput.value + 'T00:00:00');
    if (ref < dob) {
      refInput.classList.add('has-error');
      refError.textContent = 'Reference date must be on or after the date of birth.';
      refError.classList.add('visible');
      valid = false;
    }
  }

  return valid;
}

calcBtn.addEventListener('click', () => {
  if (!validate()) return;

  const dob = new Date(dobInput.value + 'T00:00:00');
  const ref = new Date(refInput.value + 'T00:00:00');
  const { years, months, days } = calcAge(dob, ref);

  document.getElementById('r-years').textContent  = years;
  document.getElementById('r-months').textContent = months;
  document.getElementById('r-days').textContent   = days;

  const parts = [];
  if (years  > 0) parts.push(plural(years,  'year'));
  if (months > 0) parts.push(plural(months, 'month'));
  if (days   > 0) parts.push(plural(days,   'day'));

  const summary = document.getElementById('r-summary');
  if (parts.length === 0) {
    summary.innerHTML = 'The two dates are the <strong>same day</strong>.';
  } else {
    const joined = parts.length > 1
      ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1]
      : parts[0];
    summary.innerHTML = `That\u2019s exactly <strong>${joined}</strong> old.`;
  }

  // Re-trigger animation
  result.classList.remove('visible');
  void result.offsetWidth;
  result.classList.add('visible');
});

dobInput.addEventListener('change', () => {
  dobInput.classList.remove('has-error');
  dobError.classList.remove('visible');
});

refInput.addEventListener('change', () => {
  refInput.classList.remove('has-error');
  refError.classList.remove('visible');
});
