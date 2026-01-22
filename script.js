let allMovies = [];
let filteredMovies = [];
let currentPage = 1;
const moviesPerPage = 20;
const MONETAG_SMARTLINK = "https://otieu.com/4/10489561";

window.onpopstate = function(event) {
    if (document.getElementById('movieDetailsPage').style.display === "block") {
        document.getElementById('movieDetailsPage').style.display = "none";
        document.getElementById('mainPage').style.display = "block";
    } else if (event.state && event.state.page) {
        currentPage = event.state.page;
        displayMovies(false);
    }
};

function toggleMenu() {
    const menu = document.getElementById("sideMenu");
    menu.style.width = (menu.style.width === "280px") ? "0px" : "280px";
}

async function loadCategory(file) {
    const res = await fetch(`./${file}`);
    allMovies = await res.json();
    filteredMovies = allMovies;
    currentPage = 1;
    displayMovies(true);
    if(document.getElementById("sideMenu").style.width === "280px") toggleMenu();
}

function displayMovies(updateHistory = true) {
    const grid = document.getElementById('movieGrid');
    grid.innerHTML = "";
    if (updateHistory) history.pushState({page: currentPage}, "", `?page=${currentPage}`);

    const start = (currentPage - 1) * moviesPerPage;
    const paginated = filteredMovies.slice(start, start + moviesPerPage);

    paginated.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${movie.poster}">
            <div class="movie-info">${movie.title}</div>
            <div class="badge-area">
                <span class="dubbed-badge">Hindi Dubbed</span>
                <span class="hd-badge">⚡ Full HD Available</span>
            </div>
        `;
        card.onclick = () => openDetails(movie);
        grid.appendChild(card);
    });
    document.getElementById('pageStatus').innerText = `Page ${currentPage}`;
}

function openDetails(movie) {
    history.pushState({view: 'details', page: currentPage}, ""); 
    document.getElementById('detailTitle').innerText = movie.title;
    document.getElementById('detailImg').src = movie.poster;
    document.getElementById('movieDetailsPage').style.display = "block";
    document.getElementById('mainPage').style.display = "none";
    
    const clickLink = () => {
        window.open(MONETAG_SMARTLINK, '_blank');
        setTimeout(() => { window.location.href = movie.url; }, 800);
    };
    document.getElementById('goToDownload').onclick = clickLink;
    document.getElementById('fastServerBtn').onclick = clickLink;
    window.scrollTo(0, 0);
}

function closeDetails() { history.back(); }

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    filteredMovies = allMovies.filter(m => m.title.toLowerCase().includes(query));
    currentPage = 1;
    displayMovies(true);
}

function nextPage() { currentPage++; displayMovies(true); window.scrollTo(0,0); }
function prevPage() { if(currentPage > 1) { currentPage--; displayMovies(true); window.scrollTo(0,0); } }

function shareWebsite() {
    if (navigator.share) {
        navigator.share({ title: 'My Movies Fun', url: 'https://mymoviesfun.vercel.app/?page=1' });
    }
}

loadCategory('movies_data.json');
