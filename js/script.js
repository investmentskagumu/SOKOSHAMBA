/* =========================
   Page Fade Transition
========================= */

document.addEventListener("DOMContentLoaded", () => {
    document.body.style.opacity = 0;
    document.body.style.transition = "opacity 0.5s ease";
    setTimeout(() => {
        document.body.style.opacity = 1;
    }, 100);
});


/* =========================
   Card Scroll Animation
========================= */

const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.transform = "translateY(0)";
            entry.target.style.opacity = "1";
        }
    });
}, { threshold: 0.1 });

cards.forEach(card => {
    card.style.transform = "translateY(20px)";
    card.style.opacity = "0";
    card.style.transition = "all 0.6s ease";
    observer.observe(card);
});


/* =========================
   Market Price Filter
========================= */

const regionFilter = document.querySelector("#regionFilter");
const produceFilter = document.querySelector("#produceFilter");
const tableRows = document.querySelectorAll("table tr");

function filterTable() {
    const regionValue = regionFilter ? regionFilter.value.toLowerCase() : "";
    const produceValue = produceFilter ? produceFilter.value.toLowerCase() : "";

    tableRows.forEach((row, index) => {
        if (index === 0) return; // skip header

        const cells = row.getElementsByTagName("td");
        if (!cells.length) return;

        const produce = cells[0].innerText.toLowerCase();
        const region = cells[1].innerText.toLowerCase();

        const matchRegion = regionValue === "all" || region.includes(regionValue);
        const matchProduce = produceValue === "all" || produce.includes(produceValue);

        row.style.display = (matchRegion && matchProduce) ? "" : "none";
    });
}

if (regionFilter) regionFilter.addEventListener("change", filterTable);
if (produceFilter) produceFilter.addEventListener("change", filterTable);


/* =========================
   Search Button Redirect
========================= */

const searchButton = document.querySelector(".cta-btn");

if (searchButton) {
    searchButton.addEventListener("click", () => {
        window.location.href = "market-prices.html";
    });
}


/* =========================
   Dashboard Tab Switch
========================= */

function showTab(tabId) {
    const sections = document.querySelectorAll(".dashboard-section");
    sections.forEach(section => {
        section.style.display = "none";
    });

    document.getElementById(tabId).style.display = "block";
}


/* =========================
   Simple Modal Popup
========================= */

function openModal(message) {
    alert(message);
}


/* =========================
   Smooth Button Hover Effect
========================= */

const buttons = document.querySelectorAll(".cta-btn");

buttons.forEach(btn => {
    btn.addEventListener("mouseenter", () => {
        btn.style.transform = "scale(1.05)";
        btn.style.transition = "0.2s ease";
    });

    btn.addEventListener("mouseleave", () => {
        btn.style.transform = "scale(1)";
    });
});

/* =========================
CRUD OPERATION
========================= */
// Add Produce
async function addProduce(name, quantity, price) {
  const user = await getUser();
  const { data, error } = await supabase.from('produce').insert([
    { name, quantity, price, farmer_id: user.id }
  ]);
  if(error) console.error(error);
  else console.log("Produce added:", data);
}

// Fetch Farmer Produce
async function fetchFarmerProduce() {
  const user = await getUser();
  const { data, error } = await supabase.from('produce').select('*').eq('farmer_id', user.id);
  console.log("My produce:", data);
}

/* =========================
BUYER DASHBOARD
========================= */
// Fetch all produce
async function fetchAllProduce() {
  const { data, error } = await supabase.from('produce').select('*, farmer_id(*)');
  console.log("Produce list:", data);
}

// Place order
async function placeOrder(produce_id, quantity) {
  const user = await getUser();
  const { data, error } = await supabase.from('orders').insert([
    { produce_id, buyer_id: user.id, quantity, status: 'pending' }
  ]);
  console.log("Order placed:", data);
}


/* =========================/*
Inputs Marketplace
=========================*/

async function loadMarketPrices(region, produceName) {
  let query = supabase.from('produce').select('*, farmer_id(*)');
  if(region && region !== 'all') query = query.eq('farmer_id.region', region);
  if(produceName && produceName !== 'all') query = query.eq('name', produceName);

  const { data, error } = await query;
  console.log(data);
  // Populate table dynamically
}

/* =========================
Insights / Charts
=========================*/
async function getPriceTrends() {
  const { data, error } = await supabase
    .from('produce')
    .select('name, price, farmer_id');
  if(error) console.error(error);
  else {
    // Use Chart.js to display trend
    console.log(data);
  }
}

/* =========================
Inputs Marketplace
=========================*/
async function requestInput(name, description) {
  const farmer = supabase.auth.user();
  const { data, error } = await supabase.from('inputs').insert([
    { name, description, farmer_id: farmer.id, requested: true }
  ]);
  if(error) console.error(error);
  else console.log("Input requested:", data);
}

/* =========================
LOGIN
=========================*/
async function loginWithPhone(phone) {
    const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone
    });
    if(error) alert(error.message);
    else alert("Verification code sent!");
}

// Verify OTP
async function verifyOTP(token) {
    const { data, error } = await supabase.auth.verifyOtp({
        token,
        type: 'sms'
    });
    if(error) alert(error.message);
    else console.log("Logged in user:", data.user);
}

/* =========================
ADMIN
=========================*/
async function fetchUsers() {
  const { data, error } = await supabase.from('users').select('*');
  console.log(data);
}

async function approveProducePrice(produceId) {
  const { data, error } = await supabase.from('produce').update({ approved: true }).eq('id', produceId);
  console.log(data);
}
