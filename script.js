
// ==============================
// 🔐 FIREBASE
// ==============================

var firebaseConfig = {
  apiKey: "AIzaSyAWmlXK8lJIm4eiy5NSi9adNyO4ppgcyaM",
  authDomain: "geotatica-efa61.firebaseapp.com",
  projectId: "geotatica-efa61",
  storageBucket: "geotatica-efa61.appspot.com",
  messagingSenderId: "658834081269",
  appId: "1:658834081269:web:44f48a22648557d23f8cbc"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// ==============================
// 🔒 PROTEÇÃO DE ACESSO
// ==============================

firebase.auth().onAuthStateChanged(async function(user) {
  if (!user) {
    window.location.href = "https://geotatica.github.io/Plataforma_Dados/login.html?redirect=" + encodeURIComponent("https://geotatica.github.io/Plataforma_Dados/");
  } else {
    try {
      const tokenResult = await user.getIdTokenResult(true);
      const nivel = tokenResult.claims.nivel || "essencial";
      console.log("Usuário logado:", user.email);
      console.log("Nível do usuário:", nivel);
    } catch (error) {
      console.warn("Não foi possível ler a claim de nível:", error);
    }
  }
});

// ==============================
// 🚪 LOGOUT
// ==============================

function logout() {
  firebase.auth().signOut().then(function() {
    window.location.href = "https://geotatica.github.io/Plataforma_Dados/login.html?redirect=" + encodeURIComponent("https://geotatica.github.io/Plataforma_Dados/");
  });
}

// ==============================
// 🔎 BUSCA
// ==============================

function filterCards() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  let visible = 0;

  cards.forEach(card => {
    const text = card.innerText.toLowerCase();

    if (text.includes(input)) {
      card.style.display = "block";
      visible++;
    } else {
      card.style.display = "none";
    }
  });

  updateCount(visible);
}

// ==============================
// 🎯 FILTRO PRINCIPAL
// ==============================

let currentFilter = "all";

function setFilter(filter, btn) {
  currentFilter = filter;

  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  applyFilters();
}

// ==============================
// 🌍 FILTRO POR TEMA
// ==============================

let currentTheme = null;

function setTheme(theme, btn) {
  currentTheme = theme;

  document.querySelectorAll(".intent-chip").forEach(b => b.classList.remove("active-theme"));
  btn.classList.add("active-theme");

  applyFilters();
}

function clearThemeFilter() {
  currentTheme = null;

  document.querySelectorAll(".intent-chip").forEach(b => b.classList.remove("active-theme"));

  applyFilters();
}

// ==============================
// 🧠 APLICAR FILTROS
// ==============================

function applyFilters() {
  const cards = document.querySelectorAll(".card");

  let visible = 0;

  cards.forEach(card => {
    const cat = card.getAttribute("data-cat") || "";
    const text = card.innerText.toLowerCase();

    let show = true;

    // filtro categoria
    if (currentFilter !== "all" && cat !== currentFilter) {
      show = false;
    }

    // filtro tema
    if (currentTheme && !text.includes(currentTheme)) {
      show = false;
    }

    if (show) {
      card.style.display = "block";
      visible++;
    } else {
      card.style.display = "none";
    }
  });

  updateCount(visible);
}

// ==============================
// 📊 CONTADOR
// ==============================

function updateCount(visible) {
  const total = document.querySelectorAll(".card").length;

  const countDisplay = document.getElementById("countDisplay");
  const noResults = document.getElementById("noResults");

  if (countDisplay) {
    countDisplay.innerText = `Exibindo ${visible} de ${total} fontes`;
  }

  if (noResults) {
    noResults.style.display = visible === 0 ? "block" : "none";
  }
}

// ==============================
// 🚀 INICIALIZAÇÃO
// ==============================

window.onload = function () {
  const total = document.querySelectorAll(".card").length;

  const heroTotal = document.getElementById("heroTotal");
  const statTotal = document.getElementById("statTotal");

  if (heroTotal) heroTotal.innerText = total;
  if (statTotal) statTotal.innerText = total;

  updateCount(total);
};