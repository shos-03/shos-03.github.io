document.addEventListener("DOMContentLoaded", () => {
    // グリッドコンテナとその子要素（画像コンテナ）を取得
    const gridContainer = document.querySelector(".grid-container");
    const imageContainers = Array.from(gridContainer.children);

    // 子要素をランダムにシャッフルする
    const shuffledContainers = imageContainers.sort(() => Math.random() - 0.5);

    // シャッフルされた要素をグリッドコンテナに再追加
    shuffledContainers.forEach(container => gridContainer.appendChild(container));
});

document.addEventListener('DOMContentLoaded', function() {
    const filterButton = document.getElementById('filter-button');
    const filterDropdown = document.getElementById('filter-dropdown');

    filterButton.addEventListener('click', function(e) {
        e.stopPropagation(); // クリックイベントのバブリングを防止
        filterDropdown.classList.toggle('hidden');
    });

    // ドロップダウン外をクリックしたら非表示にする処理
    document.addEventListener('click', function(e) {
        if (!document.querySelector('.filter-container').contains(e.target)) {
            filterDropdown.classList.add('hidden');
        }
    });
});