const API_KEY = "h7VUenZOxpFaISD9eSmam9P20umJ3vvvvPRB3Ghd"; 
const apodDateInput = document.getElementById("apodDate");
const searchButton = document.getElementById("searchButton");
const favouriteButton = document.getElementById("favouriteButton");
const favoritesList = document.getElementById("favoritesList");

// Cargar APOD del día al iniciar
document.addEventListener("DOMContentLoaded", () => {
    loadAPOD();
    loadFavorites();
});

// Función principal para consultar la API
async function loadAPOD(date = "") {
    let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
    if (date) url += `&date=${date}`;
    const res = await fetch(url);
    const data = await res.json();
    displayAPOD(data);
}

// Mostrar los datos en pantalla
function displayAPOD(data) {
    document.getElementById("apodTitle").textContent = data.title;
    document.getElementById("apodDateText").textContent = data.date;
    document.getElementById("apodExplanation").textContent = data.explanation;
    const mediaContainer = document.getElementById("mediaContainer");
    mediaContainer.innerHTML = "";
    if (data.media_type === "image") {
        mediaContainer.innerHTML = `<img src="${data.url}" class="shadow">`;
    } else {
        mediaContainer.innerHTML = `
            <iframe src="${data.url}" height="400" class="w-100" allowfullscreen></iframe>
        `;
    }
}

// Buscar por fecha con validación
searchButton.addEventListener("click", () => {
    const selectedDate = apodDateInput.value;
    if (!selectedDate) {
        alert("Por favor selecciona una fecha.");
        return;
    }
    const today = new Date().toISOString().split("T")[0];
    if (selectedDate > today) {
        alert("Aún no predecimos el futuro. Intentalo cuando llegue ese día.");
        return;
    }
    loadAPOD(selectedDate);
});

// Guardar APOD en favoritos
favouriteButton.addEventListener("click", () => {
    const title = document.getElementById("apodTitle").textContent;
    const date = document.getElementById("apodDateText").textContent;
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    // evitar repetidos
    if (favorites.some(f => f.date === date)) {
        alert("Este item ya está en favoritos.");
        return;
    }
    favorites.push({ title, date });
    localStorage.setItem("favorites", JSON.stringify(favorites));
    loadFavorites();
});

// Cargar favoritos en la lista
function loadFavorites() {
    favoritesList.innerHTML = "";
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.forEach(fav => {
        const li = document.createElement("li");
        li.classList = "list-group-item bg-dark text-white";
        li.textContent = `${fav.date} — ${fav.title}`;
        li.addEventListener("click", () => loadAPOD(fav.date));
        favoritesList.appendChild(li);
    });
}
