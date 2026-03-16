/*
    ioBroker.vis vis-2-widgets-sigenergy — Widget-Set
    4 Widgets: Energiefluss · Akku-Status · Echtzeit-Leistung · Statistiken

    version: "1.0.1"
    Copyright 2026 ssbingo s.sternitzke@online.de
*/
"use strict";

/* global $, vis, systemDictionary */

// add translations for edit mode
if (typeof systemDictionary !== "undefined") {
    $.extend(
        true,
        systemDictionary,
        {
        "sig_title":    { "en": "Title",             "de": "Titel" },
        "sig_darkmode": { "en": "Dark mode",         "de": "Dunkelmodus" },
        "sig_animation":{ "en": "Animation",         "de": "Animation" },
        "oid_pv":       { "en": "PV Power OID",      "de": "PV-Leistung OID" },
        "oid_bat":      { "en": "Battery Power OID", "de": "Batterie-Leistung OID" },
        "oid_grid":     { "en": "Grid Power OID",    "de": "Netz-Leistung OID" },
        "oid_house":    { "en": "House Power OID",   "de": "Haus-Leistung OID" },
        "oid_soc":      { "en": "Battery SOC OID",   "de": "Batterie SOC OID" },
        "oid_soh":      { "en": "Battery SOH OID",   "de": "Batterie SOH OID" },
        "oid_ttf":      { "en": "Time to Full OID",  "de": "Zeit bis Voll OID" },
        "oid_ttr":      { "en": "Time Remaining OID","de": "Restlaufzeit OID" },
        "oid_sc":       { "en": "Self Consumption OID","de": "Eigenverbrauch OID" },
        "oid_aut":      { "en": "Autarky Rate OID",  "de": "Autarkierate OID" },
        "oid_maxsoc":   { "en": "Day Max SOC OID",   "de": "Tages Max SOC OID" },
        "oid_minsoc":   { "en": "Day Min SOC OID",   "de": "Tages Min SOC OID" },
        "oid_charg":    { "en": "Daily Charge OID",  "de": "Tages-Ladung OID" },
        "oid_discharg": { "en": "Daily Discharge OID","de": "Tages-Entladung OID" },
        "oid_covtime":  { "en": "Battery Coverage OID","de": "Batteriedeckung OID" },
        "oid_chargt":   { "en": "Daily Charge Time OID","de": "Tages-Ladezeit OID" }
        }
    );
}

vis.binds["vis-2-widgets-sigenergy"] = {
    version: "1.0.1",

    showVersion: function () {
        if (vis.binds["vis-2-widgets-sigenergy"].version) {
            console.log("Version vis-2-widgets-sigenergy: " + vis.binds["vis-2-widgets-sigenergy"].version);
            vis.binds["vis-2-widgets-sigenergy"].version = null;
        }
    },

    // ── Helfer ──────────────────────────────────────────────────────────────
    _fmtKW: function (v) {
        var n = parseFloat(v);
        return isNaN(n) ? "-- kW" : (Math.abs(n) >= 10 ? n.toFixed(1) : n.toFixed(2)) + " kW";
    },
    _fmtPct: function (v) {
        var n = parseFloat(v);
        return isNaN(n) ? "--%"    : Math.round(n) + "%";
    },
    _fmtKWh: function (v) {
        var n = parseFloat(v);
        return isNaN(n) ? "-- kWh" : n.toFixed(2) + " kWh";
    },
    _fmtMin: function (v) {
        var m = Math.round(Math.abs(parseFloat(v) || 0));
        if (!m) return "0 min";
        return m < 60 ? m + " min" : Math.floor(m / 60) + "h " + (m % 60) + "m";
    },
    _socCol: function (p) {
        return parseFloat(p) > 60 ? "#27ae60" : parseFloat(p) > 25 ? "#f39c12" : "#e74c3c";
    },
    _el: function (id) { return document.getElementById(id); },
    _txt: function (id, v) {
        var e = vis.binds["vis-2-widgets-sigenergy"]._el(id);
        if (e) e.textContent = v;
    },
    _css: function (id, p, v) {
        var e = vis.binds["vis-2-widgets-sigenergy"]._el(id);
        if (e) e.style[p] = v;
    },

    // State-Zugriff: vis.states[key + '.val']
    _val: function (data, attr) {
        var oid = data.attr(attr);
        if (!oid) return undefined;
        return vis.states[oid + ".val"];
    },

    // Darkmode-Checkbox: VIS-2 liefert Boolean true/false ODER String "true"/"false"
    // Diese Funktion normalisiert beide Varianten zuverlaessig.
    _isDark: function (data) {
        var v = data.attr("sig_darkmode");
        return (v === true || v === "true" || v === "1" || v === 1);
    },

    // Subscription mit VIS-konformem $div.data()-Muster
    _subscribe: function (wid, data, attrs, onChange) {
        var $div  = $("#" + wid);
        var bound = [];
        for (var i = 0; i < attrs.length; i++) {
            var oid = data.attr(attrs[i]);
            if (oid) {
                var key = oid + ".val";
                bound.push(key);
                vis.states.bind(key, onChange);
            }
        }
        $div.data("bound",       bound);
        $div.data("bindHandler", onChange);
    },

    // ── Widget 1: Energiefluss-Diagramm ─────────────────────────────────────
    //
    // SVG-Koordinaten (viewBox 0 0 300 248):
    //   Solar PV   oben-links  (58, 42)
    //   Batterie   oben-rechts (242, 42)
    //   Netz       unten-links (58, 208)
    //   Haus       unten-rechts(242, 208)
    //   Hub ⚡     Mitte       (150, 125)
    //
    // Pfade:
    //   PV   → Hub  M58,63   Q58,125  142,125
    //   Bat  → Hub  M242,63  Q242,125 158,125
    //   Netz → Hub  M58,191  Q58,125  142,125
    //   Hub  → Haus M158,125 Q242,125 242,191
    //
    createEnergyFlow: function (widgetID, view, data, style) {
        var B    = vis.binds["vis-2-widgets-sigenergy"];
        var $div = $("#" + widgetID);
        if (!$div.length) {
            return setTimeout(function () { B.createEnergyFlow(widgetID, view, data, style); }, 100);
        }

        var dark  = B._isDark(data);
        var title = data.attr("sig_title") || "Energiefluss";
        var cls   = dark ? "sig-ef-wrap" : "sig-ef-wrap light";
        var tc    = dark ? "#e0e6ef" : "#2c3e50";  // text colour
        var w     = widgetID;

        // ── Einheitliches SVG: Pfeile + Icons + Labels + Werte ──────────────
        // Alle 5 Knoten liegen im selben Koordinatenraum wie die Pfade,
        // daher zeigen Pfeile immer exakt auf die Icons.

        var svg =
            '<svg viewBox="0 0 300 248" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' +

            // ── Pfeil-Marker ─────────────────────────────────────────────
            '<defs>' +
            '<marker id="mPv_'   + w + '" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0,0 6,3 0,6" fill="#f39c12"/></marker>' +
            '<marker id="mBat_'  + w + '" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0,0 6,3 0,6" fill="#9b59b6"/></marker>' +
            '<marker id="mGrid_'   + w + '" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0,0 6,3 0,6" fill="#3498db"/></marker>' +
                        '<marker id="mHouse_'  + w + '" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0,0 6,3 0,6" fill="#27ae60"/></marker>' +
            '</defs>' +

            // ── Animierte Flusspfade ──────────────────────────────────────
            '<path id="sig_path_pv_'   + w + '" class="sig-flow-path pv-color"    d="M58,63  Q58,125  142,125" marker-end="url(#mPv_'   + w + ')"/>' +
            '<path id="sig_path_bat_dis_' + w + '" class="sig-flow-path bat-color"   d="M242,71 Q242,125 158,125" marker-end="url(#mBat_' + w + ')"/>' +
            '<path id="sig_path_bat_chg_' + w + '" class="sig-flow-path bat-color"   d="M158,125 Q242,125 242,71"  marker-end="url(#mBat_' + w + ')"/>' +
            '<path id="sig_path_grid_buy_' + w + '" class="sig-flow-path grid-color"  d="M58,191 Q58,125  142,125" marker-end="url(#mGrid_' + w + ')"/>' +
            '<path id="sig_path_grid_exp_' + w + '" class="sig-flow-path grid-color"  d="M142,125 Q58,125  58,191"  marker-end="url(#mGrid_' + w + ')"/>' +
            '<path id="sig_path_house_'+ w + '" class="sig-flow-path house-color" d="M158,125 Q242,125 242,191" marker-end="url(#mHouse_'+ w + ')"/>' +

            // ── Hub-Kreis Mitte ───────────────────────────────────────────
            '<circle cx="150" cy="125" r="18" fill="' + (dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)') + '"/>' +
            '<text x="150" y="125" text-anchor="middle" dominant-baseline="central" font-size="18" fill="' + tc + '" opacity="0.85">&#9889;</text>' +

            // ── Solar PV  (oben-links, Knotenmitte 58, 42) ───────────────
            '<text x="58" y="28"  text-anchor="middle" dominant-baseline="central" font-size="20" fill="#f39c12">&#9728;</text>' +
            '<text x="58" y="45"  text-anchor="middle" dominant-baseline="central" font-size="8.5" fill="' + tc + '" opacity="0.65">Solar PV</text>' +
            '<text id="sig_ef_pv_'   + w + '" x="58" y="57" text-anchor="middle" dominant-baseline="central" font-size="12.5" font-weight="700" fill="#f39c12">-- kW</text>' +

            // ── Batterie  (oben-rechts, Knotenmitte 242, 42) ─────────────
            // SOC-Anzeige links neben dem Batterie-Icon
            '<text x="202" y="23" text-anchor="middle" dominant-baseline="central" font-size="8" fill="' + tc + '" opacity="0.65">SOC</text>' +
            '<text id="sig_ef_socval_'+ w + '" x="202" y="36" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="700" fill="#9b59b6">--%</text>' +
            // Batterie-Icon als SVG: Rahmen + dynamische Füllung + Pol
            '<rect x="229" y="21" width="22" height="14" rx="2" fill="none" stroke="#9b59b6" stroke-width="1.5"/>' +
            '<rect x="251" y="24" width="3" height="8" rx="1" fill="#9b59b6"/>' +
            '<rect id="sig_ef_batfill_'+ w + '" x="230" y="22" width="11" height="12" rx="1" fill="#9b59b6"/>' +
            '<text x="242" y="45" text-anchor="middle" dominant-baseline="central" font-size="8.5" fill="' + tc + '" opacity="0.65">Batterie</text>' +
            '<text id="sig_ef_bat_'  + w + '" x="242" y="57" text-anchor="middle" dominant-baseline="central" font-size="12.5" font-weight="700" fill="#9b59b6">-- kW</text>' +

            // ── Netz  (unten-links, Knotenmitte 58, 208) ─────────────────
            '<text x="58" y="197" text-anchor="middle" dominant-baseline="central" font-size="20" fill="#3498db">&#128268;</text>' +
            '<text x="58" y="214" text-anchor="middle" dominant-baseline="central" font-size="8.5" fill="' + tc + '" opacity="0.65">Netz</text>' +
            '<text id="sig_ef_grid_' + w + '" x="58" y="226" text-anchor="middle" dominant-baseline="central" font-size="12.5" font-weight="700" fill="#3498db">-- kW</text>' +

            // ── Haus  (unten-rechts, Knotenmitte 242, 208) ───────────────
            '<text x="242" y="197" text-anchor="middle" dominant-baseline="central" font-size="20" fill="#27ae60">&#127968;</text>' +
            '<text x="242" y="214" text-anchor="middle" dominant-baseline="central" font-size="8.5" fill="' + tc + '" opacity="0.65">Haus</text>' +
            '<text id="sig_ef_house_'+ w + '" x="242" y="226" text-anchor="middle" dominant-baseline="central" font-size="12.5" font-weight="700" fill="#27ae60">-- kW</text>' +

            '</svg>';

        $div.html(
            '<div class="sig-w"><div class="' + cls + '">' +
            '<div class="sig-ef-title">&#9889; ' + title + '</div>' +
            '<div class="sig-ef-svg-wrap">' + svg + '</div>' +
            '</div></div>'
        );

        function update() {
            var pv   = parseFloat(B._val(data, "oid_pv"))    || 0;
            var bat  = parseFloat(B._val(data, "oid_bat"))   || 0;
            var grid = parseFloat(B._val(data, "oid_grid"))  || 0;
            var hous = parseFloat(B._val(data, "oid_house")) || 0;
            var soc  = parseFloat(B._val(data, "oid_soc"))   || 0;

            // Werte setzen (SVG-Text-Knoten)
            B._txt("sig_ef_pv_"    + w, B._fmtKW(pv));
            B._txt("sig_ef_bat_"   + w, B._fmtKW(bat));
            B._txt("sig_ef_grid_"  + w, B._fmtKW(grid));
            B._txt("sig_ef_house_" + w, B._fmtKW(hous));

            // Netz-Farbe: grün = Einspeisung, rot = Bezug
            B._css("sig_ef_grid_"    + w, "fill", grid < 0 ? "#27ae60" : "#e74c3c");
            // Batterie-SOC: Wert links + Icon-Füllung dynamisch
            B._txt("sig_ef_socval_" + w, Math.round(soc) + " %");
            B._css("sig_ef_socval_" + w, "fill", B._socCol(soc));
            var batfill = B._el("sig_ef_batfill_" + w);
            if (batfill) {
                var fw = Math.max(1, Math.round(soc / 100 * 20));
                batfill.setAttribute("width", String(fw));
                batfill.setAttribute("fill", B._socCol(soc));
            }

            // Pfade aktivieren/deaktivieren → startet/stoppt CSS-Dash-Animation
            var paths = ["pv", "house"];
            var vals  = [pv, hous];
            for (var i = 0; i < paths.length; i++) {
                var el = B._el("sig_path_" + paths[i] + "_" + w);
                if (el) {
                    if (Math.abs(vals[i]) > 0.05) el.classList.add("active");
                    else                           el.classList.remove("active");
                }
            }
            // Batterie – zwei separate Pfade je Richtung:
            // sig_path_bat_dis: Battery→Mitte (Entladen, bat < 0)
            // sig_path_bat_chg: Mitte→Battery (Laden,    bat > 0)
            var batDis = B._el("sig_path_bat_dis_" + w);
            var batChg = B._el("sig_path_bat_chg_" + w);
            if (batDis && batChg) {
                if (bat < -0.05) {
                    // Entladen: Entlade-Pfad aktiv, Lade-Pfad inaktiv
                    batDis.classList.add("active");
                    batChg.classList.remove("active");
                } else if (bat > 0.05) {
                    // Laden: Lade-Pfad aktiv, Entlade-Pfad inaktiv
                    batChg.classList.add("active");
                    batDis.classList.remove("active");
                } else {
                    // Inaktiv: beide aus
                    batDis.classList.remove("active");
                    batChg.classList.remove("active");
                }
            }
            // Netz – zwei separate Pfade je Richtung:
            // sig_path_grid_buy: Netz→Mitte  (Netzbezug,    grid > 0)
            // sig_path_grid_exp: Mitte→Netz  (Einspeisung,  grid < 0)
            var gridBuy = B._el("sig_path_grid_buy_" + w);
            var gridExp = B._el("sig_path_grid_exp_" + w);
            if (gridBuy && gridExp) {
                if (grid > 0.05) {
                    // Netzbezug: Netz→Mitte aktiv
                    gridBuy.classList.add("active");
                    gridExp.classList.remove("active");
                } else if (grid < -0.05) {
                    // Einspeisung: Mitte→Netz aktiv
                    gridExp.classList.add("active");
                    gridBuy.classList.remove("active");
                } else {
                    // Inaktiv: beide aus
                    gridBuy.classList.remove("active");
                    gridExp.classList.remove("active");
                }
            }
        }
        B._subscribe(widgetID, data, ["oid_pv", "oid_bat", "oid_grid", "oid_house", "oid_soc"], update);
        update();
    },

    // ── Widget 2: Akku-Status & Prognosen ───────────────────────────────────
    createBatteryStatus: function (widgetID, view, data, style) {
        var B    = vis.binds["vis-2-widgets-sigenergy"];
        var $div = $("#" + widgetID);
        if (!$div.length) {
            return setTimeout(function () { B.createBatteryStatus(widgetID, view, data, style); }, 100);
        }

        var dark = B._isDark(data);
        var cls  = "sig-bat-wrap" + (dark ? "" : " light");
        var w    = widgetID;

        $div.html(
            '<div class="sig-w"><div class="' + cls + '">' +
            '<div class="sig-bat-head"><span class="icon">&#128267;</span><span class="title">Batterie Status</span>' +
            '<span class="sig-bat-soh" id="sig_bat_soh_' + w + '">SOH: --%</span></div>' +
            '<div class="sig-soc-big" id="sig_bat_soc_' + w + '">--%</div>' +
            '<div class="sig-soc-bar-bg"><div class="sig-soc-bar-fill" id="sig_bat_bar_' + w + '" style="width:0%"></div></div>' +
            '<div class="sig-soc-labels"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>' +
            '<div class="sig-bat-stats">' +
            '<div class="sig-stat-box"><div class="sig-stat-label">&#9889; Leistung</div><div class="sig-stat-val" id="sig_bat_pow_' + w + '">--</div></div>' +
            '<div class="sig-stat-box"><div class="sig-stat-label">&#8987; Bis Voll</div><div class="sig-stat-val" id="sig_bat_ttf_' + w + '">--</div></div>' +
            '<div class="sig-stat-box"><div class="sig-stat-label">&#9203; Restlaufzeit</div><div class="sig-stat-val" id="sig_bat_ttr_' + w + '">--</div></div>' +
            '<div class="sig-stat-box"><div class="sig-stat-label">&#9728; Eigenverbrauch</div><div class="sig-stat-val" id="sig_bat_sc_' + w + '">--</div></div>' +
            '<div class="sig-stat-box"><div class="sig-stat-label">&#127969; Autarkierate</div><div class="sig-stat-val" id="sig_bat_aut_' + w + '">--</div></div>' +
            '</div></div></div>'
        );

        function update() {
            var soc = parseFloat(B._val(data, "oid_soc")) || 0;
            var col = B._socCol(soc);
            B._txt("sig_bat_soh_" + w, "SOH: " + B._fmtPct(B._val(data, "oid_soh")));
            B._txt("sig_bat_soc_" + w, B._fmtPct(soc));
            B._css("sig_bat_soc_" + w, "color", col);
            var bar = B._el("sig_bat_bar_" + w);
            if (bar) { bar.style.width = Math.min(100, soc) + "%"; bar.style.background = col; }
            var bat = parseFloat(B._val(data, "oid_bat")) || 0;
            B._txt("sig_bat_pow_" + w, B._fmtKW(bat));
            B._css("sig_bat_pow_" + w, "color", bat >= 0 ? "#27ae60" : "#e74c3c");
            B._txt("sig_bat_ttf_" + w, B._fmtMin(B._val(data, "oid_ttf")));
            B._txt("sig_bat_ttr_" + w, B._fmtMin(B._val(data, "oid_ttr")));
            B._txt("sig_bat_sc_"  + w, B._fmtPct(B._val(data, "oid_sc")));
            B._txt("sig_bat_aut_" + w, B._fmtPct(B._val(data, "oid_aut")));
        }
        B._subscribe(widgetID, data, ["oid_soc", "oid_soh", "oid_bat", "oid_ttf", "oid_ttr", "oid_sc", "oid_aut"], update);
        update();
    },

    // ── Widget 3: Echtzeit-Leistung ─────────────────────────────────────────
    createPowerOverview: function (widgetID, view, data, style) {
        var B    = vis.binds["vis-2-widgets-sigenergy"];
        var $div = $("#" + widgetID);
        if (!$div.length) {
            return setTimeout(function () { B.createPowerOverview(widgetID, view, data, style); }, 100);
        }

        var dark  = B._isDark(data);
        var title = data.attr("sig_title") || "Live Leistung";
        var cls   = "sig-pow-wrap" + (dark ? "" : " light");
        var w     = widgetID;

        $div.html(
            '<div class="sig-w"><div class="' + cls + '">' +
            '<div class="sig-pow-title"><div class="sig-live-dot"></div>' + title + '</div>' +
            '<div class="sig-pow-row"><div class="sig-pow-left"><div class="sig-dot" style="background:#f39c12"></div>&#9728; Solar PV</div><div class="sig-pow-val" id="sig_pow_pv_'    + w + '">-- kW</div></div>' +
            '<div class="sig-pow-row"><div class="sig-pow-left"><div class="sig-dot" style="background:#9b59b6"></div>&#128267; Batterie</div><div class="sig-pow-val" id="sig_pow_bat_'   + w + '">-- kW</div></div>' +
            '<div class="sig-pow-row"><div class="sig-pow-left"><div class="sig-dot" style="background:#3498db"></div>&#128268; Netz</div><div class="sig-pow-val" id="sig_pow_grid_'  + w + '">-- kW</div></div>' +
            '<div class="sig-pow-row"><div class="sig-pow-left"><div class="sig-dot" style="background:#27ae60"></div>&#127968; Haus</div><div class="sig-pow-val" id="sig_pow_house_' + w + '">-- kW</div></div>' +
            '<div class="sig-pow-row" style="border-top:1px solid rgba(128,128,128,.15);margin-top:6px;padding-top:6px;">' +
            '<div class="sig-pow-left"><div class="sig-dot" style="background:#8e44ad"></div>&#128267; SOC</div>' +
            '<div class="sig-pow-val" id="sig_pow_soc_' + w + '">--%</div></div>' +
            '</div></div>'
        );

        function update() {
            var bat  = parseFloat(B._val(data, "oid_bat"))  || 0;
            var grid = parseFloat(B._val(data, "oid_grid")) || 0;
            var soc  = B._val(data, "oid_soc");
            B._txt("sig_pow_pv_"    + w, B._fmtKW(B._val(data, "oid_pv")));
            B._txt("sig_pow_bat_"   + w, B._fmtKW(bat));
            B._css("sig_pow_bat_"   + w, "color", bat  < 0 ? "#e74c3c" : "#27ae60");
            B._txt("sig_pow_grid_"  + w, B._fmtKW(grid));
            B._css("sig_pow_grid_"  + w, "color", grid < 0 ? "#27ae60" : "#e74c3c");
            B._txt("sig_pow_house_" + w, B._fmtKW(B._val(data, "oid_house")));
            B._txt("sig_pow_soc_"   + w, B._fmtPct(soc));
            B._css("sig_pow_soc_"   + w, "color", B._socCol(soc));
        }
        B._subscribe(widgetID, data, ["oid_pv", "oid_bat", "oid_grid", "oid_house", "oid_soc"], update);
        update();
    },

    // ── Widget 4: Energiestatistiken ────────────────────────────────────────
    createStatistics: function (widgetID, view, data, style) {
        var B    = vis.binds["vis-2-widgets-sigenergy"];
        var $div = $("#" + widgetID);
        if (!$div.length) {
            return setTimeout(function () { B.createStatistics(widgetID, view, data, style); }, 100);
        }

        var dark  = B._isDark(data);
        var title = data.attr("sig_title") || "Tagesstatistik";
        var cls   = "sig-stats-wrap" + (dark ? " dark" : "");
        var w     = widgetID;

        $div.html(
            '<div class="sig-w"><div class="' + cls + '">' +
            '<div class="sig-stats-title">&#128202; ' + title + '</div>' +
            '<div class="sig-stats-grid">' +
            '<div class="sig-stats-item"><div class="s-label">&#127969; Autarkierate</div><div class="s-value" style="color:#27ae60" id="sig_st_aut_'    + w + '">--</div></div>' +
            '<div class="sig-stats-item"><div class="s-label">&#8635; Eigenverbrauch</div><div class="s-value" style="color:#9b59b6" id="sig_st_sc_'     + w + '">--</div></div>' +
            '<div class="sig-stats-item"><div class="s-label">&#8593; Max SOC heute</div><div class="s-value" style="color:#f39c12" id="sig_st_maxsoc_'  + w + '">--</div></div>' +
            '<div class="sig-stats-item"><div class="s-label">&#8595; Min SOC heute</div><div class="s-value" style="color:#3498db" id="sig_st_minsoc_'  + w + '">--</div></div>' +
            '<div class="sig-stats-item"><div class="s-label">&#11014; Tages-Ladung</div><div class="s-value" style="color:#16a085" id="sig_st_chg_'    + w + '">--</div></div>' +
            '<div class="sig-stats-item"><div class="s-label">&#11015; Tages-Entladung</div><div class="s-value" style="color:#e74c3c" id="sig_st_dchg_' + w + '">--</div></div>' +
            '<div class="sig-stats-item"><div class="s-label">&#8987; Batteriedeckung</div><div class="s-value" style="color:#8e44ad" id="sig_st_cov_'   + w + '">--</div></div>' +
            '<div class="sig-stats-item"><div class="s-label">&#9889; Ladezeit heute</div><div class="s-value" style="color:#c0392b" id="sig_st_cht_'    + w + '">--</div></div>' +
            '</div></div></div>'
        );

        function update() {
            B._txt("sig_st_aut_"    + w, B._fmtPct(B._val(data, "oid_aut")));
            B._txt("sig_st_sc_"     + w, B._fmtPct(B._val(data, "oid_sc")));
            B._txt("sig_st_maxsoc_" + w, B._fmtPct(B._val(data, "oid_maxsoc")));
            B._txt("sig_st_minsoc_" + w, B._fmtPct(B._val(data, "oid_minsoc")));
            B._txt("sig_st_chg_"    + w, B._fmtKWh(B._val(data, "oid_charg")));
            B._txt("sig_st_dchg_"   + w, B._fmtKWh(B._val(data, "oid_discharg")));
            B._txt("sig_st_cov_"    + w, B._fmtMin(B._val(data, "oid_covtime")));
            B._txt("sig_st_cht_"    + w, B._fmtMin(B._val(data, "oid_chargt")));
        }
        B._subscribe(widgetID, data, ["oid_aut", "oid_sc", "oid_maxsoc", "oid_minsoc", "oid_charg", "oid_discharg", "oid_covtime", "oid_chargt"], update);
        update();
    },

    // ── Widget 5: AC-Charger (Sigen EVAC) ───────────────────────────────────
    //
    // Systemzustände (IEC 61851-1):
    //   0 = Standby (nicht verbunden)
    //   1 = Warte auf Fahrzeug
    //   2 = Lädt
    //   3 = Laden abgeschlossen / Fehler
    //
    // Steuerung:
    //   acCharger.control.startStop   0=Start, 1=Stop  (WO)
    //   acCharger.control.outputCurrent  6..rated A    (RW)
    //
    createAcCharger: function (widgetID, view, data, style) {
        var B    = vis.binds["vis-2-widgets-sigenergy"];
        var $div = $("#" + widgetID);
        if (!$div.length) {
            return setTimeout(function () { B.createAcCharger(widgetID, view, data, style); }, 100);
        }

        var dark  = B._isDark(data);
        var title = data.attr("sig_title") || "AC-Charger";
        var cls   = "sig-ac-wrap" + (dark ? "" : " light");
        var w     = widgetID;

        // Systemzustand → lesbarer Text + Badge-Klasse
        function stateInfo(v) {
            var n = parseInt(v);
            switch (n) {
                case 0: return { label: "Bereit",     badge: "idle" };
                case 1: return { label: "Verbunden",  badge: "idle" };
                case 2: return { label: "Lädt",       badge: "charging" };
                case 3: return { label: "Fertig",     badge: "idle" };
                default:return { label: "Unbekannt",  badge: "error" };
            }
        }

        // Alarm-Text: 0 = kein Alarm
        function alarmText(a1, a2, a3) {
            var v = (parseInt(a1) || 0) | (parseInt(a2) || 0) | (parseInt(a3) || 0);
            return v ? "⚠ Alarm " + v.toString(16).toUpperCase() : "OK";
        }

        $div.html(
            '<div class="sig-w"><div class="' + cls + '">' +
            // ── Kopfzeile ──────────────────────────────────────────────
            '<div class="sig-ac-head">' +
            '<span class="icon">&#128268;</span>' +
            '<span class="title">' + title + '</span>' +
            '<span class="sig-ac-badge idle" id="sig_ac_badge_' + w + '">Bereit</span>' +
            '</div>' +
            // ── Ladeleistung groß ────────────────────────────────────
            '<div class="sig-ac-power-big" id="sig_ac_power_' + w + '">-- kW</div>' +
            '<div class="sig-ac-power-lbl">Ladeleistung</div>' +
            // ── Statistik-Kacheln ────────────────────────────────────
            '<div class="sig-ac-stats">' +
            '<div class="sig-ac-stat-box"><div class="sig-ac-stat-lbl">Nennleistung</div><div class="sig-ac-stat-val" id="sig_ac_rp_' + w + '" style="color:#f39c12">-- kW</div></div>' +
            '<div class="sig-ac-stat-box"><div class="sig-ac-stat-lbl">Nennstrom</div><div class="sig-ac-stat-val" id="sig_ac_rc_' + w + '" style="color:#f39c12">-- A</div></div>' +
            '<div class="sig-ac-stat-box"><div class="sig-ac-stat-lbl">Gesamtenergie</div><div class="sig-ac-stat-val" id="sig_ac_en_' + w + '" style="color:#27ae60">-- kWh</div></div>' +
            '<div class="sig-ac-stat-box"><div class="sig-ac-stat-lbl">Alarm</div><div class="sig-ac-stat-val" id="sig_ac_alm_' + w + '" style="color:#27ae60">--</div></div>' +
            '</div>' +
            // ── Steuerung ────────────────────────────────────────────
            '<div class="sig-ac-ctrl">' +
            '<div class="sig-ac-ctrl-lbl">Steuerung</div>' +
            '<div class="sig-ac-btn-row">' +
            '<button class="sig-ac-btn start" id="sig_ac_start_' + w + '">&#9654; Start</button>' +
            '<button class="sig-ac-btn stop"  id="sig_ac_stop_'  + w + '">&#9646;&#9646; Stop</button>' +
            '</div>' +
            '<div class="sig-ac-slider-row">' +
            '<span class="sig-ac-slider-lbl">Ladestrom:</span>' +
            '<input type="range" class="sig-ac-slider" id="sig_ac_slider_' + w + '" min="6" max="32" step="1" value="16">' +
            '<span class="sig-ac-slider-val" id="sig_ac_slider_val_' + w + '">16 A</span>' +
            '</div>' +
            '</div>' +
            '</div></div>'
        );

        // ── Anzeige aktualisieren ────────────────────────────────────────────
        function update() {
            var state = B._val(data, "oid_state");
            var si    = stateInfo(state);
            var badge = B._el("sig_ac_badge_" + w);
            if (badge) { badge.textContent = si.label; badge.className = "sig-ac-badge " + si.badge; }

            var pwr   = parseFloat(B._val(data, "oid_power")) || 0;
            B._txt("sig_ac_power_"   + w, B._fmtKW(pwr));
            B._css("sig_ac_power_"   + w, "color", pwr > 0.05 ? "#3498db" : (dark ? "#e0e6ef" : "#2c3e50"));

            var rp    = parseFloat(B._val(data, "oid_ratedPower"))   || 0;
            var rc    = parseFloat(B._val(data, "oid_ratedCurrent")) || 0;
            var en    = parseFloat(B._val(data, "oid_energy"))       || 0;
            B._txt("sig_ac_rp_"      + w, rp ? rp.toFixed(1) + " kW" : "-- kW");
            B._txt("sig_ac_rc_"      + w, rc ? Math.round(rc) + " A" : "-- A");
            B._txt("sig_ac_en_"      + w, en ? en.toFixed(1) + " kWh" : "-- kWh");

            var a1 = B._val(data, "oid_alarm1");
            var a2 = B._val(data, "oid_alarm2");
            var a3 = B._val(data, "oid_alarm3");
            var alTxt = alarmText(a1, a2, a3);
            B._txt("sig_ac_alm_"     + w, alTxt);
            B._css("sig_ac_alm_"     + w, "color", alTxt === "OK" ? "#27ae60" : "#e74c3c");

            // Ladestrom-Slider: Aktuellen Wert anzeigen
            var curOid = data.attr("oid_current");
            if (curOid) {
                var curVal = parseFloat(vis.states[curOid + ".val"]) || 16;
                var slider = B._el("sig_ac_slider_" + w);
                if (slider && !slider._dragging) {
                    slider.value = Math.round(curVal);
                    B._txt("sig_ac_slider_val_" + w, Math.round(curVal) + " A");
                }
            }

            // Start/Stop-Button Zustand hervorheben
            var ssOid  = data.attr("oid_startStop");
            var ssVal  = ssOid ? parseInt(vis.states[ssOid + ".val"]) : null;
            var btnStart = B._el("sig_ac_start_" + w);
            var btnStop  = B._el("sig_ac_stop_"  + w);
            if (btnStart && btnStop) {
                btnStart.classList.toggle("active-state", ssVal === 0);
                btnStop.classList.toggle("active-state",  ssVal === 1);
            }
        }

        // ── Steuer-Events ────────────────────────────────────────────────────
        var startBtn = B._el("sig_ac_start_" + w);
        var stopBtn  = B._el("sig_ac_stop_"  + w);
        var slider   = B._el("sig_ac_slider_" + w);
        var sliderLbl= B._el("sig_ac_slider_val_" + w);

        if (startBtn) {
            startBtn.addEventListener("click", function () {
                var oid = data.attr("oid_startStop");
                if (oid) vis.setValue(oid, 0);
            });
        }
        if (stopBtn) {
            stopBtn.addEventListener("click", function () {
                var oid = data.attr("oid_startStop");
                if (oid) vis.setValue(oid, 1);
            });
        }
        if (slider && sliderLbl) {
            slider.addEventListener("input", function () {
                sliderLbl.textContent = slider.value + " A";
            });
            slider.addEventListener("mousedown",  function () { slider._dragging = true;  });
            slider.addEventListener("touchstart", function () { slider._dragging = true;  });
            slider.addEventListener("mouseup",    function () {
                slider._dragging = false;
                var oid = data.attr("oid_current");
                if (oid) vis.setValue(oid, parseFloat(slider.value));
            });
            slider.addEventListener("touchend",   function () {
                slider._dragging = false;
                var oid = data.attr("oid_current");
                if (oid) vis.setValue(oid, parseFloat(slider.value));
            });
        }

        B._subscribe(widgetID, data,
            ["oid_state", "oid_power", "oid_energy", "oid_ratedPower", "oid_ratedCurrent",
             "oid_alarm1", "oid_alarm2", "oid_alarm3", "oid_startStop", "oid_current"],
            update);
        update();
    },

    // ── Widget 6: DC-Charger ─────────────────────────────────────────────────
    //
    // Lese-OIDs:
    //   dcCharger.outputPower                Ausgangsleistung  kW
    //   dcCharger.vehicleSoc                 Fahrzeug-SOC      %
    //   dcCharger.vehicleBatteryVoltage      Fahrzeugbatterie  V
    //   dcCharger.chargingCurrent            Ladestrom         A
    //   dcCharger.currentChargingCapacity    Sitzungsenergie   kWh
    //   dcCharger.currentChargingDuration    Sitzungsdauer     s
    //
    // Steuer-OID:
    //   dcCharger.control.startStop          0=Start, 1=Stop   WO
    //
    createDcCharger: function (widgetID, view, data, style) {
        var B    = vis.binds["vis-2-widgets-sigenergy"];
        var $div = $("#" + widgetID);
        if (!$div.length) {
            return setTimeout(function () { B.createDcCharger(widgetID, view, data, style); }, 100);
        }

        var dark  = B._isDark(data);
        var title = data.attr("sig_title") || "DC-Charger";
        var cls   = "sig-dc-wrap" + (dark ? "" : " light");
        var w     = widgetID;

        // Dauer in Sekunden → "Xh Ym" oder "Ym"
        function fmtDuration(sec) {
            var s = Math.round(Math.abs(parseFloat(sec) || 0));
            if (!s) return "0 min";
            var h = Math.floor(s / 3600);
            var m = Math.floor((s % 3600) / 60);
            return h ? h + "h " + m + "m" : m + " min";
        }

        // Fahrzeug-SOC → Farbe
        function vsocCol(p) {
            return parseFloat(p) > 60 ? "#27ae60" : parseFloat(p) > 25 ? "#f39c12" : "#e74c3c";
        }

        // Ladestatustext aus Leistung ableiten (kein eigenes State-Register)
        function badgeInfo(pwr) {
            if (pwr > 0.05) return { label: "Lädt",    cls: "charging" };
            if (pwr < 0)    return { label: "Fehler",  cls: "error" };
            return              { label: "Bereit",  cls: "idle" };
        }

        $div.html(
            '<div class="sig-w"><div class="' + cls + '">' +
            // ── Kopfzeile ────────────────────────────────────────────
            '<div class="sig-dc-head">' +
            '<span class="icon">&#9889;</span>' +
            '<span class="title">' + title + '</span>' +
            '<span class="sig-dc-badge idle" id="sig_dc_badge_' + w + '">Bereit</span>' +
            '</div>' +
            // ── Leistung groß ─────────────────────────────────────
            '<div class="sig-dc-power-big" id="sig_dc_power_' + w + '">-- kW</div>' +
            '<div class="sig-dc-power-lbl">Ausgangsleistung</div>' +
            // ── Fahrzeug-SOC Balken ───────────────────────────────
            '<div class="sig-dc-soc-row">' +
            '<span class="sig-dc-soc-lbl">&#128664; Fahrzeug SOC</span>' +
            '<span class="sig-dc-soc-val" id="sig_dc_vsoc_' + w + '">--%</span>' +
            '</div>' +
            '<div class="sig-dc-soc-bar-bg">' +
            '<div class="sig-dc-soc-bar-fill" id="sig_dc_bar_' + w + '" style="width:0%;background:#27ae60"></div>' +
            '</div>' +
            // ── Statistik-Kacheln ─────────────────────────────────
            '<div class="sig-dc-stats">' +
            '<div class="sig-dc-stat-box"><div class="sig-dc-stat-lbl">Spannung</div><div class="sig-dc-stat-val" id="sig_dc_volt_' + w + '" style="color:#3498db">-- V</div></div>' +
            '<div class="sig-dc-stat-box"><div class="sig-dc-stat-lbl">Strom</div><div class="sig-dc-stat-val" id="sig_dc_curr_' + w + '" style="color:#3498db">-- A</div></div>' +
            '<div class="sig-dc-stat-box"><div class="sig-dc-stat-lbl">Sitzungsenergie</div><div class="sig-dc-stat-val" id="sig_dc_en_' + w + '" style="color:#9b59b6">-- kWh</div></div>' +
            '<div class="sig-dc-stat-box"><div class="sig-dc-stat-lbl">Sitzungsdauer</div><div class="sig-dc-stat-val" id="sig_dc_dur_' + w + '" style="color:#9b59b6">--</div></div>' +
            '</div>' +
            // ── Steuerung ─────────────────────────────────────────
            '<div class="sig-dc-ctrl">' +
            '<div class="sig-dc-ctrl-lbl">Steuerung</div>' +
            '<div class="sig-dc-btn-row">' +
            '<button class="sig-dc-btn start" id="sig_dc_start_' + w + '">&#9654; Start</button>' +
            '<button class="sig-dc-btn stop"  id="sig_dc_stop_'  + w + '">&#9646;&#9646; Stop</button>' +
            '</div>' +
            '</div>' +
            '</div></div>'
        );

        // ── Anzeige aktualisieren ───────────────────────────────────────────
        function update() {
            var pwr  = parseFloat(B._val(data, "oid_power"))    || 0;
            var vsoc = parseFloat(B._val(data, "oid_vsoc"))     || 0;
            var volt = parseFloat(B._val(data, "oid_vvolt"))    || 0;
            var curr = parseFloat(B._val(data, "oid_curr"))     || 0;
            var en   = parseFloat(B._val(data, "oid_energy"))   || 0;
            var dur  = parseFloat(B._val(data, "oid_duration")) || 0;

            // Badge
            var bi = badgeInfo(pwr);
            var badge = B._el("sig_dc_badge_" + w);
            if (badge) { badge.textContent = bi.label; badge.className = "sig-dc-badge " + bi.cls; }

            // Leistung
            B._txt("sig_dc_power_" + w, B._fmtKW(pwr));
            B._css("sig_dc_power_" + w, "color", pwr > 0.05 ? "#f39c12" : (dark ? "#e0e6ef" : "#2c3e50"));

            // Fahrzeug-SOC
            var col = vsocCol(vsoc);
            B._txt("sig_dc_vsoc_" + w, B._fmtPct(vsoc));
            B._css("sig_dc_vsoc_" + w, "color", col);
            var bar = B._el("sig_dc_bar_" + w);
            if (bar) { bar.style.width = Math.min(100, vsoc) + "%"; bar.style.background = col; }

            // Kacheln
            B._txt("sig_dc_volt_" + w, volt ? volt.toFixed(0) + " V"   : "-- V");
            B._txt("sig_dc_curr_" + w, curr ? curr.toFixed(1) + " A"   : "-- A");
            B._txt("sig_dc_en_"   + w, en   ? en.toFixed(2)   + " kWh" : "-- kWh");
            B._txt("sig_dc_dur_"  + w, dur  ? fmtDuration(dur)         : "--");

            // Start/Stop-Buttons hervorheben
            var ssOid    = data.attr("oid_startStop");
            var ssVal    = ssOid ? parseInt(vis.states[ssOid + ".val"]) : null;
            var btnStart = B._el("sig_dc_start_" + w);
            var btnStop  = B._el("sig_dc_stop_"  + w);
            if (btnStart && btnStop) {
                btnStart.classList.toggle("active-state", ssVal === 0);
                btnStop.classList.toggle("active-state",  ssVal === 1);
            }
        }

        // ── Steuer-Events ───────────────────────────────────────────────────
        var startBtn = B._el("sig_dc_start_" + w);
        var stopBtn  = B._el("sig_dc_stop_"  + w);

        if (startBtn) {
            startBtn.addEventListener("click", function () {
                var oid = data.attr("oid_startStop");
                if (oid) vis.setValue(oid, 0);
            });
        }
        if (stopBtn) {
            stopBtn.addEventListener("click", function () {
                var oid = data.attr("oid_startStop");
                if (oid) vis.setValue(oid, 1);
            });
        }

        B._subscribe(widgetID, data,
            ["oid_power", "oid_vsoc", "oid_vvolt", "oid_curr",
             "oid_energy", "oid_duration", "oid_startStop"],
            update);
        update();
    },

    // ── Widget 7: Inverter ───────────────────────────────────────────────────
    //
    // Tabs: Leistung | Batterie | Netz | Alarme | Info
    //
    // runningState: 0=Standby, 1=Running, 2=Fault, 3=Shutdown
    // control.startStop: 0=Stop, 1=Start  (ACHTUNG: invertiert zu Charger-Widgets!)
    //
    createInverter: function (widgetID, view, data, style) {
        var B    = vis.binds["vis-2-widgets-sigenergy"];
        var $div = $("#" + widgetID);
        if (!$div.length) {
            return setTimeout(function () { B.createInverter(widgetID, view, data, style); }, 100);
        }

        var dark  = B._isDark(data);
        var title = data.attr("sig_title") || "Inverter";
        var cls   = "sig-inv-wrap" + (dark ? "" : " light");
        var w     = widgetID;

        // Betriebsstatus-Mapping
        function stateInfo(v) {
            switch (parseInt(v)) {
                case 0: return { label: "Standby",  cls: "standby"  };
                case 1: return { label: "Running",  cls: "running"  };
                case 2: return { label: "Fault",    cls: "fault"    };
                case 3: return { label: "Shutdown", cls: "shutdown" };
                default:return { label: "–",        cls: "standby"  };
            }
        }

        // Temperaturfarbe
        function tempCol(t) {
            var v = parseFloat(t);
            return v > 50 ? "#e74c3c" : v > 35 ? "#f39c12" : "#27ae60";
        }

        // Alarm-Darstellung: 0 = OK
        function almInfo(v) {
            var n = parseInt(v) || 0;
            return n === 0
                ? { text: "OK",          cls: "ok",    valCls: "ok"    }
                : { text: "0x" + n.toString(16).toUpperCase(), cls: "error", valCls: "error" };
        }

        // ── HTML aufbauen ────────────────────────────────────────────────────
        $div.html(
            '<div class="sig-w"><div class="' + cls + '">' +

            // Kopfzeile
            '<div class="sig-inv-head">' +
            '<span class="icon">&#9889;</span>' +
            '<span class="title">' + title + '</span>' +
            '<span class="sig-inv-badge standby" id="si_badge_' + w + '">–</span>' +
            '<button class="sig-inv-startstop" id="si_ss_btn_' + w + '">Start</button>' +
            '</div>' +

            // Tab-Leiste
            '<div class="sig-inv-tabs">' +
            '<div class="sig-inv-tab active" data-tab="power"  id="si_t0_' + w + '">Leistung</div>' +
            '<div class="sig-inv-tab"        data-tab="bat"    id="si_t1_' + w + '">Batterie</div>' +
            '<div class="sig-inv-tab"        data-tab="grid"   id="si_t2_' + w + '">Netz</div>' +
            '<div class="sig-inv-tab"        data-tab="alarms" id="si_t3_' + w + '">Alarme</div>' +
            '<div class="sig-inv-tab"        data-tab="info"   id="si_t4_' + w + '">Info</div>' +
            '</div>' +

            // ── Tab 0: Leistung ──────────────────────────────────────────────
            '<div class="sig-inv-panel active" id="si_p0_' + w + '">' +
            '<div class="sig-inv-row2">' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">Wirkleistung</div><div class="sig-inv-box-val" id="si_apwr_' + w + '" style="color:#3498db">-- kW</div></div>' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">PV-Leistung</div><div class="sig-inv-box-val" id="si_pv_' + w + '" style="color:#f39c12">-- kW</div></div>' +
            '</div>' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">Batterie Laden/Entladen</div><div class="sig-inv-box-val" id="si_esspwr_' + w + '" style="color:#9b59b6">-- kW</div><div class="sig-inv-box-sub" id="si_ess_dir_' + w + '"></div></div>' +
            '<div class="sig-inv-box">' +
            '<div class="sig-inv-box-lbl" style="margin-bottom:5px">Leistungsanteil EMS</div>' +
            '<div style="display:flex;align-items:center;gap:8px">' +
            '<input type="range" style="flex:1;accent-color:#3498db" min="-100" max="100" step="1" value="0" id="si_pct_sl_' + w + '">' +
            '<span class="sig-inv-ctrl-val" id="si_pct_lbl_' + w + '">–</span>' +
            '</div>' +
            '</div>' +
            '</div>' +

            // ── Tab 1: Batterie ───────────────────────────────────────────────
            '<div class="sig-inv-panel" id="si_p1_' + w + '">' +
            '<div class="sig-inv-row2">' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">SOC</div><div class="sig-inv-box-val" id="si_soc_' + w + '">--%</div></div>' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">SOH</div><div class="sig-inv-box-val" id="si_soh_' + w + '">--%</div></div>' +
            '</div>' +
            '<div class="sig-inv-box">' +
            '<div class="sig-inv-box-lbl" style="margin-bottom:5px">SOC-Verlauf</div>' +
            '<div class="sig-inv-soc-bar-bg"><div class="sig-inv-soc-bar-fill" id="si_soc_bar_' + w + '" style="width:0%;background:#27ae60"></div></div>' +
            '</div>' +
            '<div class="sig-inv-temp-grid">' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">&#127777; Ø Zelltemp.</div><div class="sig-inv-box-val" id="si_ct_' + w + '">-- °C</div></div>' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">Ø Zellspannung</div><div class="sig-inv-box-val" id="si_cv_' + w + '" style="color:#3498db">-- V</div></div>' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">&#127777; Max Temp.</div><div class="sig-inv-box-val" id="si_tmax_' + w + '">-- °C</div></div>' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">&#127777; Min Temp.</div><div class="sig-inv-box-val" id="si_tmin_' + w + '">-- °C</div></div>' +
            '</div>' +
            '</div>' +

            // ── Tab 2: Netz ───────────────────────────────────────────────────
            '<div class="sig-inv-panel" id="si_p2_' + w + '">' +
            '<div class="sig-inv-phase-row">' +
            '<div class="sig-inv-phase-box"><div class="sig-inv-phase-lbl">L1</div><div class="sig-inv-phase-val" id="si_uA_' + w + '">-- V</div></div>' +
            '<div class="sig-inv-phase-box"><div class="sig-inv-phase-lbl">L2</div><div class="sig-inv-phase-val" id="si_uB_' + w + '">-- V</div></div>' +
            '<div class="sig-inv-phase-box"><div class="sig-inv-phase-lbl">L3</div><div class="sig-inv-phase-val" id="si_uC_' + w + '">-- V</div></div>' +
            '</div>' +
            '<div class="sig-inv-row2">' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">Netzfrequenz</div><div class="sig-inv-box-val" id="si_freq_' + w + '" style="color:#3498db">-- Hz</div></div>' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">Leistungsfaktor</div><div class="sig-inv-box-val" id="si_pf_' + w + '" style="color:#3498db">--</div></div>' +
            '</div>' +
            '<div class="sig-inv-box"><div class="sig-inv-box-lbl">&#127777; PCS-Innentemperatur</div><div class="sig-inv-box-val" id="si_pcs_t_' + w + '">-- °C</div></div>' +
            '</div>' +

            // ── Tab 3: Alarme ──────────────────────────────────────────────────
            '<div class="sig-inv-panel" id="si_p3_' + w + '">' +
            '<div class="sig-inv-alm-row ok" id="si_alm1row_' + w + '"><span class="sig-inv-alm-lbl">Alarm 1 (PCS)</span><span class="sig-inv-alm-val ok" id="si_alm1_' + w + '">–</span></div>' +
            '<div class="sig-inv-alm-row ok" id="si_alm2row_' + w + '"><span class="sig-inv-alm-lbl">Alarm 2 (PCS)</span><span class="sig-inv-alm-val ok" id="si_alm2_' + w + '">–</span></div>' +
            '<div class="sig-inv-alm-row ok" id="si_alm3row_' + w + '"><span class="sig-inv-alm-lbl">Alarm 3 (ESS)</span><span class="sig-inv-alm-val ok" id="si_alm3_' + w + '">–</span></div>' +
            '<div class="sig-inv-alm-row ok" id="si_alm4row_' + w + '"><span class="sig-inv-alm-lbl">Alarm 4 (Gateway)</span><span class="sig-inv-alm-val ok" id="si_alm4_' + w + '">–</span></div>' +
            '<div class="sig-inv-alm-row ok" id="si_alm5row_' + w + '"><span class="sig-inv-alm-lbl">Alarm 5 (DC-Charger)</span><span class="sig-inv-alm-val ok" id="si_alm5_' + w + '">–</span></div>' +
            '</div>' +

            // ── Tab 4: Info ────────────────────────────────────────────────────
            '<div class="sig-inv-panel" id="si_p4_' + w + '">' +
            '<div class="sig-inv-info-row"><div class="sig-inv-info-lbl">Modell</div><div class="sig-inv-info-val" id="si_model_' + w + '">–</div></div>' +
            '<div class="sig-inv-info-row"><div class="sig-inv-info-lbl">Seriennummer</div><div class="sig-inv-info-val" id="si_serial_' + w + '">–</div></div>' +
            '<div class="sig-inv-info-row"><div class="sig-inv-info-lbl">Firmware</div><div class="sig-inv-info-val" id="si_fw_' + w + '">–</div></div>' +
            '<div class="sig-inv-ctrl-row">' +
            '<span class="sig-inv-ctrl-lbl">Remote EMS</span>' +
            '<button class="sig-inv-toggle off" id="si_ems_btn_' + w + '">Inaktiv</button>' +
            '</div>' +
            '</div>' +

            '</div></div>'
        );

        // ── Tab-Umschaltung ──────────────────────────────────────────────────
        var tabs   = ["si_t0_", "si_t1_", "si_t2_", "si_t3_", "si_t4_"];
        var panels = ["si_p0_", "si_p1_", "si_p2_", "si_p3_", "si_p4_"];

        tabs.forEach(function (tid, idx) {
            var tabEl = B._el(tid + w);
            if (!tabEl) return;
            tabEl.addEventListener("click", function () {
                tabs.forEach(function (t, i) {
                    var te = B._el(t + w);
                    var pe = B._el(panels[i] + w);
                    if (te) te.classList.toggle("active", i === idx);
                    if (pe) pe.classList.toggle("active", i === idx);
                });
            });
        });

        // ── Anzeige aktualisieren ────────────────────────────────────────────
        function update() {
            // Betriebsstatus
            var si = stateInfo(B._val(data, "oid_runState"));
            var badge = B._el("si_badge_" + w);
            if (badge) { badge.textContent = si.label; badge.className = "sig-inv-badge " + si.cls; }

            // Start/Stop-Button: 0=Stop, 1=Start (invertiert zu Charger!)
            var ssOid  = data.attr("oid_startStop");
            var ssVal  = ssOid ? parseInt(vis.states[ssOid + ".val"]) : null;
            var ssBtn  = B._el("si_ss_btn_" + w);
            if (ssBtn) {
                var isRunning = (ssVal === 1 || si.cls === "running");
                ssBtn.textContent = isRunning ? "Stop" : "Start";
                ssBtn.className   = "sig-inv-startstop " + (isRunning ? "running" : "stopped");
            }

            // Tab Leistung
            var ap  = parseFloat(B._val(data, "oid_activePower")) || 0;
            var pv  = parseFloat(B._val(data, "oid_pvPower"))     || 0;
            var ess = parseFloat(B._val(data, "oid_essPower"))    || 0;
            B._txt("si_apwr_"    + w, B._fmtKW(ap));
            B._txt("si_pv_"      + w, B._fmtKW(pv));
            B._txt("si_esspwr_"  + w, B._fmtKW(ess));
            B._txt("si_ess_dir_" + w, ess > 0.05 ? "▲ Laden" : ess < -0.05 ? "▼ Entladen" : "Bereit");
            B._css("si_esspwr_"  + w, "color", ess > 0.05 ? "#27ae60" : ess < -0.05 ? "#e74c3c" : "#9b59b6");

            // Leistungsanteil-Slider
            var pctOid = data.attr("oid_pwrPct");
            var pctVal = pctOid ? parseFloat(vis.states[pctOid + ".val"]) || 0 : 0;
            var pctSl  = B._el("si_pct_sl_" + w);
            if (pctSl && !pctSl._dragging) pctSl.value = Math.round(pctVal);
            B._txt("si_pct_lbl_" + w, pctOid ? Math.round(pctVal) + " %" : "–");

            // Tab Batterie
            var soc  = parseFloat(B._val(data, "oid_soc"))      || 0;
            var soh  = parseFloat(B._val(data, "oid_soh"))      || 0;
            var ct   = B._val(data, "oid_cellTemp");
            var cv   = parseFloat(B._val(data, "oid_cellVolt")) || 0;
            var tmax = B._val(data, "oid_maxTemp");
            var tmin = B._val(data, "oid_minTemp");
            var socCol = B._socCol(soc);
            B._txt("si_soc_"  + w, B._fmtPct(soc));  B._css("si_soc_" + w, "color", socCol);
            B._txt("si_soh_"  + w, B._fmtPct(soh));  B._css("si_soh_" + w, "color", soh > 80 ? "#27ae60" : "#f39c12");
            var bar = B._el("si_soc_bar_" + w);
            if (bar) { bar.style.width = Math.min(100, soc) + "%"; bar.style.background = socCol; }
            B._txt("si_ct_"   + w, ct   !== undefined ? parseFloat(ct).toFixed(1)   + " °C" : "-- °C");
            B._css("si_ct_"   + w, "color", ct !== undefined ? tempCol(ct) : "#e0e6ef");
            B._txt("si_cv_"   + w, cv   ? cv.toFixed(3) + " V"  : "-- V");
            B._txt("si_tmax_" + w, tmax !== undefined ? parseFloat(tmax).toFixed(1) + " °C" : "-- °C");
            B._css("si_tmax_" + w, "color", tmax !== undefined ? tempCol(tmax) : "#e0e6ef");
            B._txt("si_tmin_" + w, tmin !== undefined ? parseFloat(tmin).toFixed(1) + " °C" : "-- °C");

            // Tab Netz
            var uA   = parseFloat(B._val(data, "oid_uA"))   || 0;
            var uB   = parseFloat(B._val(data, "oid_uB"))   || 0;
            var uC   = parseFloat(B._val(data, "oid_uC"))   || 0;
            var freq = parseFloat(B._val(data, "oid_freq")) || 0;
            var pf   = parseFloat(B._val(data, "oid_pf"))   || 0;
            var pcsT = B._val(data, "oid_pcsTemp");
            B._txt("si_uA_"   + w, uA   ? uA.toFixed(1)   + " V"  : "-- V");
            B._txt("si_uB_"   + w, uB   ? uB.toFixed(1)   + " V"  : "-- V");
            B._txt("si_uC_"   + w, uC   ? uC.toFixed(1)   + " V"  : "-- V");
            B._txt("si_freq_" + w, freq ? freq.toFixed(2)  + " Hz" : "-- Hz");
            B._txt("si_pf_"   + w, pf   ? pf.toFixed(3)           : "--");
            B._txt("si_pcs_t_"+ w, pcsT !== undefined ? parseFloat(pcsT).toFixed(1) + " °C" : "-- °C");
            B._css("si_pcs_t_"+ w, "color", pcsT !== undefined ? tempCol(pcsT) : (dark ? "#e0e6ef" : "#2c3e50"));

            // Tab Alarme
            [1,2,3,4,5].forEach(function (i) {
                var ai  = almInfo(B._val(data, "oid_alm" + i));
                var row = B._el("si_alm" + i + "row_" + w);
                var val = B._el("si_alm" + i + "_"    + w);
                if (row) { row.className = "sig-inv-alm-row " + ai.cls; }
                if (val) { val.textContent = ai.text; val.className = "sig-inv-alm-val " + ai.valCls; }
            });

            // Tab Info
            B._txt("si_model_"  + w, B._val(data, "oid_model")  || "–");
            B._txt("si_serial_" + w, B._val(data, "oid_serial") || "–");
            B._txt("si_fw_"     + w, B._val(data, "oid_fw")     || "–");

            // EMS-Button
            var emsOid = data.attr("oid_emsEnable");
            var emsVal = emsOid ? parseInt(vis.states[emsOid + ".val"]) : null;
            var emsBtn = B._el("si_ems_btn_" + w);
            if (emsBtn) {
                var emsOn = (emsVal === 1);
                emsBtn.textContent = emsOn ? "Aktiv" : "Inaktiv";
                emsBtn.className   = "sig-inv-toggle " + (emsOn ? "on" : "off");
            }
        }

        // ── Steuer-Events ────────────────────────────────────────────────────
        // Start/Stop (0=Stop, 1=Start)
        var ssBtn = B._el("si_ss_btn_" + w);
        if (ssBtn) {
            ssBtn.addEventListener("click", function () {
                var oid = data.attr("oid_startStop");
                if (!oid) return;
                var cur = parseInt(vis.states[oid + ".val"]);
                vis.setValue(oid, cur === 1 ? 0 : 1);
            });
        }

        // EMS-Toggle
        var emsBtn = B._el("si_ems_btn_" + w);
        if (emsBtn) {
            emsBtn.addEventListener("click", function () {
                var oid = data.attr("oid_emsEnable");
                if (!oid) return;
                var cur = parseInt(vis.states[oid + ".val"]);
                vis.setValue(oid, cur === 1 ? 0 : 1);
            });
        }

        // Leistungsanteil-Slider
        var pctSl  = B._el("si_pct_sl_" + w);
        var pctLbl = B._el("si_pct_lbl_" + w);
        if (pctSl && pctLbl) {
            pctSl.addEventListener("input", function () {
                pctLbl.textContent = pctSl.value + " %";
            });
            pctSl.addEventListener("mousedown",  function () { pctSl._dragging = true;  });
            pctSl.addEventListener("touchstart", function () { pctSl._dragging = true;  });
            pctSl.addEventListener("mouseup",    function () {
                pctSl._dragging = false;
                var oid = data.attr("oid_pwrPct");
                if (oid) vis.setValue(oid, parseFloat(pctSl.value));
            });
            pctSl.addEventListener("touchend",   function () {
                pctSl._dragging = false;
                var oid = data.attr("oid_pwrPct");
                if (oid) vis.setValue(oid, parseFloat(pctSl.value));
            });
        }

        B._subscribe(widgetID, data,
            ["oid_activePower","oid_pvPower","oid_essPower","oid_runState",
             "oid_soc","oid_soh","oid_cellTemp","oid_cellVolt","oid_maxTemp","oid_minTemp",
             "oid_uA","oid_uB","oid_uC","oid_freq","oid_pf","oid_pcsTemp",
             "oid_alm1","oid_alm2","oid_alm3","oid_alm4","oid_alm5",
             "oid_fw","oid_model","oid_serial",
             "oid_startStop","oid_emsEnable","oid_pwrPct"],
            update);
        update();
    }
};

vis.binds["vis-2-widgets-sigenergy"].showVersion();
