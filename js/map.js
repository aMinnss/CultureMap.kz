// ===========================
// 1. MOCK DATA (пока без бэка)
// ===========================
const objects = [
  {
    id: 1,
    title: "Театр драмы",
    lat: 43.25,
    lon: 76.91,
    category: "Театр",
    city: "Алматы"
  },
  {
    id: 2,
    title: "Музей искусств",
    lat: 43.238,
    lon: 76.92,
    category: "Музей",
    city: "Алматы"
  }
];

// ===========================
// 2. ИНИЦИАЛИЗАЦИЯ КАРТЫ
// ===========================
const map = L.map('map').setView([43.2389, 76.8897], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// ===========================
// 3. ВЫБРАННЫЙ РАЙОН
// ===========================
let selectedAreaMarker = null;

// ===========================
// 4. КАРТОЧКА ОБЪЕКТА
// ===========================
const card = document.getElementById("object-card");
const cardTitle = document.getElementById("card-title");
const cardCategory = document.getElementById("card-category");
const cardCity = document.getElementById("card-city");
const closeCardBtn = document.getElementById("close-card");

function openCard(obj) {
  cardTitle.textContent = obj.title;
  cardCategory.textContent = obj.category;
  cardCity.textContent = obj.city;
  card.classList.remove("hidden");
}

closeCardBtn.addEventListener("click", () => {
  card.classList.add("hidden");
});

// ===========================
// 5. КЛИК ПО КАРТЕ (РАЙОН)
// ===========================
map.on("click", (e) => {
  const { lat, lng } = e.latlng;

  if (selectedAreaMarker) {
    map.removeLayer(selectedAreaMarker);
  }

  selectedAreaMarker = L.circleMarker([lat, lng], {
    radius: 8,
    color: "#2563eb",
    fillColor: "#2563eb",
    fillOpacity: 0.9
  }).addTo(map);

  // передаем координаты в AI
  window.PlacesAI.setPoint(lat, lng);

  // если была карточка объекта — закрываем
  card.classList.add("hidden");
});

// ===========================
// 6. МАРКЕРЫ ОБЪЕКТОВ
// ===========================
let markers = [];

function updateMap(data) {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  data.forEach(obj => {
    const marker = L.marker([obj.lat, obj.lon])
      .addTo(map)
      .bindPopup(`<b>${obj.title}</b><br>${obj.category}`);

    marker.on("click", () => {
      openCard(obj);

      if (selectedAreaMarker) {
        map.removeLayer(selectedAreaMarker);
        selectedAreaMarker = null;
      }

      const { lat, lon } = marker.getLatLng();
      window.PlacesAI.setPoint(lat, lon);
    });

    markers.push(marker);
  });

  renderChart(data);
}

// ===========================
// 7. ДИАГРАММА
// ===========================
function getCategoryStats(data) {
  const stats = {};
  data.forEach(obj => {
    stats[obj.category] = (stats[obj.category] || 0) + 1;
  });
  return stats;
}

let chartInstance = null;

function renderChart(data) {
  const stats = getCategoryStats(data);
  const ctx = document.getElementById("objectsChart");

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(stats),
      datasets: [{
        label: "Количество объектов",
        data: Object.values(stats)
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

// ===========================
// 8. ФИЛЬТР
// ===========================
const categoryFilter = document.getElementById("category-filter");

categoryFilter.addEventListener("change", () => {
  const selected = categoryFilter.value;
  updateMap(
    selected === "all"
      ? objects
      : objects.filter(o => o.category === selected)
  );
});

// ===========================
// 9. ИНИЦИАЛИЗАЦИЯ
// ===========================
updateMap(objects);
