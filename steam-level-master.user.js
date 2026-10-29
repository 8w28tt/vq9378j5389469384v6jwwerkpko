// ==UserScript==
// @name         Steam Level & Badge Master
// @namespace    https://github.com/8w28tt/vq9378j5389469384v6jwwerkpko
// @version      1.4.2
// @description  Каталог самых дешёвых сетов карточек, закупка через Multi-Buy без подтверждений на телефоне и мгновенный крафт.
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
// @match        *://steamcommunity.com/market/multibuy*
// @include      *://steamcommunity.com/*/badges*
// @include      *://steamcommunity.com/*/gamecards*
// @include      *://steamcommunity.com/market/multibuy*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      steamcommunity.com
// @connect      cdn.steam.tools
// @connect      steam.tools
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
        /* Вкладки */
        .slm-tabs {
            display: flex;
            gap: 8px;
            border-bottom: 2px solid #2a475e;
            margin-bottom: 16px;
            padding-bottom: 2px;
        }
        .slm-tab-btn {
            background: transparent;
            border: none;
            color: #8f98a0;
            padding: 9px 18px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            border-radius: 6px 6px 0 0;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .slm-tab-btn:hover {
            color: #c6d4df;
            background: rgba(42, 71, 94, 0.3);
        }
        .slm-tab-btn.active {
            color: #66c0f4;
            background: #1b2838;
            border-bottom: 3px solid #66c0f4;
        }
        .slm-tab-pane {
            display: none;
            animation: fadeIn 0.2s ease;
        }
        .slm-tab-pane.active {
            display: block;
        }
        .slm-input {
            background: #101822;
            border: 1px solid #38506b;
            color: #fff;
            padding: 7px 12px;
            border-radius: 4px;
            font-size: 14px;
            outline: none;
        }
        .slm-input:focus {
            border-color: #66c0f4;
            box-shadow: 0 0 6px rgba(102, 192, 244, 0.4);
        }
        /* Каталог сетов */
        .slm-toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
            flex-wrap: wrap;
        }
        .slm-filter-group {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 13px;
        }
        .slm-table-container {
            max-height: 480px;
            overflow-y: auto;
            border: 1px solid #2a475e;
            border-radius: 6px;
        }
        .slm-badge-pill {
            display: inline-block;
            padding: 2px 7px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 600;
        }
        .slm-badge-pill-done {
            background: rgba(164, 208, 7, 0.2);
            color: #a4d007;
            border: 1px solid rgba(164, 208, 7, 0.4);
        }
        .slm-badge-pill-progress {
            background: rgba(102, 192, 244, 0.2);
            color: #66c0f4;
            border: 1px solid rgba(102, 192, 244, 0.4);
        }
        .slm-badge-pill-new {
            background: rgba(143, 152, 160, 0.2);
            color: #8f98a0;
            border: 1px solid rgba(143, 152, 160, 0.4);
        }
        .slm-pagination {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
            font-size: 13px;
            color: #8f98a0;
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
        if (typeof unsafeWindow !== 'undefined' && unsafeWindow && unsafeWindow.g_sessionID) {
            return unsafeWindow.g_sessionID;
        }
        if (typeof window !== 'undefined' && window && window.g_sessionID) {
            return window.g_sessionID;
        }
        const cookieMatch = document.cookie ? document.cookie.match(/sessionid=([a-f0-9]+)/i) : null;
        if (cookieMatch && cookieMatch[1]) {
            return cookieMatch[1];
        }
        const html = document.documentElement ? document.documentElement.innerHTML : '';
        const htmlMatch = html.match(/g_sessionID\s*=\s*"([a-f0-9]+)"/i);
        if (htmlMatch && htmlMatch[1]) {
            return htmlMatch[1];
        }
        return '';
    }

    // Определение канонического URL профиля пользователя в Steam (для прямых POST запросов без 302-редиректов)
    function getSteamProfileUrl() {
        if (typeof unsafeWindow !== 'undefined' && unsafeWindow && unsafeWindow.g_rgProfileData && unsafeWindow.g_rgProfileData.url) {
            return unsafeWindow.g_rgProfileData.url;
        }
        if (typeof window !== 'undefined' && window && window.g_rgProfileData && window.g_rgProfileData.url) {
            return window.g_rgProfileData.url;
        }
        const html = document.documentElement ? document.documentElement.innerHTML : '';
        const match = html.match(/g_rgProfileData\s*=\s*\{[^}]*"url"\s*:\s*"([^"]+)"/i);
        if (match && match[1]) {
            return match[1].replace(/\\/g, '');
        }
        const locMatch = window.location.pathname.match(/^(\/(?:id|profiles)\/[^\/]+)/i);
        if (locMatch) {
            return `${window.location.origin}${locMatch[1]}/`;
        }
        const profileLink = document.querySelector('a.user_avatar, .header_profile_link, #global_header a[href*="/id/"], #global_header a[href*="/profiles/"], a[href*="/badges/"]');
        if (profileLink && profileLink.href) {
            const m = profileLink.href.match(/(https?:\/\/steamcommunity\.com\/(?:id|profiles)\/[^\/]+)/i);
            if (m) {
                return `${m[1]}/`;
            }
        }
        return 'https://steamcommunity.com/my/';
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
    // МОДУЛЬ 1: ПАРСЕР И КЭШ ДЕШЕВЫХ СЕТОВ (14 000+ ИГР)
    // =========================================================================
    let cachedSetsList = null;
    let cachedRates = null;

    async function fetchCheapSets(currencyInfo) {
        if (cachedSetsList && cachedRates) {
            return processSets(cachedSetsList, cachedRates, currencyInfo);
        }

        try {
            const storedSets = sessionStorage.getItem('slm_set_data');
            const storedRates = sessionStorage.getItem('slm_currency_rates');
            const storedTime = sessionStorage.getItem('slm_cache_time');
            if (storedSets && storedRates && storedTime && (Date.now() - parseInt(storedTime, 10) < 3600000)) {
                cachedSetsList = JSON.parse(storedSets);
                cachedRates = JSON.parse(storedRates);
                return processSets(cachedSetsList, cachedRates, currencyInfo);
            }
        } catch (e) {}

        const [setData, rateData] = await Promise.all([
            requestJson('https://cdn.steam.tools/data/set_data.json').catch(() => null),
            requestJson('https://cdn.steam.tools/data/currency.json').catch(() => null)
        ]);

        if (setData && Array.isArray(setData.sets)) {
            cachedSetsList = setData.sets;
            cachedRates = rateData || {};
            try {
                sessionStorage.setItem('slm_set_data', JSON.stringify(cachedSetsList));
                sessionStorage.setItem('slm_currency_rates', JSON.stringify(cachedRates));
                sessionStorage.setItem('slm_cache_time', Date.now().toString());
            } catch (e) {}
            return processSets(cachedSetsList, cachedRates, currencyInfo);
        }

        return getFallbackSets(currencyInfo);
    }

    function processSets(sets, rates, currencyInfo) {
        let rate = 1;
        const codeMap = { 37: 'KZT', 5: 'RUB', 18: 'UAH', 1: 'USD', 3: 'EUR', 6: 'PLN' };
        const code = codeMap[currencyInfo.currency] || 'USD';
        if (rates && rates[code]) {
            rate = rates[code];
        } else if (currencyInfo.currency === 37) {
            rate = 452;
        } else if (currencyInfo.currency === 5) {
            rate = 81;
        }

        const list = [];
        for (let i = 0; i < sets.length; i++) {
            const s = sets[i];
            if (!s.normal || !s.normal.price || s.normal.price === '0.00' || s.normal.quantity < 20) {
                continue;
            }
            const priceUsd = parseFloat(s.normal.price);
            if (isNaN(priceUsd) || priceUsd <= 0) continue;

            const count = parseInt(s.normal.count, 10) || 5;
            const priceUserCurrency = priceUsd * rate;
            const pricePerCard = priceUserCurrency / count;

            list.push({
                appid: String(s.appid),
                game: s.game || 'App ' + s.appid,
                count: count,
                priceUsd: priceUsd,
                priceUserCurrency: priceUserCurrency,
                pricePerCard: pricePerCard,
                priceFormatted: formatMoney(Math.round(priceUserCurrency * 100), currencyInfo),
                perCardFormatted: formatMoney(Math.round(pricePerCard * 100), currencyInfo),
                quantity: s.normal.quantity
            });
        }

        list.sort((a, b) => a.priceUserCurrency - b.priceUserCurrency);
        return list;
    }

    function getFallbackSets(currencyInfo) {
        const fallbacks = [
            { appid: '221540', game: 'Defense Grid 2', count: 9, priceUsd: 0.35 },
            { appid: '730', game: 'Counter-Strike 2', count: 5, priceUsd: 0.25 },
            { appid: '252490', game: 'Rust', count: 6, priceUsd: 0.32 },
            { appid: '570', game: 'Dota 2', count: 8, priceUsd: 0.36 },
            { appid: '440', game: 'Team Fortress 2', count: 9, priceUsd: 0.40 },
            { appid: '620', game: 'Portal 2', count: 8, priceUsd: 0.38 },
            { appid: '220', game: 'Half-Life 2', count: 8, priceUsd: 0.36 },
            { appid: '304930', game: 'Unturned', count: 5, priceUsd: 0.22 },
            { appid: '218620', game: 'PAYDAY 2', count: 7, priceUsd: 0.30 },
            { appid: '4000', game: "Garry's Mod", count: 9, priceUsd: 0.39 },
            { appid: '105600', game: 'Terraria', count: 9, priceUsd: 0.38 },
            { appid: '291550', game: 'Brawlhalla', count: 6, priceUsd: 0.28 },
            { appid: '230410', game: 'Warframe', count: 8, priceUsd: 0.35 }
        ];
        return processSets(fallbacks.map(f => ({ appid: f.appid, game: f.game, normal: { count: f.count, price: f.priceUsd.toString(), quantity: 100 } })), {}, currencyInfo);
    }

    // =========================================================================
    // ОФИЦИАЛЬНЫЙ STEAM MULTI-BUY (БЕЗ ПОДТВЕРЖДЕНИЙ НА ТЕЛЕФОНЕ)
    // =========================================================================
    function openMultiBuyPage(appid, cardsToBuy, targetLevel = 1) {
        if (!cardsToBuy || cardsToBuy.length === 0) return;

        // Сохраняем план покупки в sessionStorage для автоматизации на странице Multi-Buy
        const plan = {
            gameAppId: appid,
            targetLevel: targetLevel,
            returnUrl: window.location.href,
            timestamp: Date.now(),
            items: cardsToBuy.map(c => ({
                marketHashName: c.marketHashName,
                name: c.name,
                qty: c.needed || 1
            }))
        };
        try {
            sessionStorage.setItem('slm_multibuy_plan', JSON.stringify(plan));
        } catch (e) {}

        // Формируем официальный URL Multi-Buy Steam
        const itemParams = cardsToBuy.map(c => `items[]=${encodeURIComponent(c.marketHashName)}`).join('&');
        const url = `https://steamcommunity.com/market/multibuy?appid=753&${itemParams}`;

        showToast('🚀 Открываем официальный Multi-Buy Steam (без подтверждений на телефоне)...', 'info');
        const win = window.open(url, '_blank');
        if (!win) {
            window.location.href = url;
        }
    }

    async function resolveAndOpenMultiBuy(appid, cardsToBuy, targetLevel = 1) {
        if (!cardsToBuy || cardsToBuy.length === 0) return;

        // Если у какой-то карты нет ссылки на маркет (например, карта уже есть в инвентаре для уровня > 1)
        // или если hashName составлен вслепую (русское имя), уточняем через официальный список маркета
        const needsResolve = cardsToBuy.some(c => !c.marketHashName || c.marketHashName === `${appid}-${c.name}`);
        if (needsResolve) {
            try {
                showToast('⏳ Уточняем точные названия карточек на ТП...', 'info');
                const currencyInfo = getCurrencyInfo();
                const marketItems = await fetchGameMarketItems(appid, currencyInfo.currency);
                if (marketItems && marketItems.length > 0) {
                    cardsToBuy.forEach((card, idx) => {
                        const matched = matchCardWithMarket(card, marketItems, idx, cardsToBuy.length);
                        if (matched && matched.hash_name) {
                            card.marketHashName = matched.hash_name;
                        }
                    });
                }
            } catch (e) {
                console.warn('[SLM] Ошибка авто-уточнения карточек', e);
            }
        }

        openMultiBuyPage(appid, cardsToBuy, targetLevel);
    }

    async function openDirectBadgePurchaseModal(appid, targetLevel = 1) {
        const currencyInfo = getCurrencyInfo();
        showToast(`⏳ Загружаем карточки игры #${appid} с маркета...`, 'info');
        const marketItems = await fetchGameMarketItems(appid, currencyInfo.currency);
        if (!marketItems || marketItems.length === 0) {
            showToast(`Не удалось найти карточки для AppID #${appid}`, 'error');
            return;
        }

        const cardsToBuy = marketItems.map(item => ({
            name: item.name || item.hash_name,
            needed: targetLevel,
            owned: 0,
            marketHashName: item.hash_name
        }));

        openMultiBuyPage(appid, cardsToBuy, targetLevel);
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
    if (currentPath.includes('/market/multibuy')) {
        runWhenReady(initMultiBuyPage);
    } else if (currentPath.includes('/gamecards')) {
        runWhenReady(initGameCardsPage);
    } else if (currentPath.includes('/badges')) {
        runWhenReady(initBadgesPage);
    }

    // =========================================================================
    // СТРАНИЦА ОФИЦИАЛЬНОГО MULTI-BUY STEAM: /market/multibuy
    // =========================================================================
    function initMultiBuyPage() {
        if (document.getElementById('slm-panel-multibuy')) return true;

        const mainContainer = document.querySelector('#market_multibuy, #tabContentsMarket, .market_multibuy_table, #mainContents, .pagecontent') || document.body;
        if (!mainContainer) return false;

        // Считываем сохраненный план покупки (если переход был из нашего скрипта)
        let plan = null;
        try {
            const raw = sessionStorage.getItem('slm_multibuy_plan');
            if (raw) {
                plan = JSON.parse(raw);
                if (Date.now() - (plan.timestamp || 0) > 30 * 60 * 1000) {
                    plan = null;
                }
            }
        } catch (e) {}

        const panel = document.createElement('div');
        panel.id = 'slm-panel-multibuy';
        panel.className = 'slm-panel';
        panel.style.margin = '15px 0 20px 0';
        panel.innerHTML = `
            <div class="slm-title">
                <span>🚀 Steam Level Master — Официальный Multi-Buy</span>
                <span style="font-size: 13px; color: #a4d007;">🛡️ Мобильные подтверждения НЕ требуются</span>
            </div>
            <div style="font-size: 13px; margin: 10px 0; color: #c6d4df; line-height: 1.5;">
                Вы находитесь на официальной странице пакетного заказа Steam. Все выбранные карточки будут закуплены одновременно 
                <b>без необходимости подтверждать каждую позицию в приложении на телефоне</b>.
            </div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-top: 12px;">
                <button class="slm-btn slm-btn-green" id="slm-mb-btn-order" style="font-weight: bold; padding: 8px 18px; font-size: 14px;">
                    ⚡ Разместить весь заказ (1 клик)
                </button>
                <button class="slm-btn slm-btn-secondary" id="slm-mb-btn-checkbox">
                    ☑️ Принять Соглашение подписчика Steam
                </button>
                ${plan && plan.returnUrl ? `
                    <a href="${plan.returnUrl}" class="slm-btn slm-btn-secondary" style="text-decoration: none; padding: 6px 14px;">
                        🔙 Вернуться к значку
                    </a>
                ` : ''}
            </div>
            <div id="slm-mb-message" style="margin-top: 10px; font-size: 13px; color: #66c0f4; display: none;"></div>
        `;

        const targetParent = document.querySelector('#mainContents') || document.querySelector('.pagecontent') || document.body;
        if (targetParent === document.body) {
            document.body.prepend(panel);
        } else {
            targetParent.parentNode.insertBefore(panel, targetParent);
        }

        function checkAgreement() {
            const ssaCheckbox = document.querySelector('#market_multibuy_ssa, #ssa, input[name="ssa"], input[type="checkbox"][id*="ssa"]');
            if (ssaCheckbox) {
                ssaCheckbox.checked = true;
                ssaCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
                return true;
            }
            return false;
        }

        setTimeout(checkAgreement, 300);
        setTimeout(checkAgreement, 1200);

        if (plan && Array.isArray(plan.items) && plan.items.some(i => i.qty > 1)) {
            setTimeout(() => applyPlanQuantities(plan), 500);
            setTimeout(() => applyPlanQuantities(plan), 1500);
        }

        function applyPlanQuantities(p) {
            const qtyMap = new Map();
            p.items.forEach(i => qtyMap.set(i.marketHashName, i.qty));

            const inputs = document.querySelectorAll('input.market_multi_quantity, input[name*="quantity"], input[type="number"], .market_multibuy_row input[type="text"]');
            let updatedCount = 0;
            inputs.forEach(input => {
                const row = input.closest('tr, .market_multi_row, .market_multibuy_row, div[data-hash_name]');
                if (row) {
                    for (const [hashName, qty] of qtyMap.entries()) {
                        const isMatch = (row.dataset && row.dataset.hash_name === hashName) ||
                                        (row.querySelector(`a[href*="${encodeURIComponent(hashName)}"]`)) ||
                                        (row.innerHTML.includes(hashName)) ||
                                        (row.innerText && hashName.includes(row.innerText.trim()));
                        if (isMatch) {
                            if (qty > 1) {
                                input.value = qty;
                                input.dispatchEvent(new Event('change', { bubbles: true }));
                                input.dispatchEvent(new Event('input', { bubbles: true }));
                                updatedCount++;
                            }
                            break;
                        }
                    }
                }
            });
            if (updatedCount > 0) {
                const msg = panel.querySelector('#slm-mb-message');
                if (msg) {
                    msg.style.display = 'block';
                    msg.innerText = `Установлено количество для ${updatedCount} карт согласно плану значка.`;
                }
            }
        }

        panel.querySelector('#slm-mb-btn-checkbox').addEventListener('click', () => {
            if (checkAgreement()) {
                showToast('Соглашение подписчика Steam принято!', 'success');
            } else {
                showToast('Чекбокс соглашения не найден (возможно, страница ещё загружается)', 'info');
            }
        });

        panel.querySelector('#slm-mb-btn-order').addEventListener('click', () => {
            checkAgreement();
            const submitBtn = document.querySelector('#market_multibuy_submit, .market_multibuy_submit, a.btn_green_white_innerfade[onclick*="Submit"], a[onclick*="CreateBuyOrder"], button[type="submit"]');
            if (submitBtn) {
                submitBtn.click();
                const msg = panel.querySelector('#slm-mb-message');
                if (msg) {
                    msg.style.display = 'block';
                    msg.innerHTML = '<b style="color:#a4d007;">Заказ размещен!</b> После завершения покупок вернитесь к значку для быстрой ковки.';
                }
            } else {
                showToast('Нажмите зелёную кнопку «Разместить заказ» внизу таблицы Steam', 'info');
            }
        });

        return true;
    }

    // Определение текущего уровня значка конкретной игры на странице /gamecards/{appid}/
    function detectGameCardCurrentLevel() {
        let lvl = 0;

        // Собираем текст только из блоков описания значка игры (не затрагивая шапку аккаунта и задания)
        const badgeContainers = [
            document.querySelector('.badge_current'),
            document.querySelector('.badge_info_description'),
            document.querySelector('.badge_info'),
            document.querySelector('.badge_info_title'),
            document.querySelector('.badge_detail_header')
        ].filter(Boolean);

        let textToScan = '';
        for (const c of badgeContainers) {
            textToScan += ' ' + (c.innerText || '');
        }

        // Если специфичные блоки не найдены, берем верхнюю часть страницы значка
        if (!textToScan.trim()) {
            const fallbackHeader = document.querySelector('.badge_header') 
                || document.querySelector('.profile_badges_header')
                || document.querySelector('#mainContents');
            textToScan = fallbackHeader ? fallbackHeader.innerText : '';
        }

        const lowerScan = textToScan.toLowerCase();

        // 1. Проверяем явные признаки того, что значок еще НЕ скован (уровень 0)
        // В Steam для значков 0 уровня пишется: "Вы ещё не сковали этот значок" / "You haven't unlocked this badge yet"
        const unownedSelectors = '.badge_current.unowned, .badge_current.not_unlocked, .badge_info_unowned, .badge_not_unlocked';
        if (document.querySelector(unownedSelectors)) {
            return 0;
        }

        const unownedPhrases = [
            'не сковали',
            'не скован',
            'не получен',
            'haven\'t unlocked',
            'haven\'t crafted',
            'not yet unlocked',
            'not unlocked',
            'not yet crafted',
            'no badge'
        ];
        for (const phrase of unownedPhrases) {
            if (lowerScan.includes(phrase)) {
                return 0;
            }
        }

        // 2. Проверяем CSS-класс завершённости (уровень 5)
        if (document.querySelector('.badge_current.is_completed, .badge_current.completed, .badge_info.is_completed, .badge_card_set_card_area.is_completed')) {
            lvl = Math.max(lvl, 5);
        }

        // 3. Поиск по порядковым числительным в русском языке:
        // "4-й уровень", "1-й уровень", "4-го уровня", "4-ый уровень", "4-ий уровень", "4-м уровнем", "4 ур."
        const ordinalMatch = textToScan.match(/(\d+)\s*-(?:й|го|ий|ый|ой|ем|ом)\s*(?:уровень|уровня|ур\.?|level|lvl)/i);
        if (ordinalMatch) {
            lvl = Math.max(lvl, parseInt(ordinalMatch[1], 10));
        }

        // 4. Поиск "4 уровень", "1 уровень", "4 level", "1 level"
        const numFirstMatch = textToScan.match(/(\d+)\s*(?:уровень|уровня|ур\.?|level|lvl)\b/i);
        if (numFirstMatch) {
            lvl = Math.max(lvl, parseInt(numFirstMatch[1], 10));
        }

        // 5. Поиск "Уровень 4", "Level 4", "Lvl 4", "ур. 4"
        const wordFirstMatch = textToScan.match(/(?:уровень|level|lvl|ур\.?)\s*(\d+)/i);
        if (wordFirstMatch) {
            lvl = Math.max(lvl, parseInt(wordFirstMatch[1], 10));
        }

        // 6. Поиск по опыту (XP) ТОЛЬКО для уровней 2-5 (200, 300, 400, 500 XP):
        // Значок 0 уровня часто пишет "100 ед. опыта" как награду за крафт, поэтому 100 XP
        // может считаться уровнем 1 ТОЛЬКО если значок уже был получен ("получен" / "unlocked")!
        const xpMatch = textToScan.match(/(\d+)\s*(?:ед\.\s*опыта|XP)/i);
        if (xpMatch) {
            const xp = parseInt(xpMatch[1], 10);
            if (xp >= 500) {
                lvl = Math.max(lvl, 5);
            } else if (xp >= 200 && xp < 500) {
                lvl = Math.max(lvl, Math.floor(xp / 100));
            } else if (xp >= 100 && (lowerScan.includes('получен') || lowerScan.includes('unlocked'))) {
                lvl = Math.max(lvl, 1);
            }
        }

        return Math.min(Math.max(lvl, 0), 5);
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
        const currentLevel = detectGameCardCurrentLevel();

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

        const isFoil = window.location.search.includes('border=1') || window.location.href.includes('border_color=1');
        const borderColor = isFoil ? 1 : 0;
        const maxBadgeLevel = isFoil ? 1 : 5;

        // Определяем сколько полных наборов готово к крафту прямо сейчас
        const readyFullSets = cardsData.length > 0 
            ? Math.min(...cardsData.map(c => c.owned || 0)) 
            : (document.querySelector('.badge_craft_button, a[href*="Profile_CraftBadge"]') ? 1 : 0);
        const craftableLevels = Math.min(readyFullSets, Math.max(0, maxBadgeLevel - currentLevel));

        const turboBtnText = craftableLevels > 1 
            ? `⚡ Быстрый крафт ВСЕХ готовых (${craftableLevels} шт.)`
            : '⚡ Быстрый крафт готовых (Turbo Craft)';

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
                <button class="slm-btn slm-btn-green" id="slm-btn-buy-multibuy" style="font-weight: bold; background: linear-gradient(90deg, #a4d007 0%, #799905 100%); color: #fff;">
                    🛒 Купить через Multi-Buy (без подтверждений на телефоне)
                </button>
                <button class="slm-btn slm-btn-secondary" id="slm-btn-check-prices">
                    🔍 Проверить цены со стаканом (ручной режим)
                </button>
                <button class="slm-btn slm-btn-secondary" id="slm-btn-turbo-craft" ${craftableLevels > 0 || canCraftAny(currentLevel, cardsData) ? '' : 'disabled'}>
                    ${turboBtnText}
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
                const needed = Math.max(0, levelsToCraft - card.owned);
                card.needed = needed;
                totalCardsToBuy += needed;

                breakdownHtml += `<li><b>${card.name}</b>: в наличии <b>${card.owned}</b> шт. → докупить: <b style="color: ${needed > 0 ? '#66c0f4' : '#a4d007'}">${needed}</b> шт.</li>`;
            });
            breakdownHtml += `</ul>`;

            const summaryEl = panel.querySelector('#slm-calc-summary');
            const checkBtn = panel.querySelector('#slm-btn-check-prices');
            const buyMbBtn = panel.querySelector('#slm-btn-buy-multibuy');
            if (summaryEl) {
                if (levelsToCraft === 0) {
                    summaryEl.innerHTML = `<span style="color: #a4d007;">🎉 Значок уже прокачан до уровня ${currentLevel}!</span>`;
                    if (buyMbBtn) buyMbBtn.disabled = true;
                    if (checkBtn) checkBtn.disabled = true;
                } else {
                    summaryEl.innerHTML = `
                        Для уровня <b>${targetLevel}</b> нужно скрафтить значок <b>${levelsToCraft}</b> раз(а).<br>
                        Всего необходимо докупить карт: <b style="color: #66c0f4; font-size: 16px;">${totalCardsToBuy} шт.</b>
                        ${breakdownHtml}
                    `;
                    if (buyMbBtn) buyMbBtn.disabled = (totalCardsToBuy === 0);
                    if (checkBtn) checkBtn.disabled = (totalCardsToBuy === 0);
                }
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

        // Обработчик Turbo Craft (крафтит ВСЕ доступные уровни подряд)
        const turboBtn = panel.querySelector('#slm-btn-turbo-craft');
        if (turboBtn) {
            turboBtn.addEventListener('click', async () => {
                const toCraft = craftableLevels > 0 ? craftableLevels : (canCraftAny(currentLevel, cardsData) ? 1 : 1);
                turboBtn.disabled = true;
                const oldText = turboBtn.innerText;
                turboBtn.innerText = `⏳ Начинаем крафт (${toCraft} шт.)...`;
                try {
                    await turboCraftBadge(appid, borderColor, toCraft, (current, total) => {
                        turboBtn.innerText = `⏳ Сковываем уровень [${current}/${total}]...`;
                    });
                } finally {
                    turboBtn.disabled = false;
                    turboBtn.innerText = oldText;
                }
            });
        }

        // Обработчик покупки через Multi-Buy
        const buyMbBtn = panel.querySelector('#slm-btn-buy-multibuy');
        if (buyMbBtn) {
            buyMbBtn.addEventListener('click', async () => {
                const cardsToBuy = cardsData.filter(c => (c.needed || 0) > 0);
                if (cardsToBuy.length === 0) {
                    showToast('Все необходимые карты уже в наличии!', 'success');
                    return;
                }
                buyMbBtn.disabled = true;
                const oldText = buyMbBtn.innerText;
                buyMbBtn.innerText = '⏳ Открываем Multi-Buy...';
                try {
                    await resolveAndOpenMultiBuy(appid, cardsToBuy, targetLevel);
                } finally {
                    buyMbBtn.disabled = false;
                    buyMbBtn.innerText = oldText;
                }
            });
        }

        // Обработчик проверки реальных цен
        const checkBtn = panel.querySelector('#slm-btn-check-prices');
        if (checkBtn) {
            checkBtn.addEventListener('click', async () => {
                const cardsToBuy = cardsData.filter(c => c.needed > 0);
                if (cardsToBuy.length === 0) {
                    showToast('Все карты уже в наличии!', 'success');
                    return;
                }
                openPriceReviewModal(appid, cardsToBuy, targetLevel);
            });
        }

        return true;
    }

    function canCraftAny(currentLevel, cardsData) {
        if (currentLevel >= 5) return false;
        // Если на странице есть нативная кнопка ковки от Steam - значок точно готов к крафту
        if (document.querySelector('.badge_craft_button, a[href*="Profile_CraftBadge"]')) {
            return true;
        }
        // Или если у каждой карты есть хотя бы 1 штука
        return cardsData.length > 0 && cardsData.every(c => (c.owned || 0) >= 1);
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
                    <div style="display:flex; gap:10px; align-items:center;">
                        <button class="slm-btn slm-btn-secondary" id="slm-btn-cancel">Отмена</button>
                        <button class="slm-btn slm-btn-green" id="slm-btn-modal-multibuy" style="font-weight:bold; background: linear-gradient(90deg, #a4d007 0%, #799905 100%);">
                            🚀 Multi-Buy (0 подтверждений)
                        </button>
                        <button class="slm-btn slm-btn-secondary" id="slm-btn-execute-orders" disabled title="Прямое выставление ордеров через API (может потребовать подтверждение в Steam Mobile)">
                            🛒 Выставить ордеры API
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modalBackdrop);

        const closeModal = () => modalBackdrop.remove();
        modalBackdrop.querySelector('#slm-modal-close').onclick = closeModal;
        modalBackdrop.querySelector('#slm-btn-cancel').onclick = closeModal;

        const modalMbBtn = modalBackdrop.querySelector('#slm-btn-modal-multibuy');
        if (modalMbBtn) {
            modalMbBtn.onclick = () => {
                const selectedItems = (typeof marketResults !== 'undefined' && Array.isArray(marketResults))
                    ? marketResults.filter(r => r.selected)
                    : [];
                const cardsForMb = (selectedItems.length > 0
                    ? selectedItems.map(r => ({
                        marketHashName: r.card.marketHashName,
                        name: r.card.name,
                        needed: r.card.needed
                      }))
                    : cardsToBuy.filter(c => (c.needed || 0) > 0));

                if (cardsForMb.length === 0) {
                    showToast('Не выбрано ни одной карты для покупки!', 'error');
                    return;
                }
                closeModal();
                openMultiBuyPage(appid, cardsForMb, targetLevel);
            };
        }

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

            let successCount = 0;
            let needsConfirmationCount = 0;
            const total = selectedItems.length;

            for (let i = 0; i < total; i++) {
                const item = selectedItems[i];
                btn.innerText = `⏳ Выставляем ордер [${i + 1}/${total}]...`;
                const unitPrice = strategy === 'instant' ? item.instantUnitPrice : item.minUnitPrice;
                const result = await createBuyOrder(item.card.marketHashName, item.card.needed, unitPrice, currency);
                if (result.success) {
                    successCount++;
                    if (result.requiresConfirmation) {
                        needsConfirmationCount++;
                    }
                }

                // Задержка против антифрода и рейт-лимита Steam (1.4 - 2.2 сек со случайным смещением)
                if (i < total - 1) {
                    const delay = 1400 + Math.floor(Math.random() * 800);
                    await sleep(delay);
                }
            }

            if (needsConfirmationCount > 0) {
                // Steam потребовал 2FA-подтверждение на телефоне
                const modalBody = modalBackdrop.querySelector('.slm-modal-body');
                const modalFooter = modalBackdrop.querySelector('.slm-modal-footer');
                if (modalFooter) modalFooter.style.display = 'none';

                if (modalBody) {
                    modalBody.innerHTML = `
                        <div style="text-align:center; padding: 25px 15px;">
                            <div style="font-size: 46px; margin-bottom: 12px;">📱</div>
                            <h3 style="color: #e5c158; font-size: 19px; margin-bottom: 10px;">Требуется подтверждение в Steam Mobile</h3>
                            <p style="color: #c6d4df; font-size: 13px; line-height: 1.6; max-width: 500px; margin: 0 auto 16px auto;">
                                Steam запросил подтверждение для <b>${needsConfirmationCount}</b> из ${total} ордеров в мобильном приложении на телефоне.
                            </p>
                            <div style="background: rgba(0,0,0,0.35); border: 1px solid rgba(102, 192, 244, 0.3); border-radius: 6px; padding: 14px; text-align: left; font-size: 13px; max-width: 460px; margin: 0 auto 20px auto;">
                                <div style="color: #66c0f4; font-weight: bold; margin-bottom: 6px;">⚡ Как подтвердить всё за 3 секунды:</div>
                                1. Откройте приложение <b>Steam</b> на телефоне.<br>
                                2. Перейдите во вкладку <b>«Подтверждения»</b>.<br>
                                3. Вверху справа поставьте галочку <b>«Выбрать всё»</b>.<br>
                                4. Нажмите внизу зелёную кнопку <b>«Подтвердить выбранное»</b>.
                            </div>
                            <div style="display:flex; justify-content:center; gap: 12px;">
                                <button class="slm-btn slm-btn-green" id="slm-btn-confirm-done" style="padding: 10px 22px; font-size: 14px;">
                                    🔄 Я подтвердил на телефоне (проверить карточки)
                                </button>
                                <button class="slm-btn slm-btn-secondary" id="slm-btn-confirm-close" style="padding: 10px 18px;">
                                    Закрыть
                                </button>
                            </div>
                        </div>
                    `;

                    modalBackdrop.querySelector('#slm-btn-confirm-done').onclick = () => {
                        window.location.reload();
                    };
                    modalBackdrop.querySelector('#slm-btn-confirm-close').onclick = closeModal;
                }
                showToast(`📱 Подтвердите ордеры в приложении Steam на телефоне!`, 'info', 7000);
            } else {
                closeModal();
                showToast(`✅ Успешно создано ${successCount} из ${selectedItems.length} ордеров!`, 'success');

                setTimeout(() => {
                    window.location.reload();
                }, 1800);
            }
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
            const rawMsg = (data && data.message) ? String(data.message).toLowerCase() : '';
            const requiresConfirmation = !!(
                data.requires_confirmation === 1 || 
                data.requires_confirmation === true ||
                data.needs_mobile_confirmation ||
                rawMsg.includes('подтвержден') ||
                rawMsg.includes('confirmation') ||
                rawMsg.includes('steam guard')
            );

            if (data.success === 1) {
                return { 
                    success: true, 
                    buy_orderid: data.buy_orderid,
                    requiresConfirmation: requiresConfirmation
                };
            } else if (requiresConfirmation || data.success === 29) {
                // Если Steam вернул статус с необходимостью подтверждения
                return { 
                    success: true, 
                    buy_orderid: data.buy_orderid || null, 
                    requiresConfirmation: true,
                    message: data.message 
                };
            } else {
                showToast(`Ошибка ордера для ${marketHashName}: ${data.message || 'Код ' + data.success}`, 'error');
                return { success: false, message: data.message, code: data.success, requiresConfirmation: false };
            }
        } catch (err) {
            console.error('[SLM] Ошибка отправки ордера', err);
            return { success: false, message: err.message, requiresConfirmation: false };
        }
    }

    // =========================================================================
    // API: TURBO CRAFT (Мгновенный крафт значка без анимации)
    // =========================================================================
    function sendCraftRequest(profileUrl, appid, sessionid, borderColor = 0) {
        return new Promise((resolve, reject) => {
            const fullUrl = `${profileUrl.replace(/\/+$/, '')}/ajaxcraftbadge/`;
            const postData = {
                appid: String(appid),
                series: '1',
                border_color: String(borderColor),
                sessionid: String(sessionid)
            };

            // Способ 1: Использование jQuery Steam (unsafeWindow.$J) - самый надежный вариант внутри Steam
            let hasJQuery = false;
            try {
                if (typeof unsafeWindow !== 'undefined' && unsafeWindow && unsafeWindow.$J && typeof unsafeWindow.$J.ajax === 'function') {
                    hasJQuery = true;
                    unsafeWindow.$J.ajax({
                        url: fullUrl,
                        type: 'POST',
                        data: postData,
                        dataType: 'json'
                    }).done((data) => {
                        resolve(data);
                    }).fail((jqXHR, textStatus, errorThrown) => {
                        console.warn('[SLM] $J.ajax завершился ошибкой, пробуем fetch...', textStatus, errorThrown);
                        tryFetch();
                    });
                }
            } catch (err) {
                console.warn('[SLM] Ошибка при вызове $J.ajax:', err);
            }

            if (!hasJQuery) {
                tryFetch();
            }

            // Способ 2: fetch с credentials: 'include'
            function tryFetch() {
                const body = new URLSearchParams();
                for (const key in postData) {
                    body.append(key, postData[key]);
                }

                fetch(fullUrl, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json, text/javascript, */*; q=0.01'
                    },
                    body: body.toString()
                })
                .then(async resp => {
                    const text = await resp.text();
                    try {
                        const json = JSON.parse(text);
                        resolve(json);
                    } catch (e) {
                        throw new Error(`Ответ сервера не JSON (${resp.status}): ${text.slice(0, 120)}`);
                    }
                })
                .catch(err => {
                    console.warn('[SLM] fetch завершился ошибкой, пробуем GM_xmlhttpRequest...', err);
                    tryGM(err);
                });
            }

            // Способ 3: GM_xmlhttpRequest
            function tryGM(fetchErr) {
                if (typeof GM_xmlhttpRequest === 'function') {
                    const body = new URLSearchParams();
                    for (const key in postData) {
                        body.append(key, postData[key]);
                    }

                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: fullUrl,
                        data: body.toString(),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'X-Requested-With': 'XMLHttpRequest',
                            'Accept': 'application/json, text/javascript, */*; q=0.01'
                        },
                        onload: (res) => {
                            try {
                                const data = JSON.parse(res.responseText);
                                resolve(data);
                            } catch (parseErr) {
                                reject(new Error(`Ответ сервера не JSON (${res.status}): ${res.responseText.slice(0, 120)}`));
                            }
                        },
                        onerror: (err) => reject(new Error(`GM_xmlhttpRequest error: ${err}`))
                    });
                } else {
                    reject(fetchErr);
                }
            }
        });
    }

    function isCraftSuccess(data) {
        if (!data) return false;
        if (data.success === 1 || data.success === true || data.success === '1') return true;
        if (data.Badge || data.badge || data.rgBadgeData || data.rgDrops) return true;
        return false;
    }

    async function turboCraftBadge(appid, borderColor = 0, maxCrafts = 5, onProgress = null) {
        const sessionid = getSessionID();
        const profileUrl = getSteamProfileUrl();

        if (!sessionid) {
            showToast('Не удалось определить SessionID Steam. Попробуйте обновить страницу.', 'error');
            return false;
        }

        let successCount = 0;
        let lastError = null;

        for (let i = 0; i < maxCrafts; i++) {
            const stepNum = i + 1;
            const msg = maxCrafts > 1 
                ? `⚡ Сковываем значок [${stepNum}/${maxCrafts}] для AppID: ${appid}...`
                : `⚡ Сковываем значок для AppID: ${appid}...`;

            showToast(msg, 'info');
            if (typeof onProgress === 'function') {
                onProgress(stepNum, maxCrafts);
            }

            try {
                const data = await sendCraftRequest(profileUrl, appid, sessionid, borderColor);
                if (isCraftSuccess(data)) {
                    successCount++;
                    if (i < maxCrafts - 1) {
                        await sleep(700);
                    }
                } else {
                    lastError = data.message || data.error || (data.success ? `Код: ${data.success}` : 'Недостаточно карточек для следующего уровня');
                    break;
                }
            } catch (e) {
                lastError = e.message;
                break;
            }
        }

        if (successCount > 0) {
            if (successCount === 1) {
                showToast(`🎉 Значок успешно скрафчен! Уровень повышен!`, 'success');
            } else {
                showToast(`🎉 Успешно сковано ${successCount} значков подряд! Перезагрузка страницы...`, 'success');
            }
            setTimeout(() => window.location.reload(), 1400);
            return true;
        } else {
            showToast(`Не удалось сковать значок: ${lastError || 'Проверьте наличие карт'}`, 'error');
            return false;
        }
    }

    // =========================================================================
    // СТРАНИЦА ОБЩИХ ЗНАЧКОВ: /badges/
    // =========================================================================
    function initBadgesPage() {
        if (document.getElementById('slm-panel-badges')) return true;

        const badgeRows = document.querySelectorAll('.badge_row');
        if (!badgeRows || badgeRows.length === 0) return false;

        const currencyInfo = getCurrencyInfo();

        let allLoadedSets = null;
        let filteredSets = [];
        let currentPage = 1;
        const pageSize = 20;

        // 1. Считываем текущий уровень пользователя из шапки Steam
        let userCurrentLevel = 1;
        const lvlEl = document.querySelector('.friendPlayerLevelNum') 
            || document.querySelector('.persona_level .friendPlayerLevelNum')
            || document.querySelector('.playerAvatar .friendPlayerLevelNum');
        if (lvlEl) {
            userCurrentLevel = parseInt(lvlEl.innerText.trim(), 10) || 1;
        }
        const titleLvl = document.querySelector('.profile_badges_header .badge_info_title');
        if (titleLvl) {
            const m = titleLvl.innerText.match(/(?:Уровень|Level)\s*(\d+)/i);
            if (m) userCurrentLevel = parseInt(m[1], 10);
        }

        // 2. Считываем значки пользователя и их текущие уровни
        const userBadgeLevels = new Map();
        const readyBadges = [];

        function isBadgeRowReadyToCraft(row, currentLvl = 0) {
            if (!row) return false;

            // 1. Исключаем значки 5 уровня (максимальный уровень уже скрафчен)
            if (currentLvl >= 5 || row.classList.contains('is_completed') || row.classList.contains('completed')) {
                return false;
            }

            // 2. Ищем зеленую кнопку Steam (.btn_green_white_innerfade)
            // В Steam на странице значков:
            // - Зеленая кнопка на ТП ведет на /market/ и содержит слово "купить" / "buy"
            // - Зеленая кнопка готовности ведет на /gamecards/ со словом "Готов" / "Ready"
            const greenBtn = row.querySelector('.btn_green_white_innerfade, a[class*="btn_green"]');
            if (greenBtn) {
                const href = (greenBtn.href || '').toLowerCase();
                const text = (greenBtn.innerText || '').replace(/\s+/g, ' ').trim().toLowerCase();
                // Если это НЕ кнопка покупки на ТП
                if (!href.includes('/market/') && !text.includes('купить') && !text.includes('buy')) {
                    // Если ведет на карты или имеет текст готовности
                    if (href.includes('/gamecards/') || /готов|ready|сковать|craft/i.test(text)) {
                        return true;
                    }
                }
            }

            // 3. Проверяем любые кнопки/ссылки внутри строки с текстом готовности к ковке
            const allLinks = row.querySelectorAll('a.btn_small_thin, a[href*="/gamecards/"], .badge_craft_button');
            for (const link of allLinks) {
                const text = (link.innerText || '').replace(/\s+/g, ' ').trim().toLowerCase();
                const href = (link.href || '').toLowerCase();
                if (href.includes('/market/') || text.includes('купить') || text.includes('просмотр') || text.includes('как получить')) {
                    continue;
                }
                if (/готов|ready|сковать|craft/i.test(text)) {
                    return true;
                }
            }

            // 4. Проверяем счетчик собранных карт в строке (например: "5 из 5 карт собрано" или "8 of 8")
            const progressEl = row.querySelector('.progress_info_bold, .badge_progress_info');
            if (progressEl) {
                const pText = progressEl.innerText.trim();
                const m = pText.match(/(\d+)\s*(?:из|\/|of)\s*(\d+)/i);
                if (m) {
                    const owned = parseInt(m[1], 10);
                    const total = parseInt(m[2], 10);
                    if (total > 0 && total <= 30 && owned >= total) {
                        return true;
                    }
                }
            }

            return false;
        }

        function parseBadgesFromDoc(doc) {
            const rows = doc.querySelectorAll('.badge_row');
            rows.forEach(row => {
                const link = row.querySelector('a.badge_row_overlay') 
                    || row.querySelector('a[href*="/gamecards/"]')
                    || row.querySelector('.badge_title a')
                    || row.querySelector('.badge_icon a');
                if (!link || !link.href) return;

                const match = link.href.match(/\/gamecards\/(\d+)/);
                if (!match) return;
                const appid = match[1];

                const isFoil = link.href.includes('border=1');
                if (isFoil) return; // Металлические значки не заменяют обычные 1-5 ур.

                let lvl = 0;

                // 1. Проверяем CSS-класс завершённости Steam (.is_completed или .completed)
                if (row.classList.contains('is_completed') || row.classList.contains('completed')) {
                    lvl = 5;
                }

                // 2. Проверяем весь текст плашки значка
                const fullText = (row.innerText || '').replace(/\s+/g, ' ');

                // Опыт: 500 ед. опыта = 5 уровень, 400 = 4 и т.д.
                const xpMatch = fullText.match(/(\d+)\s*(?:ед\.\s*опыта|XP)/i);
                if (xpMatch) {
                    const xp = parseInt(xpMatch[1], 10);
                    if (xp >= 500) lvl = Math.max(lvl, 5);
                    else if (xp >= 200) lvl = Math.max(lvl, Math.floor(xp / 100));
                    else if (xp >= 100 && (fullText.includes('уровн') || fullText.includes('level') || fullText.includes('получен') || fullText.includes('unlocked'))) {
                        lvl = Math.max(lvl, 1);
                    }
                }

                // Указание уровня: "4-й уровень", "Уровень 5", "Level 5", "ур. 5", "5 ур.", "5 уровня", "5-го уровня", "Lvl 5"
                const ordinalMatch = fullText.match(/(\d+)\s*-(?:й|го|ий|ый|ой|ем|ом)\s*(?:уровень|уровня|ур\.?|level|lvl)/i);
                if (ordinalMatch) {
                    lvl = Math.max(lvl, parseInt(ordinalMatch[1], 10));
                }

                const lvlMatch1 = fullText.match(/(?:Уровень|Level|ур\.?|lvl)\s*(\d+)/i);
                if (lvlMatch1) {
                    lvl = Math.max(lvl, parseInt(lvlMatch1[1], 10));
                }

                const lvlMatch2 = fullText.match(/(\d+)\s*(?:ур|уровн|lvl|level)/i);
                if (lvlMatch2) {
                    lvl = Math.max(lvl, parseInt(lvlMatch2[1], 10));
                }

                lvl = Math.min(Math.max(lvl, 0), 5);

                const prevLvl = userBadgeLevels.get(appid) || 0;
                userBadgeLevels.set(appid, Math.max(prevLvl, lvl));

                if (lvl < 5 && isBadgeRowReadyToCraft(row, lvl)) {
                    if (!readyBadges.some(b => b.appid === appid)) {
                        readyBadges.push({ appid, row });
                    }
                    if (doc === document && !row.querySelector('.slm-row-turbo-craft-btn')) {
                        const craftBtn = document.createElement('button');
                        craftBtn.className = 'slm-btn slm-btn-green slm-row-turbo-craft-btn';
                        craftBtn.style.cssText = 'padding: 4px 10px; font-size: 12px; margin-left: 8px; vertical-align: middle; cursor: pointer;';
                        craftBtn.innerHTML = '⚡ Быстрый крафт';
                        craftBtn.title = 'Сковать значок моментально без анимаций';
                        craftBtn.onclick = async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            craftBtn.disabled = true;
                            craftBtn.innerText = '⏳ Крафт...';
                            const ok = await turboCraftBadge(appid);
                            if (!ok) {
                                craftBtn.disabled = false;
                                craftBtn.innerText = '⚡ Быстрый крафт';
                            }
                        };
                        const readyLink = Array.from(row.querySelectorAll('a[href*="/gamecards/"]')).find(a => {
                            const t = (a.innerText || '').trim().toLowerCase();
                            return /^(?:готов|ready|сковать)/i.test(t);
                        }) || row.querySelector('.btn_green_white_innerfade[href*="/gamecards/"]')
                           || row.querySelector('a[href*="/gamecards/"]');

                        if (readyLink && readyLink.parentNode) {
                            readyLink.parentNode.insertBefore(craftBtn, readyLink.nextSibling);
                        } else {
                            const actionContainer = row.querySelector('.badge_row_inner') || row;
                            actionContainer.appendChild(craftBtn);
                        }
                    }
                }
            });
        }

        // Парсим текущую открытую страницу
        parseBadgesFromDoc(document);

        // Функция фоновой дозагрузки остальных страниц значков пользователя (?p=2, ?p=3...)
        async function fetchOtherBadgesPages() {
            const pageLinks = Array.from(document.querySelectorAll('a.pagelink, a[href*="/badges/"][href*="p="], a[href*="/badges?p="]'));
            const urls = new Set();
            pageLinks.forEach(a => {
                if (a.href && (a.href.includes('p=') || a.href.includes('page='))) {
                    urls.add(a.href);
                }
            });

            if (urls.size === 0) return;

            let updated = false;
            for (const url of urls) {
                try {
                    const resp = await fetch(url);
                    const html = await resp.text();
                    const doc = new DOMParser().parseFromString(html, 'text/html');
                    parseBadgesFromDoc(doc);
                    updated = true;
                } catch (e) {
                    console.warn('[SLM] Не удалось загрузить страницу значков ' + url, e);
                }
            }

            if (updated) {
                console.log(`[SLM] Все страницы значков загружены! Всего распознано значков игр: ${userBadgeLevels.size}`);
                applyCatalogFilters();
                renderCatalogTable();
                updateCraftTabUI();
            }
        }

        // 3. Ищем контейнер для шапки
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
                <span>🚀 Steam Level Master</span>
                <span style="font-size: 13px; color: #8f98a0;">Ваш уровень: <b style="color:#66c0f4; font-size:15px;">${userCurrentLevel}</b> | Валюта: <b style="color:#a4d007">${currencyInfo.symbol}</b></span>
            </div>

            <!-- Вкладки панели -->
            <div class="slm-tabs">
                <button class="slm-tab-btn active" data-tab="catalog">🏷️ Каталог дешёвых сетов (14 000+)</button>
                <button class="slm-tab-btn" data-tab="craft">⚡ Быстрый крафт (${readyBadges.length} готово)</button>
            </div>

            <!-- ВКЛАДКА 1: КАТАЛОГ ДЕШЕВЫХ СЕТОВ -->
            <div class="slm-tab-pane active" id="slm-pane-catalog">
                <div class="slm-toolbar">
                    <div class="slm-filter-group">
                        <input type="text" id="slm-catalog-search" class="slm-input" placeholder="🔍 Поиск игры..." style="width: 220px;">
                        <label style="cursor:pointer; display:flex; align-items:center; gap:5px;">
                            <input type="checkbox" id="slm-catalog-hide-done" checked>
                            <span>Скрыть завершённые (ур. 5)</span>
                        </label>
                        <label style="cursor:pointer; display:flex; align-items:center; gap:5px;">
                            <input type="checkbox" id="slm-catalog-only-5">
                            <span>Только 5 карт</span>
                        </label>
                    </div>
                    <button class="slm-btn slm-btn-secondary" id="slm-catalog-refresh-btn" style="padding:6px 12px; font-size:12px;">
                        🔄 Обновить цены базы
                    </button>
                </div>

                <div id="slm-catalog-loader" style="text-align: center; padding: 30px; color: #66c0f4;">
                    ⏳ Загружаем каталог цен карточек (14 000+ игр)...
                </div>

                <div class="slm-table-container" id="slm-catalog-table-wrap" style="display:none;">
                    <table class="slm-table">
                        <thead>
                            <tr>
                                <th>Игра</th>
                                <th width="70">Карт</th>
                                <th width="120">Цена сета</th>
                                <th width="110">За карту</th>
                                <th width="110">Ваш значок</th>
                                <th width="180">Действие</th>
                            </tr>
                        </thead>
                        <tbody id="slm-catalog-tbody"></tbody>
                    </table>
                </div>

                <div class="slm-pagination" id="slm-catalog-pagination" style="display:none;">
                    <button class="slm-btn slm-btn-secondary" id="slm-page-prev" style="padding:5px 12px;">« Назад</button>
                    <span id="slm-page-text">Страница 1 из 1</span>
                    <button class="slm-btn slm-btn-secondary" id="slm-page-next" style="padding:5px 12px;">Вперёд »</button>
                </div>
            </div>

            <!-- ВКЛАДКА 2: БЫСТРЫЙ КРАФТ (TURBO CRAFT) -->
            <div class="slm-tab-pane" id="slm-pane-craft">
                <div style="background: rgba(0,0,0,0.25); padding: 18px; border-radius: 6px;">
                    <div style="font-size: 15px; margin-bottom: 12px;">
                        Готово к крафту на текущей странице: <b style="color: #a4d007; font-size: 18px;" id="slm-craft-count-num">${readyBadges.length}</b> значков.
                    </div>
                    <button class="slm-btn slm-btn-green" id="slm-mass-craft-btn" ${readyBadges.length > 0 ? '' : 'disabled'}>
                        ⚡ Скрафтить ВСЕ готовые значки пачкой (${readyBadges.length})
                    </button>
                    <div id="slm-mass-craft-progress" style="margin-top: 14px; display: none; font-size: 13px; color: #66c0f4;"></div>
                </div>
            </div>
        `;

        if (header === document.body || header.id === 'mainContents') {
            header.prepend(bar);
        } else {
            header.parentNode.insertBefore(bar, header);
        }

        console.log('[SLM] Панель обзора значков успешно встроена!');

        // --- ЛОГИКА ПЕРЕКЛЮЧЕНИЯ ВКЛАДОК ---
        const tabBtns = bar.querySelectorAll('.slm-tab-btn');
        const tabPanes = {
            catalog: bar.querySelector('#slm-pane-catalog'),
            craft: bar.querySelector('#slm-pane-craft')
        };

        function switchTab(tabKey) {
            tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabKey));
            for (const key in tabPanes) {
                if (tabPanes[key]) tabPanes[key].classList.toggle('active', key === tabKey);
            }
            if (tabKey === 'catalog' && !allLoadedSets) {
                loadCatalogData();
            }
        }

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });

        // Запуск загрузки каталога сразу
        loadCatalogData();

        // --- ЛОГИКА КАТАЛОГА ДЕШЕВЫХ СЕТОВ ---
        async function loadCatalogData(forceRefresh = false) {
            const loader = bar.querySelector('#slm-catalog-loader');
            const tableWrap = bar.querySelector('#slm-catalog-table-wrap');
            const pagination = bar.querySelector('#slm-catalog-pagination');

            loader.style.display = 'block';
            tableWrap.style.display = 'none';
            pagination.style.display = 'none';

            if (forceRefresh) {
                try {
                    sessionStorage.removeItem('slm_set_data');
                    sessionStorage.removeItem('slm_currency_rates');
                } catch (e) {}
            }

            try {
                allLoadedSets = await fetchCheapSets(currencyInfo);
                applyCatalogFilters();
            } catch (err) {
                console.error('[SLM] Ошибка загрузки каталога', err);
                loader.innerHTML = `<span style="color:#e74c3c;">Не удалось загрузить цены маркета. Попробуйте еще раз.</span>`;
            }
        }

        function applyCatalogFilters() {
            if (!allLoadedSets) return;
            const searchVal = bar.querySelector('#slm-catalog-search').value.toLowerCase().trim();
            const hideDone = bar.querySelector('#slm-catalog-hide-done').checked;
            const only5 = bar.querySelector('#slm-catalog-only-5').checked;

            filteredSets = allLoadedSets.filter(item => {
                if (searchVal && !item.game.toLowerCase().includes(searchVal)) {
                    return false;
                }
                const userLvl = userBadgeLevels.get(item.appid) || 0;
                if (hideDone && userLvl >= 5) {
                    return false;
                }
                if (only5 && item.count !== 5) {
                    return false;
                }
                return true;
            });

            currentPage = 1;
            renderCatalogTable();
        }

        function renderCatalogTable() {
            const loader = bar.querySelector('#slm-catalog-loader');
            const tableWrap = bar.querySelector('#slm-catalog-table-wrap');
            const pagination = bar.querySelector('#slm-catalog-pagination');
            const tbody = bar.querySelector('#slm-catalog-tbody');
            const pageText = bar.querySelector('#slm-page-text');

            loader.style.display = 'none';
            tableWrap.style.display = 'block';
            pagination.style.display = 'flex';

            tbody.innerHTML = '';
            const totalPages = Math.max(1, Math.ceil(filteredSets.length / pageSize));
            if (currentPage > totalPages) currentPage = totalPages;

            pageText.innerText = `Страница ${currentPage} из ${totalPages} (${filteredSets.length} сетов)`;
            bar.querySelector('#slm-page-prev').disabled = (currentPage <= 1);
            bar.querySelector('#slm-page-next').disabled = (currentPage >= totalPages);

            const startIdx = (currentPage - 1) * pageSize;
            const pageItems = filteredSets.slice(startIdx, startIdx + pageSize);

            if (pageItems.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:#8f98a0;">По заданным фильтрам ничего не найдено.</td></tr>`;
                return;
            }

            pageItems.forEach(item => {
                const userLvl = userBadgeLevels.get(item.appid) || 0;
                let statusBadge = `<span class="slm-badge-pill slm-badge-pill-new">0/5</span>`;
                if (userLvl >= 5) {
                    statusBadge = `<span class="slm-badge-pill slm-badge-pill-done">Завершён (5/5)</span>`;
                } else if (userLvl > 0) {
                    statusBadge = `<span class="slm-badge-pill slm-badge-pill-progress">${userLvl}/5</span>`;
                }

                const buyBtnHtml = userLvl >= 5
                    ? `<button class="slm-btn slm-btn-secondary" disabled style="padding:4px 8px; font-size:11px; opacity:0.6; cursor:default;" title="Значок уже максимального уровня (5/5)">✓ Макс. ур.</button>`
                    : `<button class="slm-btn slm-btn-green slm-buy-direct-btn" data-appid="${item.appid}" style="padding:4px 8px; font-size:11px;" title="Купить через официальный Multi-Buy без подтверждений на телефоне">🛒 Multi-Buy</button>`;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <a href="https://steamcommunity.com/my/gamecards/${item.appid}/" target="_blank" style="color:#66c0f4; font-weight:bold; text-decoration:none;">
                            ${item.game}
                        </a>
                        <div style="font-size:11px; color:#8f98a0;">AppID: ${item.appid}</div>
                    </td>
                    <td><span class="slm-badge-card-tag">${item.count} карт</span></td>
                    <td style="font-weight:bold; color:#a4d007;">${item.priceFormatted}</td>
                    <td style="color:#c6d4df;">${item.perCardFormatted}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div style="display:flex; gap:6px;">
                            <a href="https://steamcommunity.com/my/gamecards/${item.appid}/" target="_blank" class="slm-btn slm-btn-secondary" style="padding:4px 8px; font-size:11px;">
                                🔗 Открыть
                            </a>
                            ${buyBtnHtml}
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // Обработчик кнопки покупки прямо из каталога
            tbody.querySelectorAll('.slm-buy-direct-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const appid = e.currentTarget.dataset.appid;
                    openDirectBadgePurchaseModal(appid, 1);
                });
            });
        }

        // События пагинации и фильтров
        bar.querySelector('#slm-page-prev').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderCatalogTable();
                tableWrap.scrollTop = 0;
            }
        });
        bar.querySelector('#slm-page-next').addEventListener('click', () => {
            const totalPages = Math.ceil(filteredSets.length / pageSize);
            if (currentPage < totalPages) {
                currentPage++;
                renderCatalogTable();
                tableWrap.scrollTop = 0;
            }
        });
        bar.querySelector('#slm-catalog-search').addEventListener('input', applyCatalogFilters);
        bar.querySelector('#slm-catalog-hide-done').addEventListener('change', applyCatalogFilters);
        bar.querySelector('#slm-catalog-only-5').addEventListener('change', applyCatalogFilters);
        bar.querySelector('#slm-catalog-refresh-btn').addEventListener('click', () => loadCatalogData(true));

        // Фоновая предварительная подгрузка цен и остальных страниц значков
        setTimeout(() => {
            fetchCheapSets(currencyInfo).then(sets => {
                allLoadedSets = sets;
            }).catch(() => {});
            fetchOtherBadgesPages().catch(() => {});
        }, 500);

        // --- ЛОГИКА ТУРБО-КРАФТА ---
        function updateCraftTabUI() {
            const tabBtn = bar.querySelector('.slm-tab-btn[data-tab="craft"]');
            if (tabBtn) {
                tabBtn.innerText = `⚡ Быстрый крафт (${readyBadges.length} готово)`;
            }
            const countEl = bar.querySelector('#slm-craft-count-num');
            if (countEl) {
                countEl.innerText = `${readyBadges.length}`;
            }
            const massBtn = bar.querySelector('#slm-mass-craft-btn');
            if (massBtn) {
                massBtn.disabled = (readyBadges.length === 0);
                massBtn.innerText = `⚡ Скрафтить ВСЕ готовые значки пачкой (${readyBadges.length})`;
            }
        }

        const massBtn = bar.querySelector('#slm-mass-craft-btn');
        if (massBtn) {
            massBtn.onclick = async () => {
                if (readyBadges.length === 0) {
                    showToast('На странице нет готовых к крафту значков', 'info');
                    return;
                }

                if (!confirm(`Вы уверены, что хотите мгновенно скрафтить все доступные значки (${readyBadges.length} шт.)?`)) {
                    return;
                }

                massBtn.disabled = true;
                const progress = bar.querySelector('#slm-mass-craft-progress');
                if (progress) progress.style.display = 'block';

                let successCount = 0;
                let failCount = 0;
                let count = 0;

                for (const item of readyBadges) {
                    count++;
                    if (progress) progress.innerText = `⏳ Крафтим [${count}/${readyBadges.length}] AppID: ${item.appid}...`;
                    const res = await turboCraftBadgeSilent(item.appid);
                    if (res.success) {
                        successCount += (res.count || 1);
                    } else {
                        failCount++;
                        console.warn(`[SLM] Не удалось сковать значок AppID ${item.appid}:`, res.message);
                    }
                    await sleep(600);
                }

                if (successCount > 0 && failCount === 0) {
                    if (progress) progress.innerHTML = `<b style="color: #a4d007;">🎉 Все значки (всего ${successCount} уровней) успешно скрафчены! Перезагрузка страницы...</b>`;
                    setTimeout(() => window.location.reload(), 1500);
                } else if (successCount > 0 && failCount > 0) {
                    if (progress) progress.innerHTML = `<b style="color: #66c0f4;">Скрафчено уровней: ${successCount}, Ошибок: ${failCount}. Перезагрузка страницы...</b>`;
                    setTimeout(() => window.location.reload(), 2000);
                } else {
                    if (progress) progress.innerHTML = `<b style="color: #ff4d4d;">❌ Не удалось скрафтить значки (Ошибок: ${failCount}). Проверьте наличие карт и консоль браузера (F12).</b>`;
                    massBtn.disabled = false;
                }
            };
        }

        return true;
    }

    async function turboCraftBadgeSilent(appid, borderColor = 0, maxCrafts = 5) {
        const sessionid = getSessionID();
        const profileUrl = getSteamProfileUrl();
        if (!sessionid) return { success: false, message: 'Не найден SessionID Steam' };

        let successCount = 0;
        let lastError = null;

        for (let i = 0; i < maxCrafts; i++) {
            try {
                const data = await sendCraftRequest(profileUrl, appid, sessionid, borderColor);
                if (isCraftSuccess(data)) {
                    successCount++;
                    if (i < maxCrafts - 1) {
                        await sleep(700);
                    }
                } else {
                    lastError = data.message || data.error || (data.success ? `Код: ${data.success}` : 'Закончились карточки');
                    break;
                }
            } catch (e) {
                lastError = e.message;
                break;
            }
        }

        if (successCount > 0) {
            return { success: true, count: successCount };
        } else {
            return { success: false, message: lastError || 'Ошибка крафта' };
        }
    }

})();
