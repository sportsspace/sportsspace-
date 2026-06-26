// ===== HAMBURGER MENU =====
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger) {
    hamburger.addEventListener('click', function() {
      navLinks.classList.toggle('open');
    });
  }

  // Load articles
  loadArticles();
});

// ===== LOAD ARTICLES FROM JSON =====
async function loadArticles() {
  try {
    // Try to load from articles.json
    const response = await fetch('/articles.json');
    if (response.ok) {
      const articles = await response.json();
      renderArticles(articles);
      console.log('✅ Articles loaded from articles.json');
      return;
    }
    throw new Error('articles.json not found');
  } catch (error) {
    console.log('⚠️ Using fallback articles');
    loadFallbackArticles();
  }
}

// ===== RENDER ARTICLES =====
function renderArticles(articles) {
  const grid = document.getElementById('article-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  
  // Show latest 6 articles
  const latest = articles.slice(0, 6);
  latest.forEach(article => {
    const card = document.createElement('article');
    card.className = 'news-card';
    card.innerHTML = `
      <div class="card-img">
        <i class="fas fa-newspaper fa-4x"></i>
        <span class="cat-tag">${article.category || 'Sports'}</span>
      </div>
      <div class="card-body">
        <h3>${article.title}</h3>
        <p>${article.excerpt || article.body.substring(0, 120) + '...'}</p>
        <div class="card-footer">
          <span><i class="fas fa-clock"></i> ${timeAgo(new Date(article.date))}</span>
          <span class="author"><i class="fas fa-user"></i> ${article.author}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  
  // Update hero with latest article
  if (articles.length > 0) {
    const hero = articles[0];
    const heroTitle = document.getElementById('hero-title');
    const heroExcerpt = document.getElementById('hero-excerpt');
    const heroAuthor = document.getElementById('hero-author');
    const heroDate = document.getElementById('hero-date');
    
    if (heroTitle) heroTitle.textContent = hero.title;
    if (heroExcerpt) heroExcerpt.textContent = hero.excerpt || hero.body.substring(0, 150) + '...';
    if (heroAuthor) heroAuthor.innerHTML = `<i class="fas fa-user-edit"></i> by ${hero.author}`;
    if (heroDate) heroDate.innerHTML = `<i class="fas fa-clock"></i> ${timeAgo(new Date(hero.date))}`;
  }
  
  // Update featured list
  const featuredList = document.getElementById('featured-list');
  if (featuredList && articles.length > 1) {
    featuredList.innerHTML = '';
    articles.slice(1, 4).forEach(article => {
      const item = document.createElement('div');
      item.className = 'big-news-item';
      item.innerHTML = `
        <h4>${article.title}</h4>
        <p>${article.excerpt || article.body.substring(0, 100) + '...'}</p>
        <div class="meta"><i class="fas fa-user"></i> ${article.author} · ${timeAgo(new Date(article.date))}</div>
      `;
      featuredList.appendChild(item);
    });
  }
}

// ===== TIME AGO HELPER =====
function timeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

// ===== FALLBACK CONTENT =====
function loadFallbackArticles() {
  const fallback = [
    {
      title: 'Mega trade shakes up the league',
      category: 'Basketball',
      author: 'Marc Stein',
      date: new Date().toISOString(),
      excerpt: 'In a blockbuster 5-team deal, the reigning scoring champion heads to the Lakers.'
    },
    {
      title: 'Champions League: Underdogs stun favourites',
      category: 'Football',
      author: 'Sam Lee',
      date: new Date(Date.now() - 3600000 * 4).toISOString(),
      excerpt: 'Late drama at the Bernabéu as the visitors snatch a last-minute winner.'
    },
    {
      title: 'Rookie sensation drops 40 points in playoff debut',
      category: 'Basketball',
      author: 'Shams C.',
      date: new Date(Date.now() - 3600000 * 6).toISOString(),
      excerpt: 'The 19-year-old phenom broke franchise records with an unforgettable performance.'
    }
  ];
  renderArticles(fallback);
}