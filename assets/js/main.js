const progress = document.getElementById('progress');

window.addEventListener('scroll', () => {
  const documentElement = document.documentElement;
  const maximumScroll = documentElement.scrollHeight - documentElement.clientHeight;
  progress.style.width = `${maximumScroll ? (documentElement.scrollTop / maximumScroll) * 100 : 0}%`;
});

const revealObserver = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  }),
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const toast = document.getElementById('toast');
let toastTimer;

function showToast(text) {
  clearTimeout(toastTimer);
  toast.textContent = text;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
}

// Cuộn đến đúng vị trí, chừa khoảng cách dưới thanh menu cố định.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 0;
    const extraSpacing = window.innerWidth <= 600 ? 18 : 26;
    const targetTop = targetId === '#top'
      ? 0
      : target.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraSpacing;

    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
    history.pushState(null, '', targetId);
  });
});


// Bắt buộc số điện thoại Việt Nam đủ 10 chữ số, bắt đầu bằng số 0.
const phoneInput = document.getElementById('phoneInput');
const phoneError = document.getElementById('phoneError');

function validatePhone(showMessage = true) {
  if (!phoneInput) return true;

  // Chỉ giữ lại chữ số và không cho nhập quá 10 số.
  const digits = phoneInput.value.replace(/\D/g, '').slice(0, 10);
  if (phoneInput.value !== digits) phoneInput.value = digits;

  const isValid = /^0\d{9}$/.test(digits);
  const shouldShowError = showMessage && digits.length > 0 && !isValid;

  if (isValid || digits.length === 0) {
    phoneInput.setCustomValidity(digits.length === 0 ? 'Vui lòng nhập số điện thoại.' : '');
  } else {
    phoneInput.setCustomValidity('Số điện thoại phải đủ 10 chữ số và bắt đầu bằng số 0.');
  }

  phoneInput.classList.toggle('is-invalid', shouldShowError);
  if (phoneError) {
    phoneError.textContent = shouldShowError
      ? 'Số điện thoại phải đủ 10 chữ số và bắt đầu bằng số 0.'
      : '';
  }

  return isValid;
}

if (phoneInput) {
  phoneInput.addEventListener('input', () => validatePhone(phoneInput.value.length >= 10));
  phoneInput.addEventListener('blur', () => validatePhone(true));
  phoneInput.addEventListener('invalid', () => validatePhone(true));
}

// Gửi dữ liệu trực tiếp vào Google Form bằng đúng mã Entry.
const leadForm = document.getElementById('leadForm');
const googleFormTarget = document.getElementById('googleFormTarget');
const submitButton = leadForm?.querySelector('button[type="submit"]');
const submitButtonDefault = submitButton?.innerHTML || '';
let formIsSubmitting = false;
let submissionFallbackTimer;

function finishFormSubmission() {
  if (!formIsSubmitting) return;
  formIsSubmitting = false;
  clearTimeout(submissionFallbackTimer);
  leadForm.reset();
  phoneInput?.classList.remove('is-invalid');
  if (phoneError) phoneError.textContent = '';
  submitButton.disabled = false;
  submitButton.innerHTML = submitButtonDefault;
  showToast("Gửi thông tin thành công! Đội ngũ Le'Kati sẽ liên hệ tư vấn sớm.");
}

if (leadForm && googleFormTarget && submitButton) {
  leadForm.addEventListener('submit', event => {
    if (!validatePhone(true)) {
      event.preventDefault();
      phoneInput?.focus();
      phoneInput?.reportValidity();
      return;
    }

    formIsSubmitting = true;
    submitButton.disabled = true;
    submitButton.innerHTML = 'Đang gửi thông tin…';
    showToast('Đang ghi nhận thông tin của bạn…');

    // Dự phòng trong trường hợp trình duyệt không phát sự kiện load cho iframe ẩn.
    submissionFallbackTimer = setTimeout(finishFormSubmission, 7000);
  });

  googleFormTarget.addEventListener('load', finishFormSubmission);
}


// Hiện nút mũi tên khi người dùng đã cuộn xuống và đưa về đầu trang khi bấm.
const backToTopButton = document.querySelector('.km-fab-top');

function updateBackToTopVisibility() {
  if (!backToTopButton) return;
  backToTopButton.classList.toggle('is-visible', window.scrollY > 420);
}

window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });
updateBackToTopVisibility();
