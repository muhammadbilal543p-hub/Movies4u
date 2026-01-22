let allMovies = [];
let filteredMovies = [];
let currentPage = 1;
const moviesPerPage = 20;

// MONETAG SMARTLINK
const MONETAG_SMARTLINK = "https://otieu.com/4/10489561"; 

// Search Functionality Connect
document.getElementById('searchBtn').onclick = () => performSearch();
document.getElementById('searchInput').onkeyup = (e) => {
    if (e.key === 'Enter') performSearch();
};

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    if (query === "") {
        filteredMovies = allMovies;
    } else {
        filteredMovies = allMovies.filter(movie => {
            const title = (movie.Title || movie.title || "").toLowerCase();
            return title.includes(query);
        });
    }
    currentPage = 1;
    displayMovies(true);
}

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page === 'details') {
        const savedMovie = sessionStorage.getItem('selectedMovie');
        if (savedMovie) openDetails(JSON.parse(savedMovie), sessionStorage.getItem('lastCleanName'), true);
    } else {
        closeDetails(false);
        if (event.state && event.state.pageNumber) currentPage = event.state.pageNumber;
        displayMovies(false);
    }
});

async function loadMovies() {
    try {
        const response = await fetch('./movies_data.json');
        allMovies = await response.json();
        filteredMovies = allMovies;
        displayMovies(false);
    } catch (e) { console.error("Error loading JSON"); }
}

function displayMovies(shouldPush = true) {
    const grid = document.getElementById('movieGrid');
    grid.innerHTML = "";
    if (shouldPush) history.pushState({pageNumber: currentPage}, "Page " + currentPage);
    
    const start = (currentPage - 1) * moviesPerPage;
    const paginated = filteredMovies.slice(start, start + moviesPerPage);

    paginated.forEach(movie => {
        const title = movie.Title || movie.title || "No Title";
        let cleanName = title.replace(/HDTS|WEB-DL|720p|1080p|480p|BluRay|HDRip|WEBRip|Hindi|English|Dual|Audio/gi, '').split('(')[0].split('[')[0].trim();
        
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `<div class="img-container"><img src="${movie.poster}" loading="lazy"></div><div class="movie-info"><span class="movie-name">${cleanName}</span></div>`;
        card.onclick = () => openDetails(movie, cleanName);
        grid.appendChild(card);
    });
    updatePagination();
    window.scrollTo(0,0);
}

function openDetails(movie, cleanName, isBackNav = false) {
    document.getElementById('detailTitle').innerText = cleanName;
    document.getElementById('detailImg').src = movie.poster;
    document.getElementById('movieDetailsPage').style.display = "block";
    document.getElementById('mainPage').style.display = "none";
    
    sessionStorage.setItem('selectedMovie', JSON.stringify(movie));
    sessionStorage.setItem('lastCleanName', cleanName);
    if (!isBackNav) history.pushState({page: 'details'}, "Details");

    document.getElementById('goToDownload').onclick = () => {
        window.open(MONETAG_SMARTLINK, '_blank');
        setTimeout(() => { window.location.href = movie.url || movie.link; }, 500);
    };

    document.getElementById('server2Btn').onclick = () => {
        window.open(MONETAG_SMARTLINK, '_blank');
    };
    window.scrollTo(0,0);
}

function closeDetails(shouldGoBack = true) {
    document.getElementById('movieDetailsPage').style.display = "none";
    document.getElementById('mainPage').style.display = "block";
    if (shouldGoBack) history.back();
}

function updatePagination() {
    const total = Math.ceil(filteredMovies.length / moviesPerPage);
    document.getElementById('pageStatus').innerText = `Page ${currentPage} of ${total}`;
    document.getElementById('prevBtn').disabled = (currentPage === 1);
    document.getElementById('nextBtn').disabled = (currentPage >= total || total === 0);
}

document.getElementById('nextBtn').onclick = () => { currentPage++; displayMovies(true); };
document.getElementById('prevBtn').onclick = () => { if(currentPage > 1) history.back(); };

function goHome() { window.location.reload(); }
loadMovies();
            
