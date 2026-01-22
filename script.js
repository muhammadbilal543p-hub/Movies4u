let allMovies = [];
let filteredMovies = [];
let currentPage = 1;
const moviesPerPage = 20;
const MONETAG_SMARTLINK = "https://otieu.com/4/10489561";

// 1. Back Button Navigation Logic
window.onpopstate = function(event) {
    // Agar details page khula hai, to use band karo aur home dikhao
    if (document.getElementById('movieDetailsPage').style.display === "block") {
        closeDetails(false); 
    }
};

function toggleMenu() {
    const menu = document.getElementById("sideMenu");
    menu.style.width = menu.style.width === "250px" ? "0" : "250px";
}

async function loadCategory(file) {
    try {
        const res = await fetch(`./${file}`);
        allMovies = await res.json();
        filteredMovies = allMovies;
        currentPage = 1;
        displayMovies();
    } catch (e) {
        console.error("Error loading JSON:", file);
    }
}

function displayMovies() {
    const grid = document.getElementById('movieGrid');
    grid.innerHTML = "";
    const start = (currentPage - 1) * moviesPerPage;
    const paginated = filteredMovies.slice(start, start + moviesPerPage);

    paginated.forEach(movie => {
        // Cleaning title for display
        const displayTitle = movie.title.replace(/Hindi|Dubbed|Dual Audio|720p|1080p|BluRay/gi, '').trim();
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <div class="img-container">
                <img src="${movie.poster}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x300?text=No+Poster'">
                <div class="dubbed-badge">Hindi Dubbed</div>
            </div>
            <div class="movie-info">${displayTitle}</div>
        `;
        card.onclick = () => openDetails(movie);
        grid.appendChild(card);
    });
    document.getElementById('pageStatus').innerText = `Page ${currentPage}`;
    updatePaginationButtons();
}

function openDetails(movie) {
    // Browser history mein state add karo takay Back button kaam kare
    history.pushState({view: 'details'}, ""); 
    
    document.getElementById('detailTitle').innerText = movie.title;
    document.getElementById('detailImg').src = movie.poster;
    document.getElementById('movieDetailsPage').style.display = "block";
    document.getElementById('mainPage').style.display = "none";
    
    document.getElementById('goToDownload').onclick = () => {
        window.open(MONETAG_SMARTLINK, '_blank');
        setTimeout(() => { window.location.href = movie.url; }, 800);
    };
    window.scrollTo(0, 0);
}

function closeDetails(shouldGoBack = true) {
    document.getElementById('movieDetailsPage').style.display = "none";
    document.getElementById('mainPage').style.display = "block";
    // Agar hum code se close kar rahe hain (X button), to history piche le jao
    if (shouldGoBack) history.back();
}

function nextPage() { 
    if (currentPage * moviesPerPage < filteredMovies.length) {
        currentPage++; 
        displayMovies(); 
        window.scrollTo(0,0); 
    }
}

function prevPage() { 
    if(currentPage > 1) { 
        currentPage--; 
        displayMovies(); 
        window.scrollTo(0,0); 
    } 
}

function updatePaginationButtons() {
    document.getElementById('prevBtn').disabled = (currentPage === 1);
    document.getElementById('nextBtn').disabled = (currentPage * moviesPerPage >= filteredMovies.length);
}

function shareWebsite() {
    if (navigator.share) {
        navigator.share({ 
            title: 'MYMOVIESFUN', 
            text: 'Watch and Download Latest Movies for Free!',
            url: 'https://mymoviesfun.vercel.app/' 
        });
    }
}

// Search Functionality
document.getElementById('searchBtn').onclick = () => {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    filteredMovies = allMovies.filter(m => m.title.toLowerCase().includes(query));
    currentPage = 1;
    displayMovies();
};

// Initial Load
loadCategory('movies_data.json');
                            
