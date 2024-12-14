document.addEventListener('DOMContentLoaded', function () {
    const radios = document.querySelectorAll('input[type="radio"]');

    radios.forEach(radio => {
        radio.addEventListener('change', function () {
            const country = this.name;
            const status = this.value;
            colorCountry(country, status);
        });
    });

    function colorCountry(country, status) {
        fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
            .then(response => response.json())
            .then(data => {
                L.geoJSON(data, {
                    filter: function (feature) {
                        return feature.properties.name === country;
                    },
                    style: function (feature) {
                        return { color: "#000", weight: 1, className: status, fillOpacity: 1 };
                    }
                }).addTo(map);
            });
    }
});

// 地図を初期化
var map = L.map('map').setView([20, 0], 2);

// 国の境界データを取得して表示
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function (feature) {
                return { color: "#000", weight: 1, fillColor: "#fff", fillOpacity: 1 };
            }
        }).addTo(map);
    });
