// ===========================
// KISANMART – SCRIPT.JS
// Complete JavaScript Logic
// ===========================

// ---- NAVBAR TOGGLE ----
function toggleMenu() {
  const nav = document.querySelector('.nav-links');
  if (nav) nav.classList.toggle('open');
}

// ---- SURVEY SUBMIT ----
function submitSurvey() {
  const selects = document.querySelectorAll('.survey-box select');
  let allFilled = true;
  selects.forEach(s => { if (!s.value) allFilled = false; });
  if (!allFilled) {
    alert('⚠️ Please answer all survey questions before submitting.');
    return;
  }
  alert('✅ Thank you for completing the survey!\nYour response helps us serve you better. 🌾');
}

// ---- PRODUCT FILTER ----
function filterProducts() {
  const cat = document.getElementById('catFilter')?.value || 'all';
  const price = document.getElementById('priceFilter')?.value || 'all';
  const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const cards = document.querySelectorAll('#productGrid .product-card');
  cards.forEach(card => {
    const cardCat = card.dataset.cat || '';
    const cardPrice = card.dataset.price || '';
    const text = card.innerText.toLowerCase();
    const catMatch = cat === 'all' || cardCat === cat;
    const priceMatch = price === 'all' || cardPrice === price;
    const searchMatch = !search || text.includes(search);
    card.style.display = (catMatch && priceMatch && searchMatch) ? '' : 'none';
  });
}

// ---- BOOKING STEPS ----
const equipmentData = {
  Tractor: [
    { name: 'Mahindra 575 DI', buyPrice: 850000, rentPrice: 2500 },
    { name: 'Swaraj 744 FE', buyPrice: 720000, rentPrice: 2200 },
    { name: 'John Deere 5050 D', buyPrice: 950000, rentPrice: 3000 },
    { name: 'Sonalika DI 60 RX', buyPrice: 780000, rentPrice: 2400 },
  ],
  Irrigation: [
    { name: 'Drip Irrigation Kit (1 Acre)', buyPrice: 15000, rentPrice: 500 },
    { name: 'Sprinkler System Set', buyPrice: 22000, rentPrice: 700 },
    { name: 'Water Pump 5 HP', buyPrice: 8500, rentPrice: 400 },
  ],
  Harvester: [
    { name: 'Combine Harvester Mini', buyPrice: 1200000, rentPrice: 5000 },
    { name: 'Reaper Binder Machine', buyPrice: 180000, rentPrice: 1200 },
  ],
  Drone: [
    { name: 'Agri Spray Drone X10', buyPrice: 450000, rentPrice: 3000 },
    { name: 'Survey Mapping Drone', buyPrice: 280000, rentPrice: 2000 },
  ],
  Tools: [
    { name: 'Farmer Tool Kit (15 pcs)', buyPrice: 2500, rentPrice: 0 },
    { name: 'Battery Operated Sprayer', buyPrice: 3800, rentPrice: 200 },
  ],
  Seeds: [
    { name: 'Hybrid Paddy Seeds (5 kg)', buyPrice: 1200, rentPrice: 0 },
    { name: 'NPK Bio Fertilizer (50 kg)', buyPrice: 950, rentPrice: 0 },
  ],
};

function goToStep(step) {
  // Validate before moving forward
  if (step === 2 && !validateStep1()) return;
  if (step === 3 && !validateStep2()) return;
  if (step === 4 && !validateStep3()) return;

  document.querySelectorAll('.booking-step').forEach(s => s.classList.add('hidden'));
  document.getElementById('step' + step)?.classList.remove('hidden');

  // Update progress indicators
  for (let i = 1; i <= 4; i++) {
    const ind = document.getElementById('step' + i + '-indicator');
    if (!ind) continue;
    ind.classList.remove('active', 'done');
    if (i < step) ind.classList.add('done');
    if (i === step) ind.classList.add('active');
  }

  // Update summary
  updateSummary();

  // Scroll to top of booking
  window.scrollTo({ top: 200, behavior: 'smooth' });
}

function validateStep1() {
  const name = document.getElementById('fullName')?.value.trim();
  const mobile = document.getElementById('mobile')?.value.trim();
  const aadhaar = document.getElementById('aadhaar')?.value.trim();
  const farmType = document.getElementById('farmType')?.value;
  if (!name) { alert('⚠️ Please enter your full name.'); return false; }
  if (!mobile || mobile.length !== 10) { alert('⚠️ Please enter a valid 10-digit mobile number.'); return false; }
  if (!aadhaar || aadhaar.length !== 12) { alert('⚠️ Please enter a valid 12-digit Aadhaar number.'); return false; }
  if (!farmType) { alert('⚠️ Please select your farming type.'); return false; }
  return true;
}

function validateStep2() {
  const cat = document.getElementById('equipCat')?.value;
  const name = document.getElementById('equipName')?.value;
  const type = document.getElementById('bookType')?.value;
  if (!cat) { alert('⚠️ Please select an equipment category.'); return false; }
  if (!name) { alert('⚠️ Please select a specific equipment.'); return false; }
  if (!type) { alert('⚠️ Please select booking type (Purchase or Rent).'); return false; }
  return true;
}

function validateStep3() {
  const addr = document.getElementById('address')?.value.trim();
  const district = document.getElementById('district')?.value.trim();
  const state = document.getElementById('state')?.value;
  const pin = document.getElementById('pin')?.value.trim();
  const date = document.getElementById('deliveryDate')?.value;
  if (!addr) { alert('⚠️ Please enter your delivery address.'); return false; }
  if (!district) { alert('⚠️ Please enter your district.'); return false; }
  if (!state) { alert('⚠️ Please select your state.'); return false; }
  if (!pin || pin.length !== 6) { alert('⚠️ Please enter a valid 6-digit PIN code.'); return false; }
  if (!date) { alert('⚠️ Please select a preferred delivery date.'); return false; }
  return true;
}

function updateEquipment() {
  const cat = document.getElementById('equipCat')?.value;
  const nameEl = document.getElementById('equipName');
  if (!nameEl) return;
  nameEl.innerHTML = '<option value="">Select equipment...</option>';
  if (cat && equipmentData[cat]) {
    equipmentData[cat].forEach(item => {
      nameEl.innerHTML += `<option value="${item.name}">${item.name}</option>`;
    });
  }
  document.getElementById('priceDisplay').textContent = '₹ — select equipment';
}

function updatePrice() {
  const cat = document.getElementById('equipCat')?.value;
  const name = document.getElementById('equipName')?.value;
  const type = document.getElementById('bookType')?.value;
  const days = parseInt(document.getElementById('rentalDays')?.value) || 1;
  const qty = parseInt(document.getElementById('quantity')?.value) || 1;
  const display = document.getElementById('priceDisplay');
  if (!cat || !name || !type) { if (display) display.textContent = '₹ — select equipment'; return; }
  const equip = equipmentData[cat]?.find(e => e.name === name);
  if (!equip) return;
  let price;
  if (type === 'purchase') price = equip.buyPrice * qty;
  else price = equip.rentPrice * days * qty;
  if (display) display.textContent = '₹' + price.toLocaleString('en-IN');
  updateSummary();
}

function updateBookingType() {
  const type = document.getElementById('bookType')?.value;
  const daysGroup = document.getElementById('daysGroup');
  if (daysGroup) daysGroup.style.display = type === 'rent' ? '' : 'none';
  updatePrice();
}

function updateSummary() {
  const name = document.getElementById('equipName')?.value || '—';
  const type = document.getElementById('bookType')?.value || '—';
  const qty = document.getElementById('quantity')?.value || '1';
  const priceText = document.getElementById('priceDisplay')?.textContent || '—';

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('s-equip', name);
  setEl('s-type', type === 'purchase' ? 'Purchase' : type === 'rent' ? 'Rental' : '—');
  setEl('s-qty', qty);

  if (priceText && priceText.startsWith('₹')) {
    const raw = parseInt(priceText.replace(/[₹,\s]/g, '')) || 0;
    const gst = Math.round(raw * 0.05);
    const total = raw + gst;
    setEl('s-gst', '₹' + gst.toLocaleString('en-IN'));
    setEl('s-total', '₹' + total.toLocaleString('en-IN'));
  }
}

function selectPayment(method) {
  document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
  document.querySelectorAll('.payment-detail-box').forEach(b => b.classList.add('hidden'));
  event?.currentTarget?.classList.add('selected');
  const map = { upi: 'upi-details', card: 'card-details', netbanking: 'netbanking-details' };
  if (map[method]) document.getElementById(map[method])?.classList.remove('hidden');
}

function formatCard(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}

function placeOrder() {
  const paymentSelected = document.querySelector('input[name="payment"]:checked');
  if (!paymentSelected) { alert('⚠️ Please select a payment method.'); return; }

  // Gather data
  const name = document.getElementById('fullName')?.value || '';
  const equip = document.getElementById('equipName')?.value || '';
  const deliveryDate = document.getElementById('deliveryDate')?.value || '';
  const addr = document.getElementById('address')?.value || '';
  const district = document.getElementById('district')?.value || '';
  const state = document.getElementById('state')?.value || '';
  const totalText = document.getElementById('s-total')?.textContent || '—';
  const bookingId = 'KM' + Date.now().toString().slice(-8);

  // Fill receipt
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('r-id', bookingId);
  setEl('r-name', name);
  setEl('r-equip', equip);
  setEl('r-date', deliveryDate);
  setEl('r-addr', `${addr}, ${district}, ${state}`);
  setEl('r-pay', paymentSelected.value.toUpperCase());
  setEl('r-total', totalText);

  // Show popup
  document.getElementById('successPopup')?.classList.remove('hidden');

  // Confetti effect
  launchConfetti();
}

function launchConfetti() {
  const colors = ['#2d6a4f', '#52b788', '#e9c46a', '#f4a261', '#e76f51'];
  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position:fixed;
      width:${Math.random() * 10 + 5}px;
      height:${Math.random() * 10 + 5}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      left:${Math.random() * 100}vw;
      top:-20px;
      z-index:99999;
      border-radius:${Math.random() > 0.5 ? '50%' : '0'};
      animation:confettiFall ${Math.random() * 2 + 1.5}s linear forwards;
      animation-delay:${Math.random() * 1}s;
    `;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
  }
  if (!document.getElementById('confettiCSS')) {
    const style = document.createElement('style');
    style.id = 'confettiCSS';
    style.textContent = `
      @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

function printReceipt() {
  const receiptEl = document.getElementById('receiptBox');
  if (!receiptEl) return;
  const w = window.open('', '_blank');
  w.document.write(`
    <html><head><title>KisanMart Receipt</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 2rem; max-width: 500px; margin: auto; }
      h2 { color: #1b4332; text-align: center; }
      .line { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee; }
      .total { font-weight: bold; font-size: 1.1rem; }
    </style>
    </head><body>
    <h2>🌾 KisanMart – Booking Receipt</h2>
    ${receiptEl.innerHTML}
    <p style="text-align:center;color:gray;margin-top:2rem">Thank you for choosing KisanMart! 🌱</p>
    </body></html>
  `);
  w.print();
}

// ===== AUTH PAGE =====
function showTab(tab) {
  document.getElementById('loginForm')?.classList.add('hidden');
  document.getElementById('signupForm')?.classList.add('hidden');
  document.getElementById('otpSection')?.classList.add('hidden');
  document.getElementById(tab + 'Form')?.classList.remove('hidden');
  document.getElementById('loginTab')?.classList.toggle('active', tab === 'login');
  document.getElementById('signupTab')?.classList.toggle('active', tab === 'signup');
}

function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
  else { input.type = 'password'; btn.textContent = '👁'; }
}

function handleLogin() {
  const mobile = document.getElementById('loginMobile')?.value.trim();
  const pass = document.getElementById('loginPassword')?.value;
  if (!mobile || mobile.length !== 10) { alert('⚠️ Enter a valid 10-digit mobile number.'); return; }
  if (!pass || pass.length < 4) { alert('⚠️ Please enter your password.'); return; }
  // DEMO: Accept any login
  alert(`✅ Login Successful!\nWelcome back to KisanMart 🌾\n\n(In production: verifies with MongoDB)`);
  window.location.href = 'index.html';
}

function handleSignup() {
  const first = document.getElementById('regFirstName')?.value.trim();
  const last = document.getElementById('regLastName')?.value.trim();
  const mobile = document.getElementById('regMobile')?.value.trim();
  const pass = document.getElementById('regPassword')?.value;
  const confirm = document.getElementById('regConfirm')?.value;
  const agreed = document.getElementById('agreeTerms')?.checked;
  if (!first || !last) { alert('⚠️ Please enter your full name.'); return; }
  if (!mobile || mobile.length !== 10) { alert('⚠️ Enter valid 10-digit mobile.'); return; }
  if (!pass || pass.length < 8) { alert('⚠️ Password must be at least 8 characters.'); return; }
  if (pass !== confirm) { alert('⚠️ Passwords do not match.'); return; }
  if (!agreed) { alert('⚠️ Please agree to Terms & Conditions.'); return; }
  alert(`✅ Account Created Successfully!\nWelcome to KisanMart, ${first}! 🌾\n\n(In production: saves to MongoDB)`);
  window.location.href = 'index.html';
}

function sendOTP() {
  const mobile = document.getElementById('loginMobile')?.value.trim();
  if (!mobile || mobile.length !== 10) { alert('⚠️ Enter your 10-digit mobile number first.'); return; }
  document.getElementById('loginForm')?.classList.add('hidden');
  document.getElementById('otpSection')?.classList.remove('hidden');
  alert(`📱 OTP sent to ${mobile}\nDemo OTP: 123456`);
}

function verifyOTP() {
  const boxes = document.querySelectorAll('.otp-box');
  const otp = Array.from(boxes).map(b => b.value).join('');
  if (otp === '123456') {
    alert('✅ OTP Verified! Login Successful.\nWelcome to KisanMart 🌾');
    window.location.href = 'index.html';
  } else {
    alert('❌ Incorrect OTP. Please try again.\nDemo OTP is: 123456');
  }
}

function otpMove(input, idx) {
  if (input.value.length === 1 && idx < 6) {
    const next = document.querySelectorAll('.otp-box')[idx];
    if (next) next.focus();
  }
}

function backToLogin() {
  document.getElementById('otpSection')?.classList.add('hidden');
  document.getElementById('loginForm')?.classList.remove('hidden');
}

// ===== WISHLIST TOGGLE =====
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('btn-wish')) {
    const btn = e.target;
    if (btn.textContent.includes('♡')) {
      btn.textContent = '♥ Saved';
      btn.style.color = '#e76f51';
      btn.style.borderColor = '#e76f51';
    } else {
      btn.textContent = '♡ Wishlist';
      btn.style.color = '';
      btn.style.borderColor = '';
    }
  }
});

// Set min delivery date to today
window.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('deliveryDate');
  if (dateInput) {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    dateInput.min = today.toISOString().split('T')[0];
  }
});
