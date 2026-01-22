let allMovies = [];
let filteredMovies = [];
let currentPage = 1;
const moviesPerPage = 20;
const MONETAG_SMARTLINK = "https://otieu.com/4/10489561";

// --- Browser Back Button Control ---
window.onpopstate = function(event) {
    if (event.state) {
        if (event.state.view === 'grid') {
            // Agar detail page khula hai toh band karke grid dikhao
            document.getElementById('movieDetailsPage').style.display = "none";
            document.getElementById('mainPage').style.display = "block";
            
            // Wahi page load karo jo history mein tha
            if (event.state.page) {
                currentPage = event.state.page;
                displayMovies(false); // false taake naya history state na bane
            }
        }
    }
};

function toggleMenu() {
    const menu = document.getElementById("sideMenu");
    menu.style.width = (menu.style.width === "280px") ? "0px" : "280px";
}

async function loadCategory(file) {
    try {
        const res = await fetch(`./${file}`);
        allMovies = await res.json();
        filteredMovies = allMovies;
        currentPage = 1;
        displayMovies(true);
        if(document.getElementById("sideMenu").style.width === "280px") toggleMenu();
    } catch (error) {
        console.error("Error loading category:", error);
    }
}

function displayMovies(updateHistory = true) {
    const grid = document.getElementById('movieGrid');
    grid.innerHTML = "";

    // History save karna jab bhi page change ho (Page 7, Page 6 etc)
    if (updateHistory) {
        history.pushState({view: 'grid', page: currentPage}, "", `?page=${currentPage}`);
    }

    const start = (currentPage - 1) * moviesPerPage;
    const paginated = filteredMovies.slice(start, start + moviesPerPage);

    paginated.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${movie.poster}" loading="lazy">
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
    // Detail open karte waqt ek naya state push karo taake back button detail band kare
    history.pushState({view: 'detail', page: currentPage}, ""); 
    
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

function closeDetails() {
    history.back(); // Browser back ko trigger karega jo onpopstate handle karega
}

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    filteredMovies = allMovies.filter(m => m.title.toLowerCase().includes(query));
    currentPage = 1;
    displayMovies(true);
}

function nextPage() {
    if ((currentPage * moviesPerPage) < filteredMovies.length) {
        currentPage++;
        displayMovies(true);
        window.scrollTo(0, 0);
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        displayMovies(true);
        window.scrollTo(0, 0);
    }
}

function shareWebsite() {
    const shareUrl = 'https://mymoviesfun.vercel.app/?page=' + currentPage;
    if (navigator.share) {
        navigator.share({ title: 'My Movies Fun', url: shareUrl });
    } else {
        alert("Link: " + shareUrl);
    }
}

// Initial Load
loadCategory('movies_data.json');
        
