// ==UserScript==
// @name         Steam Level & Badge Master
// @namespace    https://github.com/8w28tt/vq9378j5389469384v6jwwerkpko
// @version      1.2.5
// @description  Умный калькулятор значков, каталог самых дешёвых сетов, проверка реальных цен ТП со стаканом (Instant-Fill) и мгновенный крафт без анимаций.
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
        /* Калькулятор уровня */
        .slm-calc-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
            gap: 12px;
            margin: 16px 0;
        }
        .slm-stat-card {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid #2a475e;
            border-radius: 6px;
            padding: 14px;
            text-align: center;
        }
        .slm-stat-title {
            font-size: 11px;
            color: #8f98a0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }
        .slm-stat-value {
            font-size: 22px;
            font-weight: bold;
            color: #66c0f4;
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
    // МОДУЛЬ 1: КАЛЬКУЛЯТОР УРОВНЯ (ФОРМУЛЫ ОПЫТА STEAM)
    // =========================================================================
    function getXpForLevel(targetLevel) {
        let total = 0;
        for (let i = 0; i < targetLevel; i++) {
            total += (Math.floor(i / 10) + 1) * 100;
        }
        return total;
    }

    function parseExactUserXp(userLevel) {
        let exactCurrentXp = null;
        let xpToNextLevel = null;
        let derivedCurrentLevel = userLevel;

        const headerContainers = [
            document.querySelector('.profile_badges_header'),
            document.querySelector('.badge_details_set'),
            document.querySelector('.badges_sheet'),
            document.querySelector('.profile_content'),
            document.querySelector('#mainContents')
        ].filter(Boolean);

        for (const container of headerContainers) {
            const rawText = (container.innerText || '').replace(/\u00A0/g, ' ');
            const lines = rawText.split('\n');

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                // 1. Уровень: "Уровень 48" или "Level 48"
                const mLvl = trimmed.match(/^(?:Уровень|Level)\s*(\d+)/i);
                if (mLvl) {
                    const lNum = parseInt(mLvl[1], 10);
                    if (lNum > 0) derivedCurrentLevel = lNum;
                }

                // 2. Остаток опыта: "316 ед. опыта до 49-го уровня"
                const mNext = trimmed.match(/([\d\s,]+)\s*(?:ед\.?\s*опыта|XP)\s*до\s*(\d+)?(?:-?го|-?ого)?\s*уровня/i)
                    || trimmed.match(/([\d\s,]+)\s*(?:ед\.?\s*опыта|XP)\s*(?:до\s*(?:следующего\s*уровня|уровня)|needed to reach|to next level)/i);
                if (mNext) {
                    const val = parseInt(mNext[1].replace(/[\s,]/g, ''), 10);
                    if (!isNaN(val) && val > 0) {
                        xpToNextLevel = val;
                    }
                    if (mNext[2]) {
                        const targetLvl = parseInt(mNext[2], 10);
                        if (targetLvl > 1) derivedCurrentLevel = targetLvl - 1;
                    }
                }

                // 3. Текущий общий опыт: "14,184 ед. опыта" (строка не содержит "до" или "to")
                if (!trimmed.includes('до') && !trimmed.toLowerCase().includes('to')) {
                    const mTot = trimmed.match(/^([\d\s,]+)\s*(?:ед\.?\s*опыта|XP)/i);
                    if (mTot) {
                        const val = parseInt(mTot[1].replace(/[\s,]/g, ''), 10);
                        if (!isNaN(val) && val > 0) {
                            exactCurrentXp = val;
                        }
                    }
                }
            }

            if (exactCurrentXp !== null && xpToNextLevel !== null) {
                break;
            }
        }

        const currLvl = derivedCurrentLevel || userLevel || 1;
        const nextLvlTotalXp = getXpForLevel(currLvl + 1);

        if (xpToNextLevel !== null && exactCurrentXp === null) {
            exactCurrentXp = nextLvlTotalXp - xpToNextLevel;
        } else if (exactCurrentXp !== null && xpToNextLevel === null) {
            xpToNextLevel = Math.max(0, nextLvlTotalXp - exactCurrentXp);
        } else if (exactCurrentXp === null && xpToNextLevel === null) {
            exactCurrentXp = getXpForLevel(currLvl);
            const bracket = (Math.floor(currLvl / 10) + 1) * 100;
            xpToNextLevel = bracket;
        }

        return {
            currentLevel: currLvl,
            exactCurrentXp,
            xpToNextLevel
        };
    }

    function calculateExactLevelDiff(currentLevel, targetLevel, exactCurrentXp = null) {
        if (targetLevel <= currentLevel) {
            return {
                currentXp: exactCurrentXp || getXpForLevel(currentLevel),
                targetXp: getXpForLevel(currentLevel),
                xpNeeded: 0,
                badgesNeeded: 0
            };
        }

        const currXp = (exactCurrentXp !== null && !isNaN(exactCurrentXp)) ? exactCurrentXp : getXpForLevel(currentLevel);
        const targetXp = getXpForLevel(targetLevel);
        const xpNeeded = Math.max(0, targetXp - currXp);
        const badgesNeeded = Math.ceil(xpNeeded / 100);

        return {
            currentXp: currXp,
            targetXp,
            xpNeeded,
            badgesNeeded
        };
    }

    // =========================================================================
    // МОДУЛЬ 2: ПАРСЕР И КЭШ ДЕШЕВЫХ СЕТОВ (14 000+ ИГР)
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

        openPriceReviewModal(appid, cardsToBuy, targetLevel);
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
                const needed = Math.max(0, levelsToCraft - card.owned);
                card.needed = needed;
                totalCardsToBuy += needed;

                breakdownHtml += `<li><b>${card.name}</b>: в наличии <b>${card.owned}</b> шт. → докупить: <b style="color: ${needed > 0 ? '#66c0f4' : '#a4d007'}">${needed}</b> шт.</li>`;
            });
            breakdownHtml += `</ul>`;

            const summaryEl = panel.querySelector('#slm-calc-summary');
            const checkBtn = panel.querySelector('#slm-btn-check-prices');
            if (summaryEl) {
                if (levelsToCraft === 0) {
                    summaryEl.innerHTML = `<span style="color: #a4d007;">🎉 Значок уже прокачан до уровня ${currentLevel}!</span>`;
                    if (checkBtn) checkBtn.disabled = true;
                } else {
                    summaryEl.innerHTML = `
                        Для уровня <b>${targetLevel}</b> нужно скрафтить значок <b>${levelsToCraft}</b> раз(а).<br>
                        Всего необходимо докупить карт: <b style="color: #66c0f4; font-size: 16px;">${totalCardsToBuy} шт.</b>
                        ${breakdownHtml}
                    `;
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

        // Обработчик Turbo Craft
        const turboBtn = panel.querySelector('#slm-btn-turbo-craft');
        if (turboBtn) {
            turboBtn.addEventListener('click', () => {
                turboCraftBadge(appid);
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

        // 1. Считываем текущий уровень пользователя и точный опыт из шапки Steam
        let userCurrentLevel = 1;
        const lvlEl = document.querySelector('.friendPlayerLevelNum') 
            || document.querySelector('.persona_level .friendPlayerLevelNum')
            || document.querySelector('.playerAvatar .friendPlayerLevelNum');
        if (lvlEl) {
            userCurrentLevel = parseInt(lvlEl.innerText.trim(), 10) || 1;
        }

        // Парсим точные единицы опыта пользователя и остаток до след. уровня
        const userXpInfo = parseExactUserXp(userCurrentLevel);
        if (userXpInfo.currentLevel && userXpInfo.currentLevel > 1) {
            userCurrentLevel = userXpInfo.currentLevel;
        }

        // 2. Считываем значки пользователя и их текущие уровни
        const userBadgeLevels = new Map();
        const readyBadges = [];

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
                    else if (xp >= 100) lvl = Math.max(lvl, Math.floor(xp / 100));
                }

                // Указание уровня: "Уровень 5", "Level 5", "ур. 5", "5 ур.", "5 уровня", "5-го уровня", "Lvl 5"
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

                const craftBtn = row.querySelector('.badge_craft_button, a[href*="ajaxcraftbadge"]');
                if (craftBtn) {
                    readyBadges.push({ appid, row });
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
                updateLevelCalculator();
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
                <button class="slm-tab-btn active" data-tab="calc">📊 Калькулятор уровня</button>
                <button class="slm-tab-btn" data-tab="catalog">🏷️ Каталог дешёвых сетов (14 000+)</button>
                <button class="slm-tab-btn" data-tab="craft">⚡ Быстрый крафт (${readyBadges.length} готово)</button>
            </div>

            <!-- ВКЛАДКА 1: КАЛЬКУЛЯТОР УРОВНЯ -->
            <div class="slm-tab-pane active" id="slm-pane-calc">
                <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap; background: rgba(0,0,0,0.25); padding: 14px; border-radius: 6px;">
                    <div>
                        <span style="font-size: 13px; color: #8f98a0;">Текущий уровень:</span><br>
                        <input type="number" id="slm-calc-curr-input" class="slm-input" value="${userCurrentLevel}" min="0" max="5000" style="width: 90px; margin-top:4px;">
                    </div>
                    <div style="font-size: 20px; color: #38506b; padding-top: 15px;">➔</div>
                    <div>
                        <span style="font-size: 13px; color: #8f98a0;">Желаемый уровень:</span><br>
                        <input type="number" id="slm-calc-target-input" class="slm-input" value="${userCurrentLevel + 1}" min="1" max="5000" style="width: 90px; margin-top:4px;">
                    </div>
                    <div style="padding-top: 18px;">
                        <button class="slm-btn" id="slm-calc-execute-btn">🧮 Рассчитать план</button>
                    </div>
                </div>

                <div class="slm-calc-grid">
                    <div class="slm-stat-card">
                        <div class="slm-stat-title">Опыта потребуется</div>
                        <div class="slm-stat-value" id="slm-stat-xp">...</div>
                    </div>
                    <div class="slm-stat-card">
                        <div class="slm-stat-title">Значков (крафтов)</div>
                        <div class="slm-stat-value" id="slm-stat-badges" style="color:#a4d007;">...</div>
                    </div>
                    <div class="slm-stat-card">
                        <div class="slm-stat-title">Оценочный бюджет</div>
                        <div class="slm-stat-value" id="slm-stat-cost" style="color:#e5c158;">...</div>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-top: 14px;">
                    <div style="font-size: 12px; color: #8f98a0; line-height: 1.5;">
                        💡 <b>Совет:</b> Сезонный значок в <a href="https://store.steampowered.com/points/shop" target="_blank" style="color:#66c0f4;">Магазине очков Steam</a> дает до 40 уровней (4 000 XP) без покупки карт!
                    </div>
                    <button class="slm-btn slm-btn-green" id="slm-btn-go-to-cheap-catalog">
                        🏷️ Посмотреть дешёвые сеты для этой цели »
                    </button>
                </div>
            </div>

            <!-- ВКЛАДКА 2: КАТАЛОГ ДЕШЕВЫХ СЕТОВ -->
            <div class="slm-tab-pane" id="slm-pane-catalog">
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

            <!-- ВКЛАДКА 3: БЫСТРЫЙ КРАФТ (TURBO CRAFT) -->
            <div class="slm-tab-pane" id="slm-pane-craft">
                <div style="background: rgba(0,0,0,0.25); padding: 18px; border-radius: 6px;">
                    <div style="font-size: 15px; margin-bottom: 12px;">
                        Готово к крафту на текущей странице: <b style="color: #a4d007; font-size: 18px;">${readyBadges.length}</b> значков.
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
            calc: bar.querySelector('#slm-pane-calc'),
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

        // --- ЛОГИКА КАЛЬКУЛЯТОРА УРОВНЯ ---
        const currInput = bar.querySelector('#slm-calc-curr-input');
        const targetInput = bar.querySelector('#slm-calc-target-input');
        const statXp = bar.querySelector('#slm-stat-xp');
        const statBadges = bar.querySelector('#slm-stat-badges');
        const statCost = bar.querySelector('#slm-stat-cost');

        function updateLevelCalculator() {
            const currLvl = parseInt(currInput.value, 10) || 0;
            const targetLvl = parseInt(targetInput.value, 10) || 1;

            // Если выбран текущий уровень аккаунта, используем точный опыт и остаток до след. уровня
            const isActualUserLevel = (currLvl === userCurrentLevel);
            const exactXp = isActualUserLevel ? userXpInfo.exactCurrentXp : null;
            const diff = calculateExactLevelDiff(currLvl, targetLvl, exactXp);

            statXp.innerText = diff.xpNeeded > 0 ? `+${diff.xpNeeded.toLocaleString()} XP` : '0 XP';
            statBadges.innerText = `${diff.badgesNeeded} шт.`;

            // Если база сетов уже загружена, считаем точную стоимость по ТОП-N дешевых сетов
            if (allLoadedSets && allLoadedSets.length > 0) {
                const availableCheap = allLoadedSets.filter(s => (userBadgeLevels.get(s.appid) || 0) < 5);
                let estimatedCost = 0;
                const countToTake = Math.min(diff.badgesNeeded, availableCheap.length);
                for (let i = 0; i < countToTake; i++) {
                    estimatedCost += availableCheap[i].priceUserCurrency;
                }
                // Если нужно больше чем доступно в базе, экстраполируем
                if (diff.badgesNeeded > countToTake && countToTake > 0) {
                    const avgPrice = estimatedCost / countToTake;
                    estimatedCost += (diff.badgesNeeded - countToTake) * avgPrice;
                }
                statCost.innerText = formatMoney(Math.round(estimatedCost * 100), currencyInfo);
            } else {
                // Примерная оценка до загрузки базы (~0.25$ за сет)
                const approxRate = currencyInfo.currency === 37 ? 452 : (currencyInfo.currency === 5 ? 81 : 1);
                const approxCost = diff.badgesNeeded * 0.25 * approxRate;
                statCost.innerText = `~${formatMoney(Math.round(approxCost * 100), currencyInfo)}`;
            }
        }

        bar.querySelector('#slm-calc-execute-btn').addEventListener('click', updateLevelCalculator);
        currInput.addEventListener('input', updateLevelCalculator);
        targetInput.addEventListener('input', updateLevelCalculator);

        bar.querySelector('#slm-btn-go-to-cheap-catalog').addEventListener('click', () => {
            switchTab('catalog');
        });

        updateLevelCalculator();

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
                updateLevelCalculator(); // Пересчитываем точную стоимость с живыми данными
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
                    : `<button class="slm-btn slm-btn-green slm-buy-direct-btn" data-appid="${item.appid}" style="padding:4px 8px; font-size:11px;">🛒 Купить</button>`;

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
                updateLevelCalculator();
            }).catch(() => {});
            fetchOtherBadgesPages().catch(() => {});
        }, 500);

        // --- ЛОГИКА ТУРБО-КРАФТА ---
        const massBtn = bar.querySelector('#slm-mass-craft-btn');
        if (massBtn) {
            massBtn.onclick = async () => {
                if (!confirm(`Вы уверены, что хотите мгновенно скрафтить все доступные значки (${readyBadges.length} шт.)?`)) {
                    return;
                }

                massBtn.disabled = true;
                const progress = bar.querySelector('#slm-mass-craft-progress');
                if (progress) progress.style.display = 'block';

                let count = 0;
                for (const item of readyBadges) {
                    count++;
                    if (progress) progress.innerText = `⏳ Крафтим [${count}/${readyBadges.length}] AppID: ${item.appid}...`;
                    await turboCraftBadgeSilent(item.appid);
                    await sleep(400);
                }

                if (progress) progress.innerHTML = `<b style="color: #a4d007;">🎉 Все доступные значки успешно скрафчены!</b>`;
                setTimeout(() => window.location.reload(), 1500);
            };
        }

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
