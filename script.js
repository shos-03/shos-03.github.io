document.addEventListener('DOMContentLoaded', () => {
    shuffleGrid('.grid-container');
    loadExternalContent().then(() => {
        initPublicationFilters();
        initNewsToggle();
    });
});

function shuffleGrid(selector) {
    const gridContainer = document.querySelector(selector);
    if (!gridContainer) return;

    const imageContainers = Array.from(gridContainer.children);
    imageContainers
        .sort(() => Math.random() - 0.5)
        .forEach(container => gridContainer.appendChild(container));
}

function initPublicationFilters() {
    const publicationsList = document.getElementById('publications-list');
    if (!publicationsList) return;

    const filterContainer = document.querySelector('.filter-container');
    const listItems = Array.from(publicationsList.querySelectorAll('li'));

    // defaultLabel を持たせる
    const filters = [
        { key: 'type', buttonId: 'filter-button-type', dropdownId: 'filter-dropdown-type', defaultLabel: 'TYPE' },
        { key: 'year', buttonId: 'filter-button-year', dropdownId: 'filter-dropdown-year', defaultLabel: 'YEAR' },
    ];

    // Reviewed トグル（dropdownなし）
    const reviewToggleButton = document.getElementById('filter-button-review');
    let reviewOnly = false;

    const activeFilters = filters.reduce((acc, { key }) => ({ ...acc, [key]: 'all' }), {});

    const closeAllDropdowns = () => {
        filters.forEach(({ buttonId, dropdownId }) => {
            const dropdown = document.getElementById(dropdownId);
            const button = document.getElementById(buttonId);
            if (dropdown) dropdown.classList.add('hidden');
            if (button) button.classList.remove('open');
        });
    };

    const updateButtonClass = (button, filter) => {
        if (!button) return;
        if (filter === 'all') {
            button.classList.add('all');
        } else {
            button.classList.remove('all');
        }
    };

    // 「all」ならデフォルト名、選択時は選択名のみを表示
    const setFilterButtonLabel = (button, defaultLabel, value) => {
        if (!button) return;
        button.textContent = value === 'all' ? defaultLabel : value;
    };

    const applyFilters = () => {
        listItems.forEach(item => {
            const typeMatch = activeFilters.type === 'all' || item.dataset.type === activeFilters.type;
            const yearMatch = activeFilters.year === 'all' || item.dataset.year === activeFilters.year;
            const reviewMatch = !reviewOnly || item.dataset.review === 'Reviewed';
            item.style.display = typeMatch && yearMatch && reviewMatch ? '' : 'none';
        });
    };

    filters.forEach(({ key, buttonId, dropdownId, defaultLabel }) => {
        const button = document.getElementById(buttonId);
        const dropdown = document.getElementById(dropdownId);
        if (!button || !dropdown) return;

        // 初期ラベル
        setFilterButtonLabel(button, defaultLabel, 'all');
        updateButtonClass(button, 'all');

        button.addEventListener('click', event => {
            event.stopPropagation();
            const wasHidden = dropdown.classList.contains('hidden');
            closeAllDropdowns();
            if (wasHidden) {
                dropdown.classList.remove('hidden');
                button.classList.add('open');
            }
        });

        dropdown.querySelectorAll('.filter-option').forEach(option => {
            option.addEventListener('click', event => {
                event.stopPropagation();
                const selected = option.dataset.filter || 'all';
                activeFilters[key] = selected;
                setFilterButtonLabel(button, defaultLabel, selected);
                updateButtonClass(button, selected);
                closeAllDropdowns();
                applyFilters();
            });
        });
    });

    document.addEventListener('click', event => {
        if (filterContainer && !filterContainer.contains(event.target)) {
            closeAllDropdowns();
        }
    });

    applyFilters();

    if (reviewToggleButton) {
        reviewToggleButton.addEventListener('click', () => {
            reviewOnly = !reviewOnly;
            reviewToggleButton.classList.toggle('active', reviewOnly);
            reviewToggleButton.classList.toggle('inactive', !reviewOnly);
            reviewToggleButton.setAttribute('aria-pressed', String(reviewOnly));
            applyFilters();
        });
        // 初期状態はOFF（None）なので灰色に
        reviewToggleButton.classList.add('inactive');
    }
}

function initNewsToggle() {
    const newsSection = document.getElementById('news');
    if (!newsSection) return;

    const newsItems = Array.from(newsSection.querySelectorAll('.news-grid'));
    const toggleButton = newsSection.querySelector('.filter-button');
    const visibleCount = 3;
    const labelText = 'SHOW ALL';

    if (!toggleButton || newsItems.length <= visibleCount) {
        if (toggleButton) toggleButton.classList.add('is-hidden');
        return;
    }

    newsItems.slice(visibleCount).forEach(item => item.classList.add('is-hidden'));

    let showAll = false;
    toggleButton.classList.add('inactive');
    toggleButton.textContent = labelText;
    toggleButton.setAttribute('aria-pressed', 'false');

    const updateNewsVisibility = () => {
        if (showAll) {
            newsItems.forEach(item => item.classList.remove('is-hidden'));
        } else {
            newsItems.forEach((item, index) => {
                item.classList.toggle('is-hidden', index >= visibleCount);
            });
        }
    };

    toggleButton.addEventListener('click', () => {
        showAll = !showAll;
        toggleButton.classList.toggle('active', showAll);
        toggleButton.classList.toggle('inactive', !showAll);
        toggleButton.setAttribute('aria-pressed', String(showAll));
        toggleButton.textContent = labelText;
        updateNewsVisibility();
    });
}

function loadExternalContent() {
    const loadTargets = [
        { selector: '#news-items', url: '/news.html' },
        { selector: '#publications-list', url: '/publications.html' },
    ];

    return Promise.all(loadTargets.map(({ selector, url }) => loadHtmlInto(selector, url)))
        .then(() => {
            applyLangEnToAlnum(document.getElementById('news'));
            applyLangEnToAlnum(document.getElementById('publications'));
            updatePublicationCounter();
        })
        .catch(error => {
            console.warn('Failed to load external content:', error);
        });
}

function loadHtmlInto(selector, url) {
    const target = document.querySelector(selector);
    if (!target) return Promise.resolve();

    return fetch(url, { cache: 'no-store' })
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${url}`);
            return response.text();
        })
        .then(html => {
            target.innerHTML = html;
        });
}

function applyLangEnToAlnum(root) {
    if (!root) return;

    const blockedTags = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'SVG']);
    const englishPattern = /[A-Za-z0-9]+(?:[A-Za-z0-9 .,/()&+:-]*[A-Za-z0-9])?/g;
    const englishTest = /[A-Za-z0-9]+(?:[A-Za-z0-9 .,/()&+:-]*[A-Za-z0-9])?/;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            if (blockedTags.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
            if (hasLangEnAncestor(parent, root)) return NodeFilter.FILTER_REJECT;
            if (!node.nodeValue || !englishTest.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
        },
    });

    const nodes = [];
    while (walker.nextNode()) {
        nodes.push(walker.currentNode);
    }

    nodes.forEach(node => wrapEnglishText(node, englishPattern));
}

function hasLangEnAncestor(element, root) {
    let current = element;
    while (current && current !== root) {
        if (current.getAttribute('lang') === 'en') return true;
        current = current.parentElement;
    }
    return false;
}

function wrapEnglishText(node, pattern) {
    const text = node.nodeValue;
    if (!text) return;

    pattern.lastIndex = 0;
    const fragments = document.createDocumentFragment();
    let lastIndex = 0;
    let match = null;

    while ((match = pattern.exec(text)) !== null) {
        const matchText = match[0];
        const startIndex = match.index;
        const endIndex = startIndex + matchText.length;

        if (startIndex > lastIndex) {
            fragments.appendChild(document.createTextNode(text.slice(lastIndex, startIndex)));
        }

        const span = document.createElement('span');
        span.setAttribute('lang', 'en');
        span.textContent = matchText;
        fragments.appendChild(span);

        lastIndex = endIndex;
    }

    if (lastIndex < text.length) {
        fragments.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    node.parentNode.replaceChild(fragments, node);
}

function updatePublicationCounter() {
    const list = document.getElementById('publications-list');
    if (!list) return;

    const items = list.querySelectorAll('li');
    list.style.setProperty('--list-count', String(items.length + 1));
}
