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
document.addEventListener("DOMContentLoaded", () => {
    // グリッドコンテナとその子要素（画像コンテナ）を取得
    const gridContainer = document.querySelector(".grid-container");
    const imageContainers = Array.from(gridContainer.children);

    // 子要素をランダムにシャッフルする
    const shuffledContainers = imageContainers.sort(() => Math.random() - 0.5);

    // シャッフルされた要素をグリッドコンテナに再追加
    shuffledContainers.forEach(container => gridContainer.appendChild(container));
});
