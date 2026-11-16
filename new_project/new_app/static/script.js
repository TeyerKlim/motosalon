let allMotorcycles = [], allAccessories = [];
let favorites = JSON.parse(localStorage.getItem('moto_favs')) || [];

const DEFAULT_MOTO_IMG = '/static/images/default_moto.jpg';
const DEFAULT_ACC_IMG = '/static/images/default_acc.jpg';

const FALLBACK_IMG = (() => {
    const c = document.createElement('canvas');
    c.width = 400; c.height = 250;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#e0e0e0'; ctx.fillRect(0, 0, 400, 250);
    ctx.fillStyle = '#666'; ctx.font = '18px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('Нет фото', 200, 125);
    return c.toDataURL();
})();

document.addEventListener('DOMContentLoaded', () => {
    updateFavCount();
    loadData();
});

async function loadData() {
    try {
        const [mRes, aRes] = await Promise.all([fetch('/api/motorcycles/'), fetch('/api/accessories/')]);
        allMotorcycles = await mRes.json();
        allAccessories = await aRes.json();
        renderCatalog('motorcycles-list', allMotorcycles, 'moto', DEFAULT_MOTO_IMG, true);
        renderCatalog('accessories-list', allAccessories, 'acc', DEFAULT_ACC_IMG, false);
        fillOrderSelect(allMotorcycles);
    } catch (e) {
        document.getElementById('motorcycles-list').textContent = 'Ошибка загрузки каталога.';
    }
}

function renderCatalog(id, items, prefix, defImg, isMoto) {
    const list = document.getElementById(id);
    list.innerHTML = '';
    if (!items.length) { list.textContent = 'Ничего не найдено.'; return; }

    items.forEach(item => {
        const title = isMoto ? item.model : item.name;
        const favKey = prefix + '_' + item.id;
        const isFav = favorites.some(f => f.key === favKey);

        const card = document.createElement('div'); card.className = 'card';
        const imgWrap = document.createElement('div'); imgWrap.className = 'card-img-wrap';
        const img = document.createElement('img');
        img.src = item.image || defImg; img.alt = title;
        img.onerror = function() { this.onerror = null; this.src = FALLBACK_IMG; };

        const heart = document.createElement('button');
        heart.type = 'button';
        heart.className = 'heart-btn' + (isFav ? ' active' : '');
        heart.textContent = '♥';
        heart.onclick = () => toggleFav(favKey, title, item.price);
        imgWrap.append(img, heart);

        const body = document.createElement('div'); body.className = 'card-body';
        const h3 = document.createElement('h3'); h3.textContent = title;
        const p = document.createElement('p'); p.className = 'price'; p.textContent = item.price.toLocaleString() + ' руб.';
        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'btn-orange card-btn'; btn.textContent = 'Подробнее';
        btn.onclick = () => openProductDetail(item, isMoto);

        body.append(h3, p, btn);
        card.append(imgWrap, body);
        list.appendChild(card);
    });
}

function openProductDetail(item, isMoto) {
    const title = isMoto ? item.model : item.name;
    const favKey = (isMoto ? 'moto_' : 'acc_') + item.id;
    document.getElementById('detail-title').textContent = title;

    const dImg = document.getElementById('detail-img');
    dImg.src = item.image || (isMoto ? DEFAULT_MOTO_IMG : DEFAULT_ACC_IMG);
    dImg.onerror = function() { this.onerror = null; this.src = FALLBACK_IMG; };

    document.getElementById('detail-desc').textContent = item.description || (isMoto
        ? 'Надёжный и мощный мотоцикл, готовый к городским поездкам и дальним путешествиям.'
        : 'Качественная мотоэкипировка и аксессуары для максимальной безопасности и комфорта.');
    document.getElementById('detail-price').textContent = item.price.toLocaleString() + ' руб.';

    const specs = document.getElementById('detail-specs-list');
    specs.innerHTML = '';
    (isMoto ? ['Гарантия от салона 2 года', 'Полная предпродажная подготовка', 'Оригинальный ПТС в наличии']
            : ['Высокое качество материалов', 'Сертификация безопасности', 'Гарантия производителя'])
        .forEach(t => { const li = document.createElement('li'); li.textContent = t; specs.appendChild(li); });

    document.getElementById('detail-order-btn').onclick = () => {
        closeProductDetail();
        if (isMoto) document.getElementById('order-moto').value = item.id;
        document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
    };

    const favBtn = document.getElementById('detail-fav-btn');
    const syncFavBtn = () => favBtn.textContent = favorites.some(f => f.key === favKey) ? '♥ В избранном' : '♥ Добавить в избранное';
    syncFavBtn();
    favBtn.onclick = () => { toggleFav(favKey, title, item.price); syncFavBtn(); };

    document.getElementById('home-view').classList.add('hidden');
    document.getElementById('product-detail').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeProductDetail() {
    document.getElementById('product-detail').classList.add('hidden');
    document.getElementById('home-view').classList.remove('hidden');
}

function fillOrderSelect(items) {
    const sel = document.getElementById('order-moto');
    sel.innerHTML = '<option value="">Выберите мотоцикл...</option>';
    items.forEach(i => {
        const opt = document.createElement('option');
        opt.value = i.id; opt.textContent = `${i.model} (${i.price.toLocaleString()} руб.)`;
        sel.appendChild(opt);
    });
}

document.getElementById('search-form').onsubmit = e => { e.preventDefault(); filterCatalog(); };
document.getElementById('search-input').oninput = filterCatalog;

function filterCatalog() {
    const q = document.getElementById('search-input').value.toLowerCase().trim();
    renderCatalog('motorcycles-list', allMotorcycles.filter(m => m.model.toLowerCase().includes(q)), 'moto', DEFAULT_MOTO_IMG, true);
    renderCatalog('accessories-list', allAccessories.filter(a => a.name.toLowerCase().includes(q)), 'acc', DEFAULT_ACC_IMG, false);
}

function toggleFav(key, title, price) {
    const idx = favorites.findIndex(f => f.key === key);
    if (idx !== -1) favorites.splice(idx, 1);
    else favorites.push({ key, title, price });
    localStorage.setItem('moto_favs', JSON.stringify(favorites));
    updateFavCount(); filterCatalog();
}

function updateFavCount() { document.getElementById('fav-count').textContent = favorites.length; }

function renderFavModal() {
    const list = document.getElementById('fav-items-list');
    list.innerHTML = '';
    if (!favorites.length) { list.textContent = 'Список избранного пуст.'; return; }
    favorites.forEach(f => {
        const row = document.createElement('div'); row.className = 'fav-row';
        const span = document.createElement('span'); span.textContent = `${f.title} — ${f.price.toLocaleString()} руб.`;
        const del = document.createElement('button'); del.type = 'button'; del.textContent = 'Удалить';
        del.onclick = () => { favorites = favorites.filter(x => x.key !== f.key); localStorage.setItem('moto_favs', JSON.stringify(favorites)); updateFavCount(); filterCatalog(); renderFavModal(); };
        row.append(span, del); list.appendChild(row);
    });
}

document.getElementById('fav-btn').onclick = () => { renderFavModal(); document.getElementById('fav-modal').classList.remove('hidden'); };
document.getElementById('close-fav').onclick = () => document.getElementById('fav-modal').classList.add('hidden');
document.getElementById('fav-modal').onclick = e => { if (e.target.id === 'fav-modal') document.getElementById('fav-modal').classList.add('hidden'); };

async function sendForm(url, payload, msgId, okText, form) {
    const msg = document.getElementById(msgId);
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    msg.style.color = res.ok ? '#2e7d32' : '#c62828';
    msg.textContent = res.ok ? okText : 'Ошибка при отправке. Проверьте данные.';
    if (res.ok) form.reset();
}

document.getElementById('order-form').onsubmit = e => {
    e.preventDefault();
    sendForm('/api/orders/', { client_name: document.getElementById('order-name').value, phone: document.getElementById('order-phone').value, motorcycle: document.getElementById('order-moto').value }, 'order-msg', 'Заявка успешно отправлена!', e.target);
};

document.getElementById('service-form').onsubmit = e => {
    e.preventDefault();
    sendForm('/api/service/', { client_name: document.getElementById('service-name').value, bike: document.getElementById('service-bike').value, service: document.getElementById('service-desc').value }, 'service-msg', 'Вы записаны на сервис!', e.target);
};
