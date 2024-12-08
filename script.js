function filterPhotosByYear() {
    const year = document.getElementById('year-select').value;
    const containers = document.querySelectorAll('.image-container');

    containers.forEach(container => {
        if (year === 'all' || container.getAttribute('data-year') === year) {
            container.style.display = '';
        } else {
            container.style.display = 'none';
        }
    });
}