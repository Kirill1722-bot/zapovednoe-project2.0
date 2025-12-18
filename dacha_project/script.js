document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modal-image');
    const modalDesc = document.getElementById('modal-description');
    const close = document.querySelector('.close');
    const cards = document.querySelectorAll('.house-card');
    const filters = document.querySelectorAll('.filter');
    const grid = document.querySelector('.houses-grid');

    const houses = [
        { id: 1, img: 'images/gal.jpg', desc: '<h2>Галич №76</h2><p>Дом под усадку 135 кв.м. +15 соток = 2 450 000 руб.</p><p>Полное описание из ТЗ...</p>' },
        { id: 2, img: 'images/zod.jpg', desc: '<h2>Зодчий №61</h2><p>Дом под усадку 144 кв. м. +15 соток = 2 050 000</p><p>Полное описание...</p>' },
        { id: 3, img: 'images/rub.jpg', desc: '<h2>Рублевка №59</h2><p>Дом под усадку 192кв.м. +15 соток =2 100 000</p><p>Полное описание...</p>' },
        { id: 4, img: 'images/mos.jpg', desc: '<h2>Москва №51</h2><p>Дом под усадку 160 кв.м. +15 соток = 2 400 000</p><p>Полное описание...</p>' },
        { id: 5, img: 'images/kos.jpg', desc: '<h2>Кострома №53</h2><p>Дом под усадку 162 кв.м. +15 соток =2 400 000</p><p>Полное описание...</p>' },
        { id: 6, img: 'images/nog.jpg', desc: '<h2>Ногинск №57</h2><p>Дом под усадку 108кв.м. +15 соток =1 950 000</p><p>Полное описание...</p>' },
        { id: 7, img: 'images/001.jpg', desc: '<h2>КД 001</h2><p>Общая площадь дома 178,4 м2</p><p>Небольшой загородный дом из клееного бруса...</p>' },
        { id: 8, img: 'images/003.jpg', desc: '<h2>КД 003</h2><p>Общая площадь дома 142,2 м2</p><p>Средних размеров двухэтажный дом...</p>' }
    ];

    // Фильтры и сортировка
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');

            let filteredCards = Array.from(cards);

            const filterType = filter.dataset.filter;
            const sortType = filter.dataset.sort;

            if (filterType && filterType !== 'all') {
                filteredCards = filteredCards.filter(card => card.dataset.size === filterType);
            }

            if (sortType) {
                filteredCards.sort((a, b) => {
                    const priceA = parseInt(a.dataset.price) || 999999999;
                    const priceB = parseInt(b.dataset.price) || 999999999;
                    return sortType === 'price-asc' ? priceA - priceB : priceB - priceA;
                });
            }

            grid.innerHTML = '';
            filteredCards.forEach(card => grid.appendChild(card));
        });
    });

    // Модалка
    cards.forEach(card => {
        card.querySelector('button').addEventListener('click', () => {
            const id = parseInt(card.dataset.houseId);
            const house = houses.find(h => h.id === id);
            if (house) {
                modalImage.src = house.img;
                modalDesc.innerHTML = house.desc;
                modal.style.display = 'flex';
            }
        });
    });

    close.onclick = () => { modal.style.display = 'none'; };
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
    modalImage.onclick = () => modalImage.classList.toggle('zoomed');

    // Яндекс карта
    ymaps.ready(() => {
        const map = new ymaps.Map('map', { center: [55.7558, 37.6173], zoom: 10 });
        const targetAddress = "Московская область, Клинский район, СНТ Мичуринец, 1-я линия, 13";

        ymaps.geocode(targetAddress).then(res => {
            const coords = res.geoObjects.get(0).geometry.getCoordinates();
            map.geoObjects.add(new ymaps.Placemark(coords, { balloonContent: 'Заповедное' }, { preset: 'islands#greenDotIcon' }));
            map.setCenter(coords, 14);

            ymaps.geolocation.get({ provider: 'browser' }).then(userRes => {
                const userCoords = userRes.geoObjects.position;
                map.geoObjects.add(new ymaps.Placemark(userCoords, { balloonContent: 'Вы здесь' }, { preset: 'islands#blueDotIcon' }));

                ymaps.route([userCoords, coords]).then(route => {
                    const distance = (route.getLength() / 1000).toFixed(1);
                    document.getElementById('distance').innerText = `Расстояние до Заповедного: ${distance} км`;
                });
            }).catch(() => {
                document.getElementById('distance').innerText = 'Не удалось определить ваше местоположение';
            });
        });
    });
});