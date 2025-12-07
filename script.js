document.addEventListener('DOMContentLoaded', () => {
    shuffleGrid('.grid-container');
    initPublicationFilters();
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

    const filters = [
        { key: 'type', buttonId: 'filter-button-type', dropdownId: 'filter-dropdown-type', labelId: 'current-filter-type' },
        { key: 'year', buttonId: 'filter-button-year', dropdownId: 'filter-dropdown-year', labelId: 'current-filter-year' },
    ];

    const activeFilters = filters.reduce((acc, { key }) => ({ ...acc, [key]: 'all' }), {});

    const closeAllDropdowns = () => {
        filters.forEach(({ dropdownId }) => {
            const dropdown = document.getElementById(dropdownId);
            if (dropdown) dropdown.classList.add('hidden');
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

    const applyFilters = () => {
        listItems.forEach(item => {
            const typeMatch = activeFilters.type === 'all' || item.dataset.type === activeFilters.type;
            const yearMatch = activeFilters.year === 'all' || item.dataset.year === activeFilters.year;
            item.style.display = typeMatch && yearMatch ? '' : 'none';
        });
    };

    filters.forEach(({ key, buttonId, dropdownId, labelId }) => {
        const button = document.getElementById(buttonId);
        const dropdown = document.getElementById(dropdownId);
        const label = document.getElementById(labelId);
        if (!button || !dropdown || !label) return;

        button.addEventListener('click', event => {
            event.stopPropagation();
            const wasHidden = dropdown.classList.contains('hidden');
            closeAllDropdowns();
            if (wasHidden) dropdown.classList.remove('hidden');
        });

        dropdown.querySelectorAll('.filter-option').forEach(option => {
            option.addEventListener('click', event => {
                event.stopPropagation();
                const selected = option.dataset.filter || 'all';
                activeFilters[key] = selected;
                label.textContent = selected === 'all' ? 'All' : selected;
                updateButtonClass(button, selected);
                closeAllDropdowns();
                applyFilters();
            });
        });

        updateButtonClass(button, 'all');
    });

    document.addEventListener('click', event => {
        if (filterContainer && !filterContainer.contains(event.target)) {
            closeAllDropdowns();
        }
    });

    applyFilters();
}

// 言語切り替え時のスクロール位置保存
document.querySelectorAll('a[href="/"], a[href="/en/"]').forEach(link => {
    link.addEventListener('click', function(e) {
        sessionStorage.setItem('scrollPosition', window.scrollY);
    });
});

// ページ読み込み時にスクロール位置を復元
window.addEventListener('load', function() {
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition !== null) {
        window.scrollTo(0, parseInt(scrollPosition));
        sessionStorage.removeItem('scrollPosition');
    }
});