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

    // defaultLabel を持たせる
    const filters = [
        { key: 'type', buttonId: 'filter-button-type', dropdownId: 'filter-dropdown-type', defaultLabel: 'Type' },
        { key: 'year', buttonId: 'filter-button-year', dropdownId: 'filter-dropdown-year', defaultLabel: 'Year' },
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
