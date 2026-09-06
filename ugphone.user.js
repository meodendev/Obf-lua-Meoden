// ==UserScript==
// @name         UGPhone Importer - MeoDen
// @namespace    https://tampermonkey.net/
// @version      1.0
// @description  UGPhone LocalStorage JSON Importer
// @author       MeoDen
// @icon         https://files.catbox.moe/8p918w.jpg
// @match        https://*.ugphone.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    /* =========================
       ICON MENU
    ========================= */

    const launcher = document.createElement('button');

    launcher.id = 'md-launcher';
    launcher.innerHTML = '🐈‍⬛';

    /* =========================
       MAIN MENU
    ========================= */

    const panel = document.createElement('div');

    panel.id = 'md-panel';

    panel.innerHTML = `
        <div class="md-head">
            <div class="md-tool-icon">🐈‍⬛</div>

            <div class="md-head-text">
                <div class="md-title">UGPhone Importer</div>
                <div class="md-subtitle">
                    LocalStorage Tool
                </div>
            </div>

            <button id="md-close">×</button>
        </div>

        <textarea
            id="md-json"
            spellcheck="false"
            placeholder="Dán JSON LocalStorage vào đây..."></textarea>

        <button id="md-import">
            <span>⚡</span>
            IMPORT
        </button>

        <div id="md-status">
            Sẵn sàng
        </div>

        <div class="md-divider"></div>

        <a
            class="md-discord"
            href="https://dsc.gg/meoden"
            target="_blank"
            rel="noopener noreferrer"
        >
            <span>💬</span>
            Discord hỗ trợ
        </a>

        <div class="md-footer">
            Mèo Đen • UGPhone Tools
        </div>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    /* =========================
       STYLE
    ========================= */

    const style = document.createElement('style');

    style.textContent = `

        /* ===== LAUNCHER ===== */

        #md-launcher {
            position: fixed;

            right: 22px;
            bottom: 22px;

            width: 58px;
            height: 58px;

            border: 0;
            border-radius: 18px;

            cursor: pointer;

            font-size: 27px;

            color: white;

            background:
                linear-gradient(
                    135deg,
                    #8b5cf6,
                    #4f46e5
                );

            box-shadow:
                0 10px 35px
                rgba(79,70,229,.45);

            z-index: 999999999;

            transition:
                transform .2s,
                box-shadow .2s;
        }

        #md-launcher:hover {
            transform: translateY(-3px) scale(1.04);

            box-shadow:
                0 14px 40px
                rgba(79,70,229,.6);
        }

        #md-launcher.md-active {
            transform: rotate(90deg);
        }


        /* ===== PANEL ===== */

        #md-panel {
            position: fixed;

            right: 22px;
            bottom: 92px;

            width: 370px;

            padding: 18px;

            box-sizing: border-box;

            background:
                linear-gradient(
                    145deg,
                    rgba(24,24,35,.98),
                    rgba(8,8,13,.98)
                );

            border:
                1px solid
                rgba(255,255,255,.09);

            border-radius: 20px;

            color: white;

            font-family:
                Inter,
                Arial,
                sans-serif;

            box-shadow:
                0 25px 70px
                rgba(0,0,0,.6);

            backdrop-filter:
                blur(18px);

            z-index: 999999998;

            opacity: 0;

            transform:
                translateY(15px)
                scale(.96);

            pointer-events: none;

            transition:
                opacity .2s,
                transform .2s;
        }

        #md-panel.md-show {
            opacity: 1;

            transform:
                translateY(0)
                scale(1);

            pointer-events: auto;
        }


        /* ===== HEADER ===== */

        .md-head {
            display: flex;

            align-items: center;

            gap: 11px;

            margin-bottom: 15px;
        }

        .md-tool-icon {
            width: 43px;
            height: 43px;

            display: flex;

            align-items: center;
            justify-content: center;

            border-radius: 13px;

            font-size: 22px;

            background:
                linear-gradient(
                    135deg,
                    #8b5cf6,
                    #4f46e5
                );

            box-shadow:
                0 7px 22px
                rgba(99,102,241,.3);
        }

        .md-head-text {
            flex: 1;
        }

        .md-title {
            font-size: 17px;

            font-weight: 750;
        }

        .md-subtitle {
            margin-top: 3px;

            color: #77778a;

            font-size: 10px;
        }

        #md-close {
            width: 30px;
            height: 30px;

            border: 0;
            border-radius: 9px;

            background: #191922;

            color: #8b8b99;

            font-size: 21px;

            cursor: pointer;

            transition: .15s;
        }

        #md-close:hover {
            background: #292934;

            color: white;
        }


        /* ===== TEXTAREA ===== */

        #md-json {
            width: 100%;
            height: 190px;

            box-sizing: border-box;

            resize: none;

            padding: 13px;

            border-radius: 12px;

            border:
                1px solid
                #292936;

            outline: none;

            background:
                #07070b;

            color:
                #dedeee;

            font-family:
                "JetBrains Mono",
                Consolas,
                monospace;

            font-size: 11px;

            line-height: 1.5;

            transition: .2s;
        }

        #md-json:focus {
            border-color:
                #6366f1;

            box-shadow:
                0 0 0 3px
                rgba(99,102,241,.12);
        }


        /* ===== IMPORT ===== */

        #md-import {
            width: 100%;

            height: 43px;

            margin-top: 11px;

            border: 0;

            border-radius: 11px;

            cursor: pointer;

            color: white;

            font-size: 12px;

            font-weight: 750;

            background:
                linear-gradient(
                    135deg,
                    #8b5cf6,
                    #4f46e5
                );

            box-shadow:
                0 7px 20px
                rgba(79,70,229,.25);

            transition:
                transform .15s,
                opacity .15s;
        }

        #md-import:hover {
            transform:
                translateY(-1px);

            opacity: .9;
        }

        #md-import:active {
            transform:
                scale(.98);
        }


        /* ===== STATUS ===== */

        #md-status {
            min-height: 17px;

            margin-top: 9px;

            text-align: center;

            color: #8e8e9d;

            font-size: 11px;
        }


        /* ===== DIVIDER ===== */

        .md-divider {
            width: 100%;
            height: 1px;

            margin: 12px 0;

            background:
                #24242e;
        }


        /* ===== DISCORD ===== */

        .md-discord {
            display: flex;

            align-items: center;
            justify-content: center;

            gap: 7px;

            width: 100%;

            box-sizing: border-box;

            padding: 10px;

            border-radius: 10px;

            background:
                #171722;

            color:
                #aaaaff;

            text-decoration: none;

            font-size: 11px;

            font-weight: 650;

            transition: .2s;
        }

        .md-discord:hover {
            background:
                #222233;

            color:
                #c6c6ff;
        }


        /* ===== FOOTER ===== */

        .md-footer {
            margin-top: 10px;

            text-align: center;

            color:
                #50505d;

            font-size: 9px;

            letter-spacing: .3px;
        }

    `;

    document.head.appendChild(style);

    /* =========================
       OPEN / CLOSE
    ========================= */

    function toggleMenu() {
        const show =
            !panel.classList.contains('md-show');

        panel.classList.toggle(
            'md-show',
            show
        );

        launcher.classList.toggle(
            'md-active',
            show
        );
    }

    launcher.addEventListener(
        'click',
        toggleMenu
    );

    document
        .getElementById('md-close')
        .addEventListener(
            'click',
            toggleMenu
        );


    /* =========================
       IMPORT JSON
    ========================= */

    const input =
        document.getElementById(
            'md-json'
        );

    const status =
        document.getElementById(
            'md-status'
        );

    document
        .getElementById('md-import')
        .addEventListener(
            'click',
            () => {

                const text =
                    input.value.trim();

                if (!text) {

                    status.textContent =
                        '❌ Hãy dán JSON trước';

                    return;
                }

                try {

                    const data =
                        JSON.parse(text);

                    if (
                        typeof data !==
                        'object' ||

                        data === null ||

                        Array.isArray(data)
                    ) {

                        throw new Error(
                            'JSON phải là Object'
                        );
                    }

                    let count = 0;

                    for (
                        const [key, value]
                        of Object.entries(data)
                    ) {

                        const finalValue =
                            typeof value === 'string'
                                ? value
                                : JSON.stringify(value);

                        localStorage.setItem(
                            key,
                            finalValue
                        );

                        count++;
                    }

                    status.textContent =
                        `✅ Import thành công ${count} key hãy load lại trang web`;

                } catch (error) {

                    status.textContent =
                        `❌ JSON lỗi: ${error.message}`;

                }

            }
        );

})();