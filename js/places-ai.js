window.PlacesAI = (() => {
  let lat = null;
  let lon = null;

  const analyzeBtn = document.getElementById("analyze-btn");
  const addressEl = document.getElementById("ai-address");
  const analysisEl = document.getElementById("ai-analysis");
  const placesEl = document.getElementById("ai-places");

  function setPoint(newLat, newLon) {
    lat = newLat;
    lon = newLon;
    analyzeBtn.disabled = false;
  }

  analyzeBtn.addEventListener("click", async () => {
    if (!lat || !lon) return;

    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "Анализируем...";

    try {
      const response = await fetch("http://46.226.123.216:8080/v1/places/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({ lat, lon })
      });

      if (!response.ok) throw new Error("AI error");

      const data = await response.json();

      addressEl.textContent = data.address;
      analysisEl.textContent = data.analysis;

      renderPlaces(data.places);

    } catch (err) {
      alert("Ошибка получения ИИ-анализа");
      console.error(err);
    } finally {
      analyzeBtn.textContent = "Получить ИИ-анализ";
      analyzeBtn.disabled = false;
    }
  });

  function renderPlaces(places) {
    placesEl.innerHTML = "";

    if (!places || Object.keys(places).length === 0) {
      placesEl.textContent = "Нет данных";
      return;
    }

    for (const category in places) {
      const title = document.createElement("div");
      title.style.fontWeight = "600";
      title.style.marginTop = "8px";
      title.textContent = category;

      const ul = document.createElement("ul");
      ul.style.marginLeft = "16px";

      places[category].forEach(place => {
        const li = document.createElement("li");
        li.textContent = place;
        ul.appendChild(li);
      });

      placesEl.appendChild(title);
      placesEl.appendChild(ul);
    }
  }

  return { setPoint };
})();
