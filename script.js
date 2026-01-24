let allMovies = [];
let filteredMovies = [];
let currentPage = 1;
const moviesPerPage = 20;
const MONETAG_SMARTLINK = "https://otieu.com/4/10489561";

// Keyboard Enter Key Search
document.getElementById('searchInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Browser History Control
window.onpopstate = function(event) {
    if (event.state) {
        if (event.state.view === 'grid') {
            document.getElementById('movieDetailsPage').style.display = "none";
            document.getElementById('mainPage').style.display = "block";
            if (event.state.page) {
                currentPage = event.state.page;
                displayMovies(false);
            }
        } else if (event.state.view === 'detail') {
            // Agar detail state hai toh grid chhupao
            document.getElementById('mainPage').style.display = "none";
            document.getElementById('movieDetailsPage').style.display = "block";
        }
    }
};

async function loadCategory(file) {
    try {
        const res = await fetch(`./${file}`);
        allMovies = await res.json();
        filteredMovies = allMovies;
        
        // Check URL for page parameter
        const urlParams = new URLSearchParams(window.location.search);
        currentPage = parseInt(urlParams.get('page')) || 1;
        
        displayMovies(true);
        if(document.getElementById("sideMenu").style.width === "280px") toggleMenu();
    } catch (error) {
        console.error("Error loading category:", error);
    }
}

function displayMovies(updateHistory = true) {
    const grid = document.getElementById('movieGrid');
    grid.innerHTML = "";

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
    renderPagination();
}

// SMART GROUPED PAGINATION (1, 2... Next... 10... 20)
function renderPagination() {
    const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
    const container = document.getElementById('paginationGroup');
    container.innerHTML = "";

    const info = document.createElement('div');
    info.className = 'total-pages-label';
    info.innerText = `Total Pages: ${totalPages} | Current Page: ${currentPage}`;
    container.appendChild(info);

    const btnContainer = document.createElement('div');
    btnContainer.className = 'page-numbers-container';

    // Prev Button
    const prev = document.createElement('button');
    prev.className = 'pg-btn';
    prev.innerText = '← Prev';
    prev.disabled = currentPage === 1;
    prev.onclick = () => { currentPage--; displayMovies(true); window.scrollTo(0,0); };
    btnContainer.appendChild(prev);

    // Dynamic Numbers (Grouped)
    let startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
    let endPage = Math.min(startPage + 9, totalPages);

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = `pg-btn ${i === currentPage ? 'active' : ''}`;
        btn.innerText = i;
        btn.onclick = () => { currentPage = i; displayMovies(true); window.scrollTo(0,0); };
        btnContainer.appendChild(btn);
    }

    // Next Group / Skip to next 10s
    if (endPage < totalPages) {
        const nextGroup = document.createElement('button');
        nextGroup.className = 'pg-btn';
        nextGroup.innerText = 'Next »';
        nextGroup.onclick = () => { currentPage = endPage + 1; displayMovies(true); window.scrollTo(0,0); };
        btnContainer.appendChild(nextGroup);
    }

    // Final Page shortcut
    if (totalPages > endPage) {
        const last = document.createElement('button');
        last.className = 'pg-btn';
        last.innerText = totalPages;
        last.onclick = () => { currentPage = totalPages; displayMovies(true); window.scrollTo(0,0); };
        btnContainer.appendChild(last);
    }

    container.appendChild(btnContainer);
}

function openDetails(movie) {
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
    history.back();
}

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    filteredMovies = allMovies.filter(m => m.title.toLowerCase().includes(query));
    currentPage = 1;
    displayMovies(true);
}

function toggleMenu() {
    const menu = document.getElementById("sideMenu");
    menu.style.width = (menu.style.width === "280px") ? "0px" : "280px";
}

function shareWebsite() {
    const shareUrl = window.location.origin + window.location.pathname + '?page=' + currentPage;
    if (navigator.share) {
        navigator.share({ title: 'My Movies Fun', url: shareUrl });
    } else {
        alert("Link copied: " + shareUrl);
    }
}

// Initial Load
loadCategory('movies_data.json');
