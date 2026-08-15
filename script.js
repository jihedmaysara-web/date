const EMAILJS_PUBLIC_KEY = "sLGR-qsPR65PQ41fj";
const EMAILJS_SERVICE_ID = "service_h69kb2h";
const EMAILJS_TEMPLATE_ID = "template_0hqp9e7";

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

const dates = [3, 4, 5, 10, 11, 12, 17, 18, 19];

const places = {
  Cafe: [
    { name: "SeelaZ – Zahraa Maadi", image: "seelaz.jpg", area: "Zahraa Maadi" },
    { name: "Moka Bistro – Zahraa Maadi", image: "moka.jpg", area: "Zahraa Maadi" },
    { name: "1980 Coffee – Maadi", image: "coffee1980.jpg", area: "Maadi" },
    { name: "Vasko Coffee – Maadi", image: "vasko.jpg", area: "Maadi" },
    { name: "YOKU Coffee House – Zahraa Maadi", image: "yoku.jpg", area: "Zahraa Maadi" }
  ],
  Dinner: [
    { name: "Calisto Restaurant & Cafe", image: "calisto.jpg", area: "Maadi" },
    { name: "Tenaya Riverside Dining", image: "tenaya.jpg", area: "Cairo" },
    { name: "Bistro Paris – Maadi", image: "bistro-paris.jpg", area: "Maadi" },
    { name: "Estro – An Italian Rooftop", image: "estro.jpg", area: "Maadi" }
  ],
  Cinema: [
    { name: "Scene Cinema – District 5", image: "scene-district5.jpg", area: "District 5" },
    { name: "Scene Cinema – CFC", image: "scene-cfc.jpg", area: "Cairo Festival City" }
  ]
};

const movies = [
  { name: "El Gawahergy – الجواهرجي", image: "el-gawahergy.jpg" },
  { name: "Mahmoud Eltany – محمود التاني", image: "mahmoud-eltany.jpg" },
  { name: "Sakr w Canaria – صقر وكناريا", image: "sakr-w-canaria.jpg" },
  { name: "Spider-Man: Brand New Day", image: "spiderman.jpg" },
  { name: "The Odyssey", image: "the-odyssey.jpg" },
  { name: "Khali Balak Min Nafsik – خلي بالك من نفسك", image: "khali-balak.jpg" }
];

// Easy-to-edit time lists for Cafe / Dinner.
const times = {
  Cafe: ["2:00 PM", "4:00 PM", "6:00 PM", "8:00 PM", "9:30 PM"],
  Dinner: ["6:00 PM", "7:30 PM", "9:00 PM", "10:30 PM", "11:30 PM"]
};

const state = {
  name: "",
  date: "",
  type: "",
  place: null,
  movie: null,
  time: ""
};

const screens = [...document.querySelectorAll(".screen")];
const stepIndicator = document.getElementById("stepIndicator");

function showScreen(id) {
  screens.forEach(s => s.classList.toggle("active", s.id === id));
  const labels = {
    "screen-welcome": "Let's start",
    "screen-date": "Choose a date",
    "screen-type": "Choose the vibe",
    "screen-place": "Choose a place",
    "screen-movie": "Choose a movie",
    "screen-time": "Choose a time",
    "screen-confirm": "Confirm"
  };
  stepIndicator.textContent = labels[id] || "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function formatDate(day) {
  return `${day} September 2026`;
}

function createDateCards() {
  const grid = document.getElementById("dateGrid");
  grid.innerHTML = dates.map(day => `
    <button class="date-card" data-day="${day}">
      <span class="day">${day}</span>
      <span class="month">September</span>
    </button>
  `).join("");

  grid.querySelectorAll(".date-card").forEach(card => {
    card.addEventListener("click", () => {
      grid.querySelectorAll(".date-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      state.date = card.dataset.day;
      document.getElementById("dateNext").disabled = false;
    });
  });
}

function renderPlaces(type) {
  const grid = document.getElementById("placeGrid");
  const list = places[type];

  document.getElementById("placeEyebrow").textContent =
    type === "Cinema" ? "Step 3" : "Step 3";
  document.getElementById("placeTitle").textContent =
    type === "Cinema" ? "Which cinema?" : `Pick a ${type.toLowerCase()}`;
  document.getElementById("placeSubtitle").textContent =
    `${formatDate(state.date)} · choose one`;

  grid.innerHTML = list.map((item, i) => `
    <button class="place-card" data-index="${i}">
      <img src="${item.image}" alt="${item.name}" loading="lazy">
      <div class="place-info">
        <h3>${item.name}</h3>
        <span>${item.area}</span>
      </div>
    </button>
  `).join("");

  grid.querySelectorAll(".place-card").forEach(card => {
    card.addEventListener("click", () => {
      grid.querySelectorAll(".place-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      state.place = list[Number(card.dataset.index)];
      document.getElementById("placeNext").disabled = false;
    });
  });
}

function renderMovies() {
  const grid = document.getElementById("movieGrid");
  grid.innerHTML = movies.map((movie, i) => `
    <button class="movie-card" data-index="${i}">
      <img src="${movie.image}" alt="${movie.name}" loading="lazy">
      <div class="movie-info">
        <h3>${movie.name}</h3>
      </div>
    </button>
  `).join("");

  document.getElementById("cinemaText").textContent =
    `${state.place.name} · ${formatDate(state.date)}`;

  grid.querySelectorAll(".movie-card").forEach(card => {
    card.addEventListener("click", () => {
      grid.querySelectorAll(".movie-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      state.movie = movies[Number(card.dataset.index)];
      document.getElementById("movieNext").disabled = false;
    });
  });
}

function renderTimes(type) {
  const grid = document.getElementById("timeGrid");
  const list = times[type];

  document.getElementById("timeSubtitle").textContent =
    `${state.place.name} · ${formatDate(state.date)}`;

  grid.innerHTML = list.map(time => `
    <button class="time-card" data-time="${time}">${time}</button>
  `).join("");

  grid.querySelectorAll(".time-card").forEach(card => {
    card.addEventListener("click", () => {
      grid.querySelectorAll(".time-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      state.time = card.dataset.time;
      document.getElementById("timeNext").disabled = false;
    });
  });
}

function renderSummary() {
  const rows = [
    ["Name", state.name || "—"],
    ["Date", formatDate(state.date)],
    ["Type", state.type],
    ["Place", state.place?.name || "—"]
  ];

  if (state.type === "Cinema") {
    rows.push(["Movie", state.movie?.name || "—"]);
  } else {
    rows.push(["Time", state.time || "—"]);
  }

  document.getElementById("summaryCard").innerHTML = rows.map(([label, value]) => `
    <div class="summary-row">
      <span>${label}</span>
      <span>${value}</span>
    </div>
  `).join("");
}

document.getElementById("startBtn").addEventListener("click", () => {
  state.name = document.getElementById("guestName").value.trim();
  showScreen("screen-date");
});

document.getElementById("nahBtn").addEventListener("click", () => {
  const note = document.getElementById("nahNote");
  note.textContent = "Okay… I'll be here when you change your mind 😌";
});

document.getElementById("dateNext").addEventListener("click", () => {
  document.getElementById("selectedDateText").textContent = formatDate(state.date);
  showScreen("screen-type");
});

document.querySelectorAll(".type-card").forEach(card => {
  card.addEventListener("click", () => {
    state.type = card.dataset.type;
    state.place = null;
    state.movie = null;
    state.time = "";

    renderPlaces(state.type);
    document.getElementById("placeNext").disabled = true;
    showScreen("screen-place");
  });
});

document.getElementById("placeNext").addEventListener("click", () => {
  if (state.type === "Cinema") {
    renderMovies();
    document.getElementById("movieNext").disabled = true;
    showScreen("screen-movie");
  } else {
    renderTimes(state.type);
    document.getElementById("timeNext").disabled = true;
    showScreen("screen-time");
  }
});

document.getElementById("movieNext").addEventListener("click", () => {
  renderSummary();
  showScreen("screen-confirm");
});

document.getElementById("timeNext").addEventListener("click", () => {
  renderSummary();
  showScreen("screen-confirm");
});

document.getElementById("timeBack").addEventListener("click", () => {
  renderPlaces(state.type);
  document.getElementById("placeNext").disabled = false;
  showScreen("screen-place");
});

document.getElementById("summaryBack").addEventListener("click", () => {
  if (state.type === "Cinema") {
    renderMovies();
    document.getElementById("movieNext").disabled = !state.movie;
    showScreen("screen-movie");
  } else {
    renderTimes(state.type);
    document.getElementById("timeNext").disabled = !state.time;
    showScreen("screen-time");
  }
});

document.querySelectorAll("[data-back]").forEach(btn => {
  btn.addEventListener("click", () => showScreen(btn.dataset.back));
});

document.getElementById("confirmBtn").addEventListener("click", async () => {
  const status = document.getElementById("status");
  const button = document.getElementById("confirmBtn");

  button.disabled = true;
  status.className = "status";
  status.textContent = "Sending your choice…";

  const params = {
    name: state.name || "A guest",
    date: formatDate(state.date),
    type: state.type,
    place: state.place?.name || "",
    movie: state.type === "Cinema" ? (state.movie?.name || "") : "",
    time: state.type === "Cinema" ? "" : state.time
  };

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params);
    status.className = "status success";
    status.textContent = "Choice sent successfully ✨";
    button.textContent = "Sent ✓";
  } catch (error) {
    console.error(error);
    status.className = "status error";
    status.textContent = "Something went wrong. Check EmailJS settings and try again.";
    button.disabled = false;
  }
});

createDateCards();
