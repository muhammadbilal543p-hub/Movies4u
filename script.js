let allMovies = [];
let filteredMovies = [];
let currentPage = 1;
const moviesPerPage = 20;

// Browser Back Button handler (Step-by-Step Navigation)
window.addEventListener('popstate', function(event) {
    if (event.state) {
        if (event.state.page === 'details') {
            // Movie detail kholni hai agar history mein hai
            const savedMovie = sessionStorage.getItem('selectedMovie');
            if (savedMovie) {
                const movieData = JSON.parse(savedMovie);
                openDetails(movieData, sessionStorage.getItem('lastCleanName'), true);
            }
        } else if (event.state.pageNumber) {
            // Page change handle karein
            closeDetails(false); // Detail page band karein agar khula hai
            currentPage = event.state.pageNumber;
            displayMovies(false); // false matlab naya history state create nahi karna
        }
    } else {
        // Initial state (Page 1)
        closeDetails(false);
        currentPage = 1;
        displayMovies(false);
    }
});

async function loadMovies() {
    try {
        const response = await fetch('movies_data.json');
        allMovies = await response.json();
        filteredMovies = allMovies;
        
        // Initial state set karein
        history.replaceState({pageNumber: 1}, "Page 1");
        displayMovies(false);

        // Redirect ke baad memory check
        const lastMovie = sessionStorage.getItem('selectedMovie');
        if (lastMovie) {
            const movieData = JSON.parse(lastMovie);
            openDetails(movieData, sessionStorage.getItem('lastCleanName'), true);
        }
    } catch (e) { console.error("Data load failed"); }
}

function displayMovies(shouldPushState = true) {
    const grid = document.getElementById('movieGrid');
    grid.innerHTML = "";
    const start = (currentPage - 1) * moviesPerPage;
    const paginated = filteredMovies.slice(start, start + moviesPerPage);

    // History mein page save karein agar zaroorat ho
    if (shouldPushState) {
        history.pushState({pageNumber: currentPage}, "Page " + currentPage);
    }

    paginated.forEach(movie => {
        const title = movie.Title || movie.title || "No Title";
        let cleanName = title.replace(/HDTS|WEB-DL|720p|1080p|480p|BluRay|HDRip|WEBRip|Hindi|English|Dual|Audio/gi, '')
                             .split('(')[0].split('[')[0].trim();
        
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <div class="img-container"><img src="${movie.poster}" loading="lazy"></div>
            <div class="movie-info">
                <span class="movie-name">${cleanName || title}</span>
                <span class="hindi-badge">Hindi Dubbed</span>
                <span class="quality-text">⚡ Full HD</span>
            </div>
        `;
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

    if (!isBackNav) {
        history.pushState({page: 'details'}, "Details");
    }

    document.getElementById('goToDownload').onclick = () => {
        window.location.href = movie.url || movie.link;
    };
    window.scrollTo(0,0);
}

function closeDetails(shouldGoBack = true) {
    document.getElementById('movieDetailsPage').style.display = "none";
    document.getElementById('mainPage').style.display = "block";
    
    sessionStorage.removeItem('selectedMovie');
    sessionStorage.removeItem('lastCleanName');

    if (shouldGoBack) {
        history.back(); // Browser ko pichle state (yani pichle page) par le jaye
    }
}

function goHome() {
    sessionStorage.clear();
    window.location.href = window.location.pathname; // Page refresh and reset
}

function performSearch() {
    const term = document.getElementById('searchInput').value.toLowerCase().trim();
    filteredMovies = allMovies.filter(m => (m.Title || m.title || "").toLowerCase().includes(term));
    currentPage = 1;
    displayMovies(true);
}

document.getElementById('searchBtn').onclick = performSearch;
document.getElementById('searchInput').onkeypress = (e) => { if (e.key === 'Enter') performSearch(); };

function updatePagination() {
    const total = Math.ceil(filteredMovies.length / moviesPerPage);
    document.getElementById('pageStatus').innerText = `Page ${currentPage} of ${total}`;
    document.getElementById('prevBtn').disabled = (currentPage === 1);
    document.getElementById('nextBtn').disabled = (currentPage >= total);
}

document.getElementById('nextBtn').onclick = () => { 
    currentPage++; 
    displayMovies(true); 
};
document.getElementById('prevBtn').onclick = () => { 
    if(currentPage > 1) { 
        history.back(); // Manual piche jane ke bajaye browser history use karein
    }
};

loadMovies();
