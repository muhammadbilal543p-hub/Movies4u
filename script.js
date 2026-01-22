let allMovies = [];
let filteredMovies = [];
let currentPage = 1;
const moviesPerPage = 20;

// AAPKA MONETAG SMARTLINK YAHAN SET HAI
const MONETAG_SMARTLINK = "https://otieu.com/4/10489561"; 

window.addEventListener('popstate', function(event) {
    if (event.state && event.state.page === 'details') {
        const savedMovie = sessionStorage.getItem('selectedMovie');
        if (savedMovie) openDetails(JSON.parse(savedMovie), sessionStorage.getItem('lastCleanName'), true);
    } else if (event.state && event.state.pageNumber) {
        closeDetails(false);
        currentPage = event.state.pageNumber;
        displayMovies(false);
    }
});

async function loadMovies() {
    try {
        const response = await fetch('./movies_data.json');
        allMovies = await response.json();
        filteredMovies = allMovies;
        history.replaceState({pageNumber: 1}, "Page 1");
        displayMovies(false);
        const lastMovie = sessionStorage.getItem('selectedMovie');
        if (lastMovie) openDetails(JSON.parse(lastMovie), sessionStorage.getItem('lastCleanName'), true);
    } catch (e) { console.error("Data load error"); }
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
        card.innerHTML = `<div class="img-container"><img src="${movie.poster}" loading="lazy"></div><div class="movie-info"><span class="movie-name">${cleanName || title}</span><span class="hindi-badge">Full HD</span></div>`;
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

    // BUTTON 1: Click par pehle Ad khulega phir movie link par jayega
    document.getElementById('goToDownload').onclick = () => {
        window.open(MONETAG_SMARTLINK, '_blank'); 
        setTimeout(() => {
            window.location.href = movie.url || movie.link; 
        }, 500);
    };

    // BUTTON 2: Fast Server button par sirf SmartLink ad khulega
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

function goHome() { sessionStorage.clear(); window.location.href = window.location.pathname; }

function updatePagination() {
    const total = Math.ceil(filteredMovies.length / moviesPerPage);
    document.getElementById('pageStatus').innerText = `Page ${currentPage} of ${total}`;
    document.getElementById('prevBtn').disabled = (currentPage === 1);
    document.getElementById('nextBtn').disabled = (currentPage >= total);
}

document.getElementById('nextBtn').onclick = () => { currentPage++; displayMovies(true); };
document.getElementById('prevBtn').onclick = () => { if(currentPage > 1) history.back(); };
loadMovies();
