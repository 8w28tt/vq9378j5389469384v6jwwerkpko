// ==UserScript==
// @name         Steam Level & Badge Master
// @namespace    https://github.com/8w28tt/vq9378j5389469384v6jwwerkpko
// @version      1.0.3
// @description  Умный калькулятор значков, проверка реальных цен ТП, гарантированный выкуп карт (Instant-Fill) и мгновенный крафт без анимаций.
// @author       oviot
// @downloadURL  https://raw.githubusercontent.com/8w28tt/vq9378j5389469384v6jwwerkpko/main/steam-level-master.user.js
// @updateURL    https://raw.githubusercontent.com/8w28tt/vq9378j5389469384v6jwwerkpko/main/steam-level-master.user.js
// @match        *://steamcommunity.com/*/badges*
// @match        *://steamcommunity.com/*/gamecards*
// @match        *://steamcommunity.com/id/*/badges*
// @match        *://steamcommunity.com/profiles/*/badges*
// @match        *://steamcommunity.com/my/badges*
// @match        *://steamcommunity.com/id/*/gamecards*
// @match        *://steamcommunity.com/profiles/*/gamecards*
// @match        *://steamcommunity.com/my/gamecards*
// @include      *://steamcommunity.com/*/badges*
// @include      *://steamcommunity.com/*/gamecards*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      steamcommunity.com
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // --- СТИЛИ И ИНТЕРФЕЙС ---
    const STYLES = `
        .slm-panel {
            background: linear-gradient(135deg, #1b2838 0%, #171a21 100%);
            border: 1px solid #38506b;
            border-radius: 8px;
            padding: 18px;
            margin: 20px 0;
            color: #c6d4df;
            font-family: "Motiva Sans", Arial, Helvetica, sans-serif;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
            position: relative;
            z-index: 99;
        }
        .slm-title {
            font-size: 19px;
            font-weight: 600;
            color: #66c0f4;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(102, 192, 244, 0.2);
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        .slm-btn {
            background: linear-gradient(to right, #47bfff 0%, #1a9fff 100%);
            border: none;
            border-radius: 4px;
            color: #fff;
            padding: 8px 16px;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            text-decoration: none;
        }
        .slm-btn:hover {
            background: linear-gradient(to right, #66c0f4 0%, #29a8ff 100%);
            box-shadow: 0 0 12px rgba(102, 192, 244, 0.5);
            color: #fff;
        }
        .slm-btn-green {
            background: linear-gradient(to right, #799905 0%, #536f00 100%);
        }
        .slm-btn-green:hover {
            background: linear-gradient(to right, #8bb008 0%, #5f7f02 100%);
            box-shadow: 0 0 12px rgba(139, 176, 8, 0.5);
        }
        .slm-btn-secondary {
            background: #2a475e;
            color: #c6d4df;
        }
        .slm-btn-secondary:hover {
            background: #3b5f7d;
            color: #fff;
        }
        .slm-btn-danger {
            background: #842e2e;
        }
        .slm-btn-danger:hover {
            background: #a83b3b;
        }
        .slm-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }
        .slm-level-selector {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 12px 0;
            background: rgba(0, 0, 0, 0.25);
            padding: 10px 14px;
            border-radius: 6px;
        }
        .slm-lvl-btn {
            background: #213143;
            border: 1px solid #3d5a80;
            color: #8f98a0;
            padding: 5px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.15s;
        }
        .slm-lvl-btn.active {
            background: #66c0f4;
            color: #171a21;
            border-color: #66c0f4;
            box-shadow: 0 0 8px rgba(102, 192, 244, 0.6);
        }
        .slm-modal-backdrop {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(4px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .slm-modal {
            background: #1b2838;
            border: 1px solid #38506b;
            border-radius: 8px;
            width: 720px;
            max-width: 95vw;
            max-height: 85vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.7);
            color: #c6d4df;
            overflow: hidden;
        }
        .slm-modal-header {
            padding: 16px 20px;
            background: #141d27;
            border-bottom: 1px solid #2a475e;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 17px;
            font-weight: bold;
            color: #66c0f4;
        }
        .slm-modal-body {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
        }
        .slm-modal-footer {
            padding: 16px 20px;
            background: #141d27;
            border-top: 1px solid #2a475e;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .slm-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 13px;
        }
        .slm-table th, .slm-table td {
            padding: 10px 12px;
            text-align: left;
            border-bottom: 1px solid #2a475e;
        }
        .slm-table th {
            background: rgba(0, 0, 0, 0.3);
            color: #8f98a0;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
        }
        .slm-price-instant {
            color: #a4d007;
            font-weight: bold;
        }
        .slm-price-min {
            color: #66c0f4;
        }
        .slm-mode-radio {
            display: flex;
            gap: 15px;
            margin: 15px 0;
            padding: 12px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 6px;
        }
        .slm-badge-card-tag {
            font-size: 11px;
            padding: 2px 6px;
            border-radius: 3px;
            background: #2a475e;
            color: #a0b9cf;
        }
        .slm-toast {
            position: fixed;
            bottom: 25px;
            right: 25px;
            background: #213143;
            border-left: 4px solid #66c0f4;
            color: #fff;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.5);
            z-index: 10001;
            font-size: 14px;
            animation: fadeIn 0.3s ease;
        }
    `;

    // Внедряем стили
    const styleEl = document.createElement('style');
    styleEl.innerHTML = STYLES;
    document.head.appendChild(styleEl);

    // --- СЕРВИСНЫЕ ФУНКЦИИ ---
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'slm-toast';
        if (type === 'success') toast.style.borderLeftColor = '#a4d007';
        if (type === 'error') toast.style.borderLeftColor = '#e74c3c';
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }

    function getSessionID() {
        return window.g_sessionID || (document.cookie.match(/sessionid=([a-f0-9]+)/) || [])[1];
    }

    // Определение валюты пользователя (поддержка KZT ₸, RUB руб., UAH ₴, USD $, EUR € и др.)
    function getCurrencyInfo() {
        let win = window;
        try {
            if (typeof unsafeWindow !== 'undefined' && unsafeWindow) {
                win = unsafeWindow;
            }
        } catch (e) {
            win = window;
        }
        
        let currency = 5;
        let country = 'RU';
        let symbol = 'руб.';
        let isPrefix = false;

        try {
            // 1. Проверяем g_rgWalletInfo из контекста страницы
            if (win && win.g_rgWalletInfo && win.g_rgWalletInfo.wallet_currency) {
                currency = parseInt(win.g_rgWalletInfo.wallet_currency, 10);
                country = win.g_rgWalletInfo.wallet_country || 'RU';
            }
        } catch (e) {}

        // 2. Таблица популярных валют Steam
        const CURRENCY_MAP = {
            37: { symbol: '₸', country: 'KZ', prefix: false, name: 'KZT' },
            5:  { symbol: 'руб.', country: 'RU', prefix: false, name: 'RUB' },
            18: { symbol: '₴', country: 'UA', prefix: false, name: 'UAH' },
            1:  { symbol: '$', country: 'US', prefix: true, name: 'USD' },
            3:  { symbol: '€', country: 'DE', prefix: false, name: 'EUR' },
            2:  { symbol: '£', country: 'GB', prefix: true, name: 'GBP' },
            6:  { symbol: 'zł', country: 'PL', prefix: false, name: 'PLN' },
            8:  { symbol: '¥', country: 'JP', prefix: true, name: 'JPY' },
            23: { symbol: '¥', country: 'CN', prefix: true, name: 'CNY' },
            24: { symbol: '₹', country: 'IN', prefix: true, name: 'INR' },
            17: { symbol: 'TL', country: 'TR', prefix: false, name: 'TRY' }
        };

        if (CURRENCY_MAP[currency]) {
            symbol = CURRENCY_MAP[currency].symbol;
            if (!(win && win.g_rgWalletInfo && win.g_rgWalletInfo.wallet_country)) {
                country = CURRENCY_MAP[currency].country;
            }
            isPrefix = CURRENCY_MAP[currency].prefix;
        }

        // 3. Автоопределение по балансу в шапке Steam (#header_wallet_balance)
        try {
            const walletEl = document.getElementById('header_wallet_balance');
            if (walletEl && walletEl.innerText) {
                const wText = walletEl.innerText;
                if (wText.includes('₸')) {
                    currency = 37; symbol = '₸'; country = 'KZ'; isPrefix = false;
                } else if (wText.includes('грн') || wText.includes('₴')) {
                    currency = 18; symbol = '₴'; country = 'UA'; isPrefix = false;
                } else if (wText.includes('руб') || wText.includes('₽')) {
                    currency = 5; symbol = 'руб.'; country = 'RU'; isPrefix = false;
                } else if (wText.includes('$')) {
                    currency = 1; symbol = '$'; country = 'US'; isPrefix = true;
                } else if (wText.includes('€')) {
                    currency = 3; symbol = '€'; country = 'DE'; isPrefix = false;
                } else if (wText.includes('zł')) {
                    currency = 6; symbol = 'zł'; country = 'PL'; isPrefix = false;
                }
            }
        } catch (e) {}

        return { currency, country, symbol, isPrefix };
    }

    function formatMoney(cents, currencyInfo) {
        if (!currencyInfo) currencyInfo = getCurrencyInfo();
        const val = (cents / 100).toFixed(2);
        if (currencyInfo.isPrefix) {
            return `${currencyInfo.symbol}${val}`;
        }
        return `${val} ${currencyInfo.symbol}`;
    }

    const formatCents = formatMoney;

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    // Универсальный загрузчик JSON (использует GM_xmlhttpRequest для обхода CORS/куки, либо fetch)
    function requestJson(url) {
        return new Promise((resolve, reject) => {
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Accept': 'application/json, text/javascript, */*; q=0.01',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    onload: function (response) {
                        try {
                            if (response.status >= 200 && response.status < 300) {
                                const data = JSON.parse(response.responseText);
                                resolve(data);
                            } else {
                                reject(new Error('HTTP ' + response.status));
                            }
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: function (err) {
                        reject(err);
                    }
                });
            } else {
                fetch(url, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                })
                .then(res => {
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    return res.json();
                })
                .then(resolve)
                .catch(reject);
            }
        });
    }

    // =========================================================================
    // СТАРТ И МАРШРУТИЗАЦИЯ С АВТОПОВТОРОМ (ЗАЩИТА ОТ ЗАДЕРЖКИ РЕНДЕРА DOM)
    // =========================================================================
    function runWhenReady(fn, maxAttempts = 15, interval = 350) {
        let attempts = 0;
        const check = () => {
            attempts++;
            try {
                const mounted = fn();
                if (mounted) return;
            } catch (err) {
                console.warn('[SLM] Попытка ' + attempts + ' завершилась ошибкой, повторим...', err);
            }
            if (attempts < maxAttempts) {
                setTimeout(check, interval);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', check);
        } else {
            check();
        }
    }

    // Запуск скрипта
    const currentPath = window.location.pathname;
    if (currentPath.includes('/gamecards')) {
        runWhenReady(initGameCardsPage);
    } else if (currentPath.includes('/badges')) {
        runWhenReady(initBadgesPage);
    }

    function initGameCardsPage() {
        if (document.getElementById('slm-panel-gamecards')) return true; // Уже встроено

        const appidMatch = window.location.pathname.match(/\/gamecards\/(\d+)/);
        if (!appidMatch) return false;
        const appid = appidMatch[1];

        // Ищем карточки на странице
        const cardElements = document.querySelectorAll('.badge_card_set_card, .gamecards_inventory .badge_card_set_card');
        if (!cardElements || cardElements.length === 0) return false; // Ждем рендера карт

        // Определяем текущий уровень значка
        let currentLevel = 0;
        const levelHeader = document.querySelector('.badge_info_description');
        if (levelHeader) {
            const lvlMatch = levelHeader.innerText.match(/(?:Уровень|Level)\s*(\d+)/i);
            if (lvlMatch) currentLevel = parseInt(lvlMatch[1], 10);
        }

        const cardsData = [];
        cardElements.forEach(cardEl => {
            const nameEl = cardEl.querySelector('.badge_card_set_text');
            const qtyEl = cardEl.querySelector('.badge_card_set_text_qty');
            if (!nameEl) return;

            let cardName = nameEl.innerText.trim();
            cardName = cardName.replace(/\(\d+\)$/, '').trim();

            let ownedQty = 0;
            if (qtyEl && qtyEl.innerText) {
                const match = qtyEl.innerText.match(/\((\d+)\)/);
                ownedQty = match ? parseInt(match[1], 10) : 0;
            } else if (!cardEl.classList.contains('unowned')) {
                ownedQty = 1;
            }

            const marketLink = cardEl.querySelector('a[href*="/market/listings/753/"]');
            let marketHashName = '';
            if (marketLink) {
                const urlParts = marketLink.href.split('/market/listings/753/');
                if (urlParts[1]) marketHashName = decodeURIComponent(urlParts[1]);
            } else {
                marketHashName = `${appid}-${cardName}`;
            }

            cardsData.push({
                name: cardName,
                owned: ownedQty,
                marketHashName: marketHashName,
                element: cardEl
            });
        });

        if (cardsData.length === 0) return false;

        // По умолчанию цель: 5 уровень
        let targetLevel = currentLevel < 5 ? 5 : 5;

        // Ищем контейнер для вставки с гарантированными fallback
        const container = document.querySelector('.badge_detail_tasks') 
            || document.querySelector('.badge_current')
            || document.querySelector('.badge_cards_to_collect')
            || document.querySelector('.gamecards_inventory')
            || document.querySelector('.badge_card_set_card_area')
            || document.querySelector('.badge_detail_header')
            || document.querySelector('#mainContents')
            || document.querySelector('.pagecontent')
            || document.body;

        if (!container) return false;

        const panel = document.createElement('div');
        panel.id = 'slm-panel-gamecards';
        panel.className = 'slm-panel';
        panel.innerHTML = `
            <div class="slm-title">
                <span>🚀 Умный конфигуратор значка</span>
                <span style="font-size: 13px; color: #8f98a0;">Текущий уровень: <b style="color:#66c0f4">${currentLevel}</b>/5</span>
            </div>
            
            <div class="slm-level-selector">
                <span style="font-size: 13px; font-weight: bold;">До какого уровня прокачать:</span>
                <div style="display: flex; gap: 6px;" id="slm-target-levels">
                    ${[1, 2, 3, 4, 5].map(lvl => `
                        <button class="slm-lvl-btn ${lvl === targetLevel ? 'active' : ''} ${lvl <= currentLevel ? 'disabled' : ''}" 
                                data-level="${lvl}" 
                                ${lvl <= currentLevel ? 'title="Уже достигнут"' : ''}>
                            Уровень ${lvl}
                        </button>
                    `).join('')}
                </div>
            </div>

            <div id="slm-calc-summary" style="margin: 14px 0; font-size: 14px; line-height: 1.6;">
                <!-- Динамический расчет -->
            </div>

            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="slm-btn slm-btn-green" id="slm-btn-check-prices">
                    🔍 Проверить реальные цены ТП со стаканом
                </button>
                <button class="slm-btn slm-btn-secondary" id="slm-btn-turbo-craft" ${canCraftAny(currentLevel, cardsData) ? '' : 'disabled'}>
                    ⚡ Быстрый крафт готовых (Turbo Craft)
                </button>
            </div>
        `;

        if (container === document.body || container.id === 'mainContents') {
            container.prepend(panel);
        } else {
            container.parentNode.insertBefore(panel, container);
        }

        console.log('[SLM] Панель значка успешно встроена на страницу!');

        function updateCalculation() {
            const levelsToCraft = Math.max(0, targetLevel - currentLevel);
            let totalCardsToBuy = 0;
            let breakdownHtml = `<ul style="margin: 8px 0 0 20px; padding: 0;">`;

            cardsData.forEach(card => {
                // Сколько нужно для targetLevel:
                // Каждый уровень требует 1 карту. Если цель 5, а сейчас 2 -> нужно еще 3 карты каждого типа.
                // Учитываем то, что уже лежит в инвентаре сверх текущего уровня.
                const needed = Math.max(0, levelsToCraft - card.owned);
                card.needed = needed;
                totalCardsToBuy += needed;

                breakdownHtml += `<li><b>${card.name}</b>: в наличии <b>${card.owned}</b> шт. → докупить: <b style="color: ${needed > 0 ? '#66c0f4' : '#a4d007'}">${needed}</b> шт.</li>`;
            });
            breakdownHtml += `</ul>`;

            const summaryEl = document.getElementById('slm-calc-summary');
            if (levelsToCraft === 0) {
                summaryEl.innerHTML = `<span style="color: #a4d007;">🎉 Значок уже прокачан до уровня ${currentLevel}!</span>`;
                document.getElementById('slm-btn-check-prices').disabled = true;
            } else {
                summaryEl.innerHTML = `
                    Для уровня <b>${targetLevel}</b> нужно скрафтить значок <b>${levelsToCraft}</b> раз(а).<br>
                    Всего необходимо докупить карт: <b style="color: #66c0f4; font-size: 16px;">${totalCardsToBuy} шт.</b>
                    ${breakdownHtml}
                `;
                document.getElementById('slm-btn-check-prices').disabled = (totalCardsToBuy === 0);
            }
        }

        // Обработчик кнопок уровня
        panel.querySelectorAll('.slm-lvl-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lvl = parseInt(e.target.dataset.level, 10);
                if (lvl <= currentLevel) return;
                panel.querySelectorAll('.slm-lvl-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                targetLevel = lvl;
                updateCalculation();
            });
        });

        updateCalculation();

        // Обработчик Turbo Craft
        document.getElementById('slm-btn-turbo-craft').addEventListener('click', () => {
            turboCraftBadge(appid);
        });

        // Обработчик проверки реальных цен
        document.getElementById('slm-btn-check-prices').addEventListener('click', async () => {
            const cardsToBuy = cardsData.filter(c => c.needed > 0);
            if (cardsToBuy.length === 0) {
                showToast('Все карты уже в наличии!', 'success');
                return;
            }
            openPriceReviewModal(appid, cardsToBuy, targetLevel);
        });

        return true;
    }

    function canCraftAny(currentLevel, cardsData) {
        if (currentLevel >= 5) return false;
        // Можно скрафтить хотя бы 1 раз, если каждой карты есть хотя бы 1 штука
        return cardsData.every(c => c.owned >= 1);
    }

    // =========================================================================
    // МОДАЛЬНОЕ ОКНО: Проверка цен со стаканом и Instant-Fill
    // =========================================================================
    async function openPriceReviewModal(appid, cardsToBuy, targetLevel) {
        const currencyInfo = getCurrencyInfo();
        const { currency, country } = currencyInfo;

        const modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'slm-modal-backdrop';
        modalBackdrop.innerHTML = `
            <div class="slm-modal">
                <div class="slm-modal-header">
                    <span>🔍 Личная перепроверка цен на ТП (AppID: ${appid})</span>
                    <button id="slm-modal-close" style="background:none;border:none;color:#8f98a0;font-size:20px;cursor:pointer;">✕</button>
                </div>
                <div class="slm-modal-body">
                    <p style="margin-top:0; font-size:13px; color:#8f98a0;">
                        Скрипт проверяет глубину стакана на ТП Steam. Валюта аккаунта: <b style="color:#66c0f4">${currencyInfo.symbol} (${currencyInfo.country})</b>.
                    </p>

                    <div class="slm-mode-radio">
                        <label style="cursor:pointer; display:flex; align-items:center; gap:8px;">
                            <input type="radio" name="slm-buy-strategy" value="instant" checked>
                            <span>
                                <b style="color:#a4d007;">⚡ Instant-Fill (Гарантированный выкуп)</b><br>
                                <small style="color:#8f98a0;">Ордер ставится по цене N-й карточки. Все N карт выкупаются СРАЗУ, ордер не зависает.</small>
                            </span>
                        </label>
                        <label style="cursor:pointer; display:flex; align-items:center; gap:8px;">
                            <input type="radio" name="slm-buy-strategy" value="min">
                            <span>
                                <b style="color:#66c0f4;">💰 Минимальная цена (Экономный)</b><br>
                                <small style="color:#8f98a0;">Ордер по минимальной текущей цене. Часть карт может зависнуть, если закончатся дешевые.</small>
                            </span>
                        </label>
                    </div>

                    <div id="slm-loading-prices" style="text-align: center; padding: 25px; color: #66c0f4;">
                        ⏳ Получаем официальный список карточек игры с Торговой площадки...
                    </div>

                    <div id="slm-prices-table-container" style="display:none;">
                        <table class="slm-table">
                            <thead>
                                <tr>
                                    <th width="40"><input type="checkbox" id="slm-select-all" checked></th>
                                    <th>Карточка</th>
                                    <th>Нужно</th>
                                    <th>Мин. цена</th>
                                    <th>Instant-Fill (за шт.)</th>
                                    <th>Итого за позицию</th>
                                </tr>
                            </thead>
                            <tbody id="slm-prices-table-body"></tbody>
                        </table>
                    </div>
                </div>
                <div class="slm-modal-footer">
                    <div>
                        <span style="font-size: 13px; color: #8f98a0;">Оценочная стоимость:</span>
                        <div id="slm-total-price" style="font-size: 19px; font-weight: bold; color: #a4d007;">Считаем...</div>
                    </div>
                    <div style="display:flex; gap:10px;">
                        <button class="slm-btn slm-btn-secondary" id="slm-btn-cancel">Отмена</button>
                        <button class="slm-btn slm-btn-green" id="slm-btn-execute-orders" disabled>
                            🛒 Подтвердить и выставить ордеры
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modalBackdrop);

        const closeModal = () => modalBackdrop.remove();
        modalBackdrop.querySelector('#slm-modal-close').onclick = closeModal;
        modalBackdrop.querySelector('#slm-btn-cancel').onclick = closeModal;

        // ШАГ 1: Запрашиваем все карточки игры через официальный поиск ТП
        const marketItemsList = await fetchGameMarketItems(appid, currency);

        // Уточняем валюту напрямую из первого полученного ценника маркета (100% точность)
        if (marketItemsList && marketItemsList.length > 0 && marketItemsList[0].sell_price_text) {
            const rawPriceText = marketItemsList[0].sell_price_text;
            const detectedSymbol = rawPriceText.replace(/[\d\s,\.]/g, '').trim();
            if (detectedSymbol) {
                currencyInfo.symbol = detectedSymbol;
                currencyInfo.isPrefix = rawPriceText.trim().startsWith(detectedSymbol);
            }
        }

        // ШАГ 2: Сопоставляем карточки и получаем глубину стакана
        const marketResults = [];
        let index = 0;

        for (const card of cardsToBuy) {
            index++;
            document.getElementById('slm-loading-prices').innerText = 
                `⏳ Проверяем рынок: [${index}/${cardsToBuy.length}] "${card.name}"...`;
            
            // Ищем карту в результатах маркета
            const matchedMarketItem = matchCardWithMarket(card, marketItemsList, index - 1, cardsToBuy.length);
            
            if (matchedMarketItem && matchedMarketItem.hash_name) {
                card.marketHashName = matchedMarketItem.hash_name;
            }

            const basePrice = matchedMarketItem ? (matchedMarketItem.sell_price || 100) : 100;
            const basePriceText = matchedMarketItem ? (matchedMarketItem.sell_price_text || formatMoney(basePrice, currencyInfo)) : formatMoney(basePrice, currencyInfo);

            const priceData = await fetchCardMarketDepth(card.marketHashName, card.needed, currencyInfo, basePrice, basePriceText);
            
            marketResults.push({
                card,
                ...priceData,
                selected: true
            });

            await sleep(300);
        }

        document.getElementById('slm-loading-prices').style.display = 'none';
        document.getElementById('slm-prices-table-container').style.display = 'block';
        document.getElementById('slm-btn-execute-orders').disabled = false;

        function renderTableRows() {
            const tbody = document.getElementById('slm-prices-table-body');
            const strategy = document.querySelector('input[name="slm-buy-strategy"]:checked').value;
            tbody.innerHTML = '';

            let grandTotalCents = 0;

            marketResults.forEach((res, i) => {
                const unitPrice = strategy === 'instant' ? res.instantUnitPrice : res.minUnitPrice;
                const totalCents = unitPrice * res.card.needed;
                if (res.selected) grandTotalCents += totalCents;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <input type="checkbox" class="slm-card-check" data-index="${i}" ${res.selected ? 'checked' : ''}>
                    </td>
                    <td><b>${res.card.name}</b></td>
                    <td><span class="slm-badge-card-tag">${res.card.needed} шт.</span></td>
                    <td class="slm-price-min">${res.minPriceFormatted}</td>
                    <td class="slm-price-instant">${res.instantPriceFormatted}</td>
                    <td style="font-weight:bold; color: #fff;">${formatMoney(totalCents, currencyInfo)}</td>
                `;
                tbody.appendChild(tr);
            });

            document.getElementById('slm-total-price').innerText = formatMoney(grandTotalCents, currencyInfo);

            // Чекбоксы
            tbody.querySelectorAll('.slm-card-check').forEach(chk => {
                chk.onchange = (e) => {
                    const idx = parseInt(e.target.dataset.index, 10);
                    marketResults[idx].selected = e.target.checked;
                    renderTableRows();
                };
            });
        }

        modalBackdrop.querySelectorAll('input[name="slm-buy-strategy"]').forEach(r => {
            r.onchange = renderTableRows;
        });

        modalBackdrop.querySelector('#slm-select-all').onchange = (e) => {
            marketResults.forEach(r => r.selected = e.target.checked);
            renderTableRows();
        };

        renderTableRows();

        // Подтверждение и запуск выставления ордеров
        document.getElementById('slm-btn-execute-orders').onclick = async () => {
            const strategy = document.querySelector('input[name="slm-buy-strategy"]:checked').value;
            const selectedItems = marketResults.filter(r => r.selected);
            if (selectedItems.length === 0) {
                showToast('Не выбрано ни одной карты для покупки!', 'error');
                return;
            }

            const btn = document.getElementById('slm-btn-execute-orders');
            btn.disabled = true;
            btn.innerText = '⏳ Создаем ордеры на ТП...';

            let successCount = 0;
            for (const item of selectedItems) {
                const unitPrice = strategy === 'instant' ? item.instantUnitPrice : item.minUnitPrice;
                const result = await createBuyOrder(item.card.marketHashName, item.card.needed, unitPrice, currency);
                if (result.success) {
                    successCount++;
                }
                await sleep(500);
            }

            closeModal();
            showToast(`✅ Успешно создано ${successCount} из ${selectedItems.length} ордеров!`, 'success');

            setTimeout(() => {
                window.location.reload();
            }, 2000);
        };
    }

    // =========================================================================
    // API: Поиск всех карточек игры на маркете (1 запрос для всего набора)
    // =========================================================================
    async function fetchGameMarketItems(appid, currency) {
        const url = `https://steamcommunity.com/market/search/render/?query=&start=0&count=100&search_descriptions=0&appid=753&category_753_Game[]=tag_app_${appid}&category_753_cardborder[]=tag_cardborder_0&category_753_item_class[]=tag_item_class_2&norender=1`;
        try {
            const data = await requestJson(url);
            if (data && data.success && Array.isArray(data.results)) {
                return data.results;
            }
        } catch (e) {
            console.warn('[SLM] Ошибка первичного поиска карт сета', e);
        }
        return [];
    }

    function matchCardWithMarket(card, marketList, index, totalNeeded) {
        if (!marketList || marketList.length === 0) return null;

        const cardNameClean = card.name.toLowerCase().trim();

        // 1. Прямое совпадение по имени
        let match = marketList.find(m => m.name && m.name.toLowerCase().trim() === cardNameClean);
        if (match) return match;

        // 2. Проверка, оканчивается ли hash_name на cardName
        match = marketList.find(m => m.hash_name && m.hash_name.toLowerCase().endsWith('-' + cardNameClean));
        if (match) return match;

        // 3. Частичное совпадение
        match = marketList.find(m => (m.name && m.name.toLowerCase().includes(cardNameClean)) || (m.hash_name && m.hash_name.toLowerCase().includes(cardNameClean)));
        if (match) return match;

        // 4. Позиционное соответствие
        if (marketList[index]) {
            return marketList[index];
        }

        return marketList[0];
    }

    // =========================================================================
    // API: Получение глубины цен ТП (стакан ордеров) с гарантированным fallback
    // =========================================================================
    async function fetchCardMarketDepth(marketHashName, neededQuantity, currencyInfo, fallbackPriceCents = 100, fallbackFormatted = '') {
        const { currency, country } = currencyInfo;
        const url = `https://steamcommunity.com/market/listings/753/${encodeURIComponent(marketHashName)}/render/?query=&start=0&count=${Math.max(10, neededQuantity + 2)}&country=${country}&language=russian&currency=${currency}`;

        try {
            const data = await requestJson(url);

            if (!data.success || !data.listinginfo || Object.keys(data.listinginfo).length === 0) {
                // Если стакан пуст или не отрендерился, используем проверенную базовую цену поиска
                return {
                    minUnitPrice: fallbackPriceCents,
                    instantUnitPrice: Math.round(fallbackPriceCents * 1.05),
                    minPriceFormatted: fallbackFormatted || formatMoney(fallbackPriceCents, currencyInfo),
                    instantPriceFormatted: formatMoney(Math.round(fallbackPriceCents * 1.05), currencyInfo),
                    currencyInfo
                };
            }

            const prices = [];
            for (const key in data.listinginfo) {
                const item = data.listinginfo[key];
                const unitPrice = (item.converted_price_per_unit || (item.converted_price + item.converted_fee));
                if (unitPrice > 0) {
                    prices.push(unitPrice);
                }
            }

            prices.sort((a, b) => a - b);

            if (prices.length === 0) {
                return {
                    minUnitPrice: fallbackPriceCents,
                    instantUnitPrice: fallbackPriceCents,
                    minPriceFormatted: fallbackFormatted || formatMoney(fallbackPriceCents, currencyInfo),
                    instantPriceFormatted: fallbackFormatted || formatMoney(fallbackPriceCents, currencyInfo),
                    currencyInfo
                };
            }

            const minUnitPrice = prices[0];
            const targetIndex = Math.min(neededQuantity - 1, prices.length - 1);
            const instantUnitPrice = prices[targetIndex];

            return {
                minUnitPrice: minUnitPrice,
                instantUnitPrice: instantUnitPrice,
                minPriceFormatted: formatMoney(minUnitPrice, currencyInfo),
                instantPriceFormatted: formatMoney(instantUnitPrice, currencyInfo),
                currencyInfo
            };
        } catch (e) {
            console.warn('[SLM] Предупреждение парсинга глубины для ' + marketHashName + ', используем базовую цену', e);
            return {
                minUnitPrice: fallbackPriceCents,
                instantUnitPrice: Math.round(fallbackPriceCents * 1.05),
                minPriceFormatted: fallbackFormatted || formatMoney(fallbackPriceCents, currencyInfo),
                instantPriceFormatted: formatMoney(Math.round(fallbackPriceCents * 1.05), currencyInfo),
                currencyInfo
            };
        }
    }

    // =========================================================================
    // API: Создание запроса на покупку (Buy Order)
    // =========================================================================
    async function createBuyOrder(marketHashName, quantity, unitPriceCents, currency) {
        const sessionid = getSessionID();
        const totalPriceCents = unitPriceCents * quantity;

        const body = new URLSearchParams({
            sessionid: sessionid,
            currency: currency,
            appid: 753,
            market_hash_name: marketHashName,
            price_total: totalPriceCents,
            quantity: quantity,
            billing_state: '',
            save_my_address: '0'
        });

        try {
            const resp = await fetch('https://steamcommunity.com/market/createbuyorder/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: body.toString()
            });

            const data = await resp.json();
            if (data.success === 1) {
                return { success: true, buy_orderid: data.buy_orderid };
            } else {
                showToast(`Ошибка ордера для ${marketHashName}: ${data.message || 'Код ' + data.success}`, 'error');
                return { success: false, message: data.message };
            }
        } catch (err) {
            console.error('[SLM] Ошибка отправки ордера', err);
            return { success: false, message: err.message };
        }
    }

    // =========================================================================
    // API: TURBO CRAFT (Мгновенный крафт значка без анимации)
    // =========================================================================
    async function turboCraftBadge(appid) {
        const sessionid = getSessionID();
        showToast(`⚡ Начинаем крафт для AppID: ${appid}...`, 'info');

        try {
            const resp = await fetch('https://steamcommunity.com/my/ajaxcraftbadge/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: `appid=${appid}&series=1&border_color=0&sessionid=${sessionid}`
            });

            const data = await resp.json();
            if (data.success === 1 || data.Badge) {
                showToast(`🎉 Значок успешно скрафчен! Уровень повышен!`, 'success');
                setTimeout(() => window.location.reload(), 1500);
            } else {
                showToast(`Не удалось скрафтить значок: ${data.message || 'Проверьте карты'}`, 'error');
            }
        } catch (e) {
            console.error('[SLM] Ошибка Turbo Craft', e);
            showToast(`Ошибка сети при крафте`, 'error');
        }
    }

    function formatCents(cents, symbol = 'руб.') {
        const val = (cents / 100).toFixed(2);
        return `${val} ${symbol}`;
    }

    // =========================================================================
    // СТРАНИЦА ОБЩИХ ЗНАЧКОВ: /badges/
    // =========================================================================
    function initBadgesPage() {
        if (document.getElementById('slm-panel-badges')) return true;

        const badgeRows = document.querySelectorAll('.badge_row');
        if (!badgeRows || badgeRows.length === 0) return false;

        // Ищем готовые к крафту значки
        const readyBadges = [];
        badgeRows.forEach(row => {
            const craftBtn = row.querySelector('.badge_craft_button, a[href*="ajaxcraftbadge"]');
            const link = row.querySelector('a.badge_row_overlay');
            if (craftBtn && link) {
                const match = link.href.match(/\/gamecards\/(\d+)/);
                if (match) readyBadges.push({ appid: match[1], row });
            }
        });

        // Создаем шапку-тулбар
        const header = document.querySelector('.badges_sheet') 
            || document.querySelector('.profile_badges_header')
            || document.querySelector('.badge_row_list')
            || document.querySelector('.profile_content')
            || document.querySelector('#mainContents')
            || document.querySelector('.pagecontent')
            || document.body;

        if (!header) return false;

        const bar = document.createElement('div');
        bar.id = 'slm-panel-badges';
        bar.className = 'slm-panel';
        bar.innerHTML = `
            <div class="slm-title">
                <span>🚀 Steam Level Master — Обзор значков</span>
                <span style="font-size: 13px; color: #a4d007;">Готово к крафту: <b>${readyBadges.length}</b> значков</span>
            </div>
            <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
                <button class="slm-btn slm-btn-green" id="slm-mass-craft-btn" ${readyBadges.length > 0 ? '' : 'disabled'}>
                    ⚡ Скрафтить ВСЕ готовые значки пачкой (${readyBadges.length})
                </button>
                <span style="font-size: 13px; color: #8f98a0;">
                    Кликните на любой значок ниже, чтобы открыть калькулятор карт от 1 до 5 уровня и автозакупку.
                </span>
            </div>
            <div id="slm-mass-craft-progress" style="margin-top: 10px; display: none; font-size: 13px; color: #66c0f4;"></div>
        `;

        if (header === document.body || header.id === 'mainContents') {
            header.prepend(bar);
        } else {
            header.parentNode.insertBefore(bar, header);
        }

        console.log('[SLM] Панель обзора значков успешно встроена!');

        // Массовый турбо-крафт
        document.getElementById('slm-mass-craft-btn').onclick = async () => {
            if (!confirm(`Вы уверены, что хотите мгновенно скрафтить все доступные значки (${readyBadges.length} шт.)?`)) {
                return;
            }

            const btn = document.getElementById('slm-mass-craft-btn');
            btn.disabled = true;
            const progress = document.getElementById('slm-mass-craft-progress');
            progress.style.display = 'block';

            let count = 0;
            for (const item of readyBadges) {
                count++;
                progress.innerText = `⏳ Крафтим [${count}/${readyBadges.length}] AppID: ${item.appid}...`;
                await turboCraftBadgeSilent(item.appid);
                await sleep(400);
            }

            progress.innerHTML = `<b style="color: #a4d007;">🎉 Все доступные значки успешно скрафчены!</b>`;
            setTimeout(() => window.location.reload(), 1500);
        };

        return true;
    }

    async function turboCraftBadgeSilent(appid) {
        const sessionid = getSessionID();
        try {
            await fetch('https://steamcommunity.com/my/ajaxcraftbadge/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: `appid=${appid}&series=1&border_color=0&sessionid=${sessionid}`
            });
        } catch (e) {
            console.error('[SLM] Ошибка при фоновом крафте', e);
        }
    }

})();
