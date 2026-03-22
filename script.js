/* ==========================================================================
   TRMNL Plugin Portfolio — Script
   Loads data/recipes.json, renders cards, handles filtering + theme toggle.
   ========================================================================== */

(function () {
  'use strict';

  const DATA_URL = 'data/recipes.json';

  // DOM refs
  const heroStats = document.getElementById('heroStats');
  const filterBar = document.getElementById('filterBar');
  const pluginGrid = document.getElementById('pluginGrid');
  const gridEmpty = document.getElementById('gridEmpty');
  const themeToggle = document.getElementById('themeToggle');

  // ---- Theme ----

  function getPreferredTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  applyTheme(getPreferredTheme());

  themeToggle.addEventListener('click', function () {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');    themeToggle.classList.remove('is-spinning');
    void themeToggle.offsetWidth; // restart animation
    themeToggle.classList.add('is-spinning');
  });

  themeToggle.addEventListener('animationend', function () {
    themeToggle.classList.remove('is-spinning');  });

  // Listen for system changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ---- Helpers ----

  /** Strip HTML tags for plain text display */
  function stripHtml(html) {
    var tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  /** Format date to "Mon YYYY" */
  function formatDate(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  /** Extract unique categories from all plugins */
  function extractCategories(plugins) {
    var catSet = new Set();
    plugins.forEach(function (p) {
      var cats = (p.author_bio && p.author_bio.category) || '';
      cats.split(',').forEach(function (c) {
        var trimmed = c.trim();
        if (trimmed) catSet.add(trimmed);
      });
    });
    // Sort alphabetically
    return Array.from(catSet).sort();
  }

  /** Build the TRMNL recipe install URL */
  function recipeUrl(id) {
    return 'https://trmnl.com/recipes/' + id;
  }

  // ---- SVG icons (inline, avoids external dependencies) ----

  var ICONS = {
    download: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    fork: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"/><path d="M12 12v3"/></svg>'
  };

  // ---- Render functions ----

  function renderStats(plugins) {
    var totalInstalls = 0;
    var totalForks = 0;
    plugins.forEach(function (p) {
      totalInstalls += (p.stats && p.stats.installs) || 0;
      totalForks += (p.stats && p.stats.forks) || 0;
    });

    heroStats.innerHTML =
      '<div class="stat"><span class="stat__number" data-target="' + plugins.length + '">0</span><span class="stat__label">plugins</span></div>' +
      '<div class="stat"><span class="stat__number" data-target="' + totalInstalls + '">0</span><span class="stat__label">installs</span></div>' +
      '<div class="stat"><span class="stat__number" data-target="' + totalForks + '">0</span><span class="stat__label">forks</span></div>';

    // Animate counters after hero entrance (skip if reduced motion)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      heroStats.querySelectorAll('.stat__number[data-target]').forEach(function (el) {
        el.textContent = el.getAttribute('data-target');
      });
    } else {
      setTimeout(animateStatCounters, 320);
    }
  }

  function animateStatCounters() {
    heroStats.querySelectorAll('.stat__number[data-target]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var duration = 700;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    });
  }

  function renderFilters(categories) {
    var html = '<button class="filter-btn" aria-pressed="true" data-category="all">All</button>';
    categories.forEach(function (cat) {
      var label = cat.charAt(0).toUpperCase() + cat.slice(1);
      html += '<button class="filter-btn" aria-pressed="false" data-category="' + cat + '">' + label + '</button>';
    });
    filterBar.innerHTML = html;

    // Bind clicks
    filterBar.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setActiveFilter(btn.getAttribute('data-category'));
      });
    });
  }

  function renderCard(plugin) {
    var bio = plugin.author_bio || {};
    // Even though css limits the description to 3 lines, we should also truncate 
    // the text here to avoid excessively long descriptions breaking the layout 
    var desc = stripHtml(bio.description || '').substring(0, 200);
    var categories = (bio.category || '').split(',').map(function (c) { return c.trim(); }).filter(Boolean);
    var installs = (plugin.stats && plugin.stats.installs) || 0;
    var forks = (plugin.stats && plugin.stats.forks) || 0;

    var tagsHtml = categories.map(function (c) {
      return '<button type="button" class="tag" data-category="' + c + '">' + c.charAt(0).toUpperCase() + c.slice(1) + '</button>';
    }).join('');

    var actionsHtml =
      '<a class="card-link card-link--primary" href="' + recipeUrl(plugin.id) + '" target="_blank" rel="noopener noreferrer">Install</a>';
    if (bio.github_url) {
      actionsHtml += '<a class="card-link card-link--secondary" href="' + bio.github_url + '" target="_blank" rel="noopener noreferrer">GitHub</a>';
    }
    if (bio.learn_more_url) {
      actionsHtml += '<a class="card-link card-link--secondary" href="' + bio.learn_more_url + '" target="_blank" rel="noopener noreferrer">Docs</a>';
    }

    var card = document.createElement('article');
    card.className = 'plugin-card';
    card.setAttribute('data-categories', categories.join(','));

    card.innerHTML =
      '<div class="plugin-card__screenshot">' +
        (plugin.screenshot_url
          ? '<img src="' + plugin.screenshot_url + '" alt="Screenshot of ' + plugin.name + ' plugin" loading="lazy">'
          : '') +
      '</div>' +
      '<div class="plugin-card__body">' +
        '<div class="plugin-card__header">' +
          (plugin.icon_url
            ? '<img class="plugin-card__icon" src="' + plugin.icon_url + '" alt="" loading="lazy">'
            : '') +
          '<h2 class="plugin-card__name">' + plugin.name + '</h2>' +
        '</div>' +
        '<p class="plugin-card__desc">' + desc + '</p>' +
        '<div class="plugin-card__tags">' + tagsHtml + '</div>' +
        '<div class="plugin-card__meta">' +
          '<span class="plugin-card__stat">' + ICONS.download + ' ' + installs + '</span>' +
          '<span class="plugin-card__stat">' + ICONS.fork + ' ' + forks + '</span>' +
          '<span class="plugin-card__date">' + formatDate(plugin.published_at) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="plugin-card__actions">' + actionsHtml + '</div>';

    return card;
  }

  function renderGrid(plugins) {
    pluginGrid.innerHTML = '';
    plugins.forEach(function (p, i) {
      var card = renderCard(p);
      card.style.animationDelay = (i * 60) + 'ms';
      pluginGrid.appendChild(card);
    });

    observeCards();
  }

  // Delegate tag clicks to filter (bound once, not per render)
  pluginGrid.addEventListener('click', function (e) {
    var tag = e.target.closest('.tag[data-category]');
    if (tag) setActiveFilter(tag.getAttribute('data-category'));
  });

  // ---- Filtering ----

  var currentFilter = 'all';

  function setActiveFilter(category) {
    currentFilter = category;

    // Update button states
    filterBar.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.getAttribute('data-category') === category ? 'true' : 'false');
    });

    // Filter cards
    var cards = pluginGrid.querySelectorAll('.plugin-card');
    var visibleCount = 0;

    cards.forEach(function (card) {
      var cardCats = card.getAttribute('data-categories').split(',');
      var show = category === 'all' || cardCats.indexOf(category) !== -1;
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    gridEmpty.hidden = visibleCount > 0;

    // Highlight matching tags in cards
    pluginGrid.querySelectorAll('.tag').forEach(function (tag) {
      tag.classList.toggle('is-active', tag.getAttribute('data-category') === category);
    });
  }

  // ---- Intersection Observer for entrance animations ----

  function observeCards() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all immediately
      pluginGrid.querySelectorAll('.plugin-card').forEach(function (card) {
        card.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    pluginGrid.querySelectorAll('.plugin-card').forEach(function (card) {
      observer.observe(card);
    });
  }

  // ---- Service Worker (image cache) ----

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }

  // ---- Console easter egg ----
  console.log(
    '%c\u2B1B TRMNL Plugins',
    'font-size: 14px; font-weight: bold; color: #F8654B;'
  );
  console.log(
    '%cPure HTML, CSS & JS \u2014 no frameworks.\nhttps://github.com/hossain-khan/trmnl.hossainkhan.com',
    'font-size: 11px; color: #888;'
  );

  // ---- Init ----

  fetch(DATA_URL)
    .then(function (res) {
      if (!res.ok) throw new Error('Failed to load plugin data');
      return res.json();
    })
    .then(function (json) {
      var plugins = json.data || [];

      // Sort by published date (newest first)
      plugins.sort(function (a, b) {
        return new Date(b.published_at) - new Date(a.published_at);
      });

      renderStats(plugins);
      renderFilters(extractCategories(plugins));
      renderGrid(plugins);
    })
    .catch(function (err) {
      console.error('Error loading plugins:', err);
      pluginGrid.innerHTML = '<p class="grid-empty">Unable to load plugins. Please try again later.</p>';
    });

})();
