document.addEventListener('DOMContentLoaded', () => {
    // Фильтры
    const filters = document.querySelectorAll('.filter');
    const cards = document.querySelectorAll('.plot-card');
    filters.forEach(f => {
        f.addEventListener('click', () => {
            filters.forEach(ff => ff.classList.remove('active'));
            f.classList.add('active');
            const filter = f.dataset.filter;
            cards.forEach(c => {
                if (filter === 'all' || c.dataset.size === filter) c.style.display = 'block';
                else c.style.display = 'none';
            });
        });
    });

    // Модалка
    const modal = document.getElementById('plot-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const modalPrice = document.getElementById('modal-price');
    const close = document.querySelector('.close');

    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.plot-card');
            modalImg.src = card.querySelector('img').src;
            modalTitle.textContent = card.querySelector('h3').textContent;
            modalText.textContent = card.querySelector('p:nth-of-type(2)').textContent + '. ' + card.querySelector('p:nth-of-type(1)').textContent;
            modalPrice.textContent = card.querySelector('.price').textContent;
            modal.style.display = 'flex';
        });
    });

    close.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

    // Зум фото в модалке
    modalImg.onclick = () => modalImg.classList.toggle('zoomed');
});