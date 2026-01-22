let allMovies = [];
let filteredMovies = [];
let currentPage = 1;
const moviesPerPage = 20;
const MONETAG_SMARTLINK = "https://otieu.com/4/10489561";

// Search Logic
document.getElementById('searchBtn').onclick = () => performSearch();
document.getElementById('searchInput').onkeyup = (e) => { if (e.key === 'Enter') performSearch(); };

// Sidebar Toggle
function toggleMenu() {
    const menu = document.getElementById("sideMenu");
    menu.style.width = menu.style.width === "260px" ? "0" : "260px";
}

// Share Function
function shareWebsite() {
    if (navigator.share) {
        navigator.share({
            title: 'MyMoviesFun',
            text: 'Download Latest Hollywood, South & Thriller Movies for Free!',
            url: 'https://mymoviesfun.vercel.app/'
        });
    } else {
        alert("Copy this link: https://mymoviesfun.vercel.app/");
    }
}

async function loadCategory(fileName) {
    try {
        const response = await fetch(`./${fileName}`);
        allMovies = await response.json();
        filteredMovies = allMovies;
        currentPage = 1;
        displayMovies(true);
    } catch (e) { console.error("Error loading category"); }
}

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    filteredMovies = query === "" ? allMovies : allMovies.filter(m => (m.Title || m.title || "").toLowerCase().includes(query));
    currentPage = 1;
    displayMovies(true);
}

function displayMovies(shouldPush = true) {
    const grid = document.getElementById('movieGrid');
    grid.innerHTML = "";
    const start = (currentPage - 1) * moviesPerPage;
    const paginated = filteredMovies.slice(start, start + moviesPerPage);

    paginated.forEach(movie => {
        const title = movie.Title || movie.title || "No Title";
        const cleanName = title.replace(/HDTS|WEB-DL|720p|1080p|BluRay|HDRip|Hindi|English/gi, '').trim();
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `<div class="img-container"><img src="${movie.poster}" loading="lazy"></div><div class="movie-info">${cleanName}</div>`;
        card.onclick = () => openDetails(movie, cleanName);
        grid.appendChild(card);
    });
    updatePagination();
    window.scrollTo(0,0);
}

function openDetails(movie, cleanName) {
    document.getElementById('detailTitle').innerText = cleanName;
    document.getElementById('detailImg').src = movie.poster;
    document.getElementById('movieDetailsPage').style.display = "block";
    document.getElementById('mainPage').style.display = "none";
    
    document.getElementById('goToDownload').onclick = () => {
        window.open(MONETAG_SMARTLINK, '_blank');
        setTimeout(() => { window.location.href = movie.url || movie.link; }, 800);
    };
    document.getElementById('server2Btn').onclick = () => window.open(MONETAG_SMARTLINK, '_blank');
    window.scrollTo(0,0);
}

function closeDetails(shouldGoBack = true) {
    document.getElementById('movieDetailsPage').style.display = "none";
    document.getElementById('mainPage').style.display = "block";
}

function updatePagination() {
    const total = Math.ceil(filteredMovies.length / moviesPerPage);
    document.getElementById('pageStatus').innerText = `Page ${currentPage} of ${total}`;
    document.getElementById('prevBtn').disabled = (currentPage === 1);
    document.getElementById('nextBtn').disabled = (currentPage >= total || total === 0);
}

document.getElementById('nextBtn').onclick = () => { currentPage++; displayMovies(); };
document.getElementById('prevBtn').onclick = () => { if(currentPage > 1) { currentPage--; displayMovies(); } };

loadCategory('movies_data.json');
        
