let allMovies = [];
let filteredMovies = [];
let currentPage = 1;
const moviesPerPage = 20;
const MONETAG_SMARTLINK = "https://otieu.com/4/10489561";

// Jab browser ka Back button dabe
window.onpopstate = function() {
    if (document.getElementById('movieDetailsPage').style.display === "block") {
        closeDetails(false);
    }
};

function toggleMenu() {
    const menu = document.getElementById("sideMenu");
    menu.style.width = menu.style.width === "250px" ? "0" : "250px";
}

async function loadCategory(file) {
    const res = await fetch(`./${file}`);
    allMovies = await res.json();
    filteredMovies = allMovies;
    currentPage = 1;
    displayMovies();
}

function displayMovies() {
    const grid = document.getElementById('movieGrid');
    grid.innerHTML = "";
    const start = (currentPage - 1) * moviesPerPage;
    const paginated = filteredMovies.slice(start, start + moviesPerPage);

    paginated.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `<img src="${movie.poster}"><div class="movie-info">${movie.title}</div>`;
        card.onclick = () => openDetails(movie);
        grid.appendChild(card);
    });
    document.getElementById('pageStatus').innerText = `Page ${currentPage}`;
}

function openDetails(movie) {
    history.pushState({view: 'details'}, ""); 
    document.getElementById('detailTitle').innerText = movie.title;
    document.getElementById('detailImg').src = movie.poster;
    document.getElementById('movieDetailsPage').style.display = "block";
    document.getElementById('mainPage').style.display = "none";
    document.getElementById('goToDownload').onclick = () => {
        window.open(MONETAG_SMARTLINK, '_blank');
        setTimeout(() => { window.location.href = movie.url; }, 800);
    };
}

function closeDetails(shouldGoBack = true) {
    document.getElementById('movieDetailsPage').style.display = "none";
    document.getElementById('mainPage').style.display = "block";
    if (shouldGoBack) history.back();
}

function nextPage() { currentPage++; displayMovies(); window.scrollTo(0,0); }
function prevPage() { if(currentPage > 1) { currentPage--; displayMovies(); window.scrollTo(0,0); } }

function shareWebsite() {
    if (navigator.share) {
        navigator.share({ title: 'MyMoviesFun', url: 'https://mymoviesfun.vercel.app/' });
    }
}

loadCategory('movies_data.json');
