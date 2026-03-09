/*
    ioBroker.vis vis-2-widgets-sigenergy Widget-Set
    version: "0.1.1",
    Copyright 2026 ssbingo s.sternitzke@online.de

    4 Widgets fuer Sigenergy Solarenergieanlagen:
      createEnergyFlow     — Energiefluss-Diagramm
      createBatteryStatus  — Akku-Status & Prognosen
      createPowerOverview  — Echtzeit-Leistung
      createStatistics     — Energiestatistiken

    Architektur (identisch mit Template-Muster):
      - createXXX() baut kompletten HTML-String und injiziert ihn per .html()
      - vis.states.bind() abonniert OID-Aenderungen fuer Live-Updates
      - $div.data('bound', [...]) gibt vis die OID-Keys zum Lifecycle-Management
      - $div.data('bindHandler', fn) fuer spaeteren unbind
*/
'use strict';

/* global $, vis, systemDictionary */

/* ================================================================
   UEBERSETZUNGEN fuer den VIS-Editor
   ================================================================ */
$.extend(true, systemDictionary, {
    /* Gruppen */
    'group_oids':    { en: 'OID Assignments',       de: 'OID-Zuweisungen'         },
    'group_appear':  { en: 'Appearance',             de: 'Darstellung'             },

    /* OID-Felder */
    'oid_pv':        { en: 'OID — PV Power (kW)',            de: 'OID — PV-Leistung (kW)'         },
    'oid_bat':       { en: 'OID — Battery Power (kW)',       de: 'OID — Batterie-Leistung (kW)'   },
    'oid_grid':      { en: 'OID — Grid Power (kW)',          de: 'OID — Netz-Leistung (kW)'       },
    'oid_house':     { en: 'OID — House Consumption (kW)',   de: 'OID — Haus-Verbrauch (kW)'      },
    'oid_soc':       { en: 'OID — Battery SOC (%)',          de: 'OID — Batterie-Ladung (%)'      },
    'oid_soh':       { en: 'OID — Battery Health SOH (%)',   de: 'OID — Batterie-Gesundheit (%)'  },
    'oid_ttf':       { en: 'OID — Time to Full (min)',       de: 'OID — Zeit bis Voll (min)'      },
    'oid_ttr':       { en: 'OID — Time Remaining (min)',     de: 'OID — Restlaufzeit (min)'       },
    'oid_sc':        { en: 'OID — Self Consumption (%)',     de: 'OID — Eigenverbrauch (%)'       },
    'oid_aut':       { en: 'OID — Autarky Rate (%)',         de: 'OID — Autarkierate (%)'         },
    'oid_maxsoc':    { en: 'OID — Day Max SOC (%)',          de: 'OID — Tages-Max SOC (%)'        },
    'oid_minsoc':    { en: 'OID — Day Min SOC (%)',          de: 'OID — Tages-Min SOC (%)'        },
    'oid_charg':     { en: 'OID — Daily Charge Energy (kWh)',    de: 'OID — Tages-Ladung (kWh)'       },
    'oid_discharg':  { en: 'OID — Daily Discharge Energy (kWh)', de: 'OID — Tages-Entladung (kWh)'    },
    'oid_covtime':   { en: 'OID — Battery Coverage Time (min)',  de: 'OID — Batteriedeckungszeit (min)'},
    'oid_chargt':    { en: 'OID — Daily Charge Time (min)',  de: 'OID — Tages-Ladezeit (min)'     },

    /* Darstellungsoptionen */
    'sig_title':     { en: 'Widget Title',           de: 'Widget-Titel'            },
    'sig_darkmode':  { en: 'Dark Mode',              de: 'Dunkelmodus'             },
    'sig_animation': { en: 'Animate Energy Flow',    de: 'Energiefluss animieren'  },
});

/* ================================================================
   HAUPTMODUL
   ================================================================ */
vis.binds['vis-2-widgets-sigenergy'] = {

    version: '0.1.1',

    /* ── Version beim Laden einmalig loggen ── */
    showVersion: function () {
        if (vis.binds['vis-2-widgets-sigenergy'].version) {
            console.log('[vis-2-widgets-sigenergy] v' + vis.binds['vis-2-widgets-sigenergy'].version + ' geladen');
            vis.binds['vis-2-widgets-sigenergy'].version = null;
        }
    },

    /* ============================================================
       INTERNE HELFER
       ============================================================ */

    /* Formatiert Kilowatt-Werte */
    _fmtKW: function (v) {
        var n = parseFloat(v);
        if (isNaN(n)) return '-- kW';
        return (Math.abs(n) >= 10 ? n.toFixed(1) : n.toFixed(2)) + ' kW';
    },

    /* Formatiert Prozentwerte */
    _fmtPct: function (v) {
        var n = parseFloat(v);
        return isNaN(n) ? '--%' : Math.round(n) + '%';
    },

    /* Formatiert Minutenwerte als lesbare Zeit */
    _fmtMin: function (v) {
        var m = Math.round(Math.abs(parseFloat(v) || 0));
        if (!m) return '0 min';
        if (m < 60) return m + ' min';
        var h = Math.floor(m / 60);
        var r = m % 60;
        return h + 'h' + (r ? ' ' + r + 'm' : '');
    },

    /* Formatiert Kilowattstunden */
    _fmtKWh: function (v) {
        var n = parseFloat(v);
        return isNaN(n) ? '-- kWh' : n.toFixed(1) + ' kWh';
    },

    /* Liest aktuellen OID-Wert aus vis.states */
    _getVal: function (data, attr) {
        var oid = data.attr ? data.attr(attr) : data[attr];
        if (!oid) return undefined;
        return vis.states[oid + '.val'];
    },

    /* SOC-Farbe: gruen / orange / rot */
    _socColor: function (soc) {
        return soc < 20 ? '#e74c3c' : soc < 40 ? '#f39c12' : '#27ae60';
    },

    /* Wartet bis Container im DOM ist, dann Callback */
    _whenReady: function (widgetID, cb) {
        var $div = $('#' + widgetID);
        if (!$div.length) {
            return setTimeout(function () {
                vis.binds['vis-2-widgets-sigenergy']._whenReady(widgetID, cb);
            }, 100);
        }
        cb($div);
    },

    /*
     * Kernfunktion: OID binden + initialen Wert liefern
     *   oid    — OID-String
     *   bound  — Array, in das '.val'-Key eingetragen wird (fuer vis lifecycle)
     *   cb     — Callback(newValue) bei jeder Aenderung
     * Gibt eine Funktion zurueck, die den Initialwert ausloest (oder null).
     */
    _bind: function (oid, bound, cb) {
        if (!oid) return null;
        var key = oid + '.val';
        bound.push(key);
        vis.states.bind(key, function (e, newVal) { cb(newVal); });
        var cur = vis.states[key];
        return (cur !== undefined && cur !== null) ? function () { cb(cur); } : null;
    },

    /* Fuehrt alle gesammelten Initialisierungsfunktionen aus und speichert Binding-Info */
    _applyBindings: function (widgetID, bound, deferred) {
        setTimeout(function () {
            for (var i = 0; i < deferred.length; i++) {
                try { deferred[i](); } catch (e) { /* ignorieren */ }
            }
            var $d = $('#' + widgetID);
            if ($d.length) {
                $d.data('bound', bound);
                $d.data('bindHandler', null);
            }
        }, 50);
    },

    /* Setzt Textinhalt eines Elements per ID */
    _setText: function (id, text) {
        var el = document.getElementById(id);
        if (el) el.textContent = text;
    },

    /* Setzt Textinhalt UND style.color eines Elements per ID */
    _setTextColor: function (id, text, color) {
        var el = document.getElementById(id);
        if (el) {
            el.textContent = text;
            if (color !== undefined) el.style.color = color;
        }
    },


    /* ============================================================
       WIDGET 1 — ENERGIEFLUSS-DIAGRAMM
       Aufbau: Titelzeile + SVG-Pfeildiagramm + 2x3-Node-Grid
       ============================================================ */
    createEnergyFlow: function (widgetID, view, data, style) {
        var B   = vis.binds['vis-2-widgets-sigenergy'];
        var wid = widgetID;

        B._whenReady(wid, function ($div) {
            /* --- Konfiguration lesen --- */
            var dark  = data.attr('sig_darkmode') !== 'false';
            var anim  = data.attr('sig_animation') !== 'false';
            var title = data.attr('sig_title') || 'Energiefluss';

            /* --- Aktuelle Werte --- */
            var pvW   = parseFloat(B._getVal(data, 'oid_pv'))    || 0;
            var batW  = parseFloat(B._getVal(data, 'oid_bat'))   || 0;
            var gridW = parseFloat(B._getVal(data, 'oid_grid'))  || 0;
            var housW = parseFloat(B._getVal(data, 'oid_house')) || 0;
            var socV  = parseFloat(B._getVal(data, 'oid_soc'))   || 0;

            /* --- Pfad-Richtungen (Batterie und Netz koennen umkehren) --- */
            var batPath  = batW  < -0.05 ? 'M150,100 Q150,80 230,55' : 'M230,55 Q150,80 150,100';
            var gridPath = gridW < -0.05 ? 'M150,100 Q100,120 70,155' : 'M70,155 Q100,120 150,100';

            function activeClass(v) { return Math.abs(parseFloat(v) || 0) > 0.05 ? ' sig-ef-active' : ''; }

            /* --- CSS-Klassen je Theme --- */
            var wrap  = dark ? 'sig-ef-wrap' : 'sig-ef-wrap sig-ef-light';
            var bgPv  = dark ? 'rgba(243,156,18,.15)'  : 'rgba(243,156,18,.12)';
            var bgBat = dark ? 'rgba(155,89,182,.15)'  : 'rgba(155,89,182,.12)';
            var bgGrd = dark ? 'rgba(52,152,219,.15)'  : 'rgba(52,152,219,.12)';
            var bgHou = dark ? 'rgba(39,174,96,.15)'   : 'rgba(39,174,96,.12)';
            var batIcon = socV < 20 ? '&#129707;' : '&#128267;';

            /* --- HTML-Ausgabe --- */
            var html = '<div class="' + wrap + '">';

            /* Titel */
            html += '<div class="sig-ef-title">&#9889; ' + title + '</div>';

            /* SVG Flussdiagramm */
            html += '<svg class="sig-ef-svg" viewBox="0 0 300 210" preserveAspectRatio="none">'
                  + '<defs>'
                  + '<marker id="mk-pv-'   + wid + '" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><polygon points="0,0 7,3.5 0,7" fill="#f39c12"/></marker>'
                  + '<marker id="mk-bat-'  + wid + '" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><polygon points="0,0 7,3.5 0,7" fill="#9b59b6"/></marker>'
                  + '<marker id="mk-grid-' + wid + '" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><polygon points="0,0 7,3.5 0,7" fill="#3498db"/></marker>'
                  + '<marker id="mk-hous-' + wid + '" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><polygon points="0,0 7,3.5 0,7" fill="#27ae60"/></marker>'
                  + '</defs>'
                  /* PV → Zentrum */
                  + '<path id="sig-p-pv-'   + wid + '" class="sig-ef-path sig-ef-pv'   + activeClass(pvW)   + '" d="M70,55 Q110,78 150,100"   marker-end="url(#mk-pv-'   + wid + ')"/>'
                  /* Bat ↔ Zentrum */
                  + '<path id="sig-p-bat-'  + wid + '" class="sig-ef-path sig-ef-bat'  + activeClass(batW)  + '" d="' + batPath  + '" marker-end="url(#mk-bat-'  + wid + ')"/>'
                  /* Grid ↔ Zentrum */
                  + '<path id="sig-p-grid-' + wid + '" class="sig-ef-path sig-ef-grid' + activeClass(gridW) + '" d="' + gridPath + '" marker-end="url(#mk-grid-' + wid + ')"/>'
                  /* Zentrum → Haus */
                  + '<path id="sig-p-hous-' + wid + '" class="sig-ef-path sig-ef-hous' + activeClass(housW) + '" d="M150,100 Q190,128 230,155" marker-end="url(#mk-hous-' + wid + ')"/>'
                  + '</svg>';

            /* Node-Grid: PV | ⚡ | Bat / Grid | _ | Haus */
            html += '<div class="sig-ef-grid">'
                  /* PV */
                  + '<div class="sig-ef-node">'
                  +   '<div class="sig-ef-icon" style="background:' + bgPv + ';color:#f39c12">&#9728;</div>'
                  +   '<div class="sig-ef-label">Solar PV</div>'
                  +   '<div id="sig-v-pv-' + wid + '" class="sig-ef-val" style="color:#f39c12">' + B._fmtKW(pvW) + '</div>'
                  + '</div>'
                  /* Zentrum */
                  + '<div class="sig-ef-center">&#9889;</div>'
                  /* Batterie */
                  + '<div class="sig-ef-node">'
                  +   '<div id="sig-icon-bat-' + wid + '" class="sig-ef-icon" style="background:' + bgBat + ';color:#9b59b6">' + batIcon + '</div>'
                  +   '<div class="sig-ef-label">Batterie</div>'
                  +   '<div id="sig-v-bat-' + wid + '" class="sig-ef-val" style="color:#9b59b6">' + B._fmtKW(batW) + '</div>'
                  + '</div>'
                  /* Netz */
                  + '<div class="sig-ef-node">'
                  +   '<div class="sig-ef-icon" style="background:' + bgGrd + ';color:#3498db">&#128268;</div>'
                  +   '<div class="sig-ef-label">Netz</div>'
                  +   '<div id="sig-v-grid-' + wid + '" class="sig-ef-val" style="color:#3498db">' + B._fmtKW(gridW) + '</div>'
                  + '</div>'
                  /* Leer-Slot Mitte unten */
                  + '<div></div>'
                  /* Haus */
                  + '<div class="sig-ef-node">'
                  +   '<div class="sig-ef-icon" style="background:' + bgHou + ';color:#27ae60">&#127968;</div>'
                  +   '<div class="sig-ef-label">Haus</div>'
                  +   '<div id="sig-v-hous-' + wid + '" class="sig-ef-val" style="color:#27ae60">' + B._fmtKW(housW) + '</div>'
                  + '</div>'
                  + '</div>'; /* /sig-ef-grid */

            html += '</div>'; /* /sig-ef-wrap */

            $div.html(html);

            /* --- Live-Bindings --- */
            var bound = [], def = [];
            function q(d) { if (d) def.push(d); }

            /* Hilfsfunktion: SVG-Pfad und Aktivierungsklasse aktualisieren */
            function updatePath(pathId, classBase, val, batOrGrid) {
                var el = document.getElementById(pathId);
                if (!el) return;
                var active = Math.abs(parseFloat(val) || 0) > 0.05;
                el.className = 'sig-ef-path sig-ef-' + classBase + (active ? ' sig-ef-active' : '');
                if (anim && active) {
                    el.style.animationPlayState = 'running';
                } else {
                    el.style.animationPlayState = 'paused';
                }
                /* Richtungspfad fuer Batterie und Netz */
                if (batOrGrid === 'bat') {
                    var pw = parseFloat(val) || 0;
                    el.setAttribute('d', pw < -0.05 ? 'M150,100 Q150,80 230,55' : 'M230,55 Q150,80 150,100');
                }
                if (batOrGrid === 'grid') {
                    var gw = parseFloat(val) || 0;
                    el.setAttribute('d', gw < -0.05 ? 'M150,100 Q100,120 70,155' : 'M70,155 Q100,120 150,100');
                }
            }

            q(B._bind(data.attr('oid_pv'), bound, function (v) {
                B._setText('sig-v-pv-' + wid, B._fmtKW(v));
                updatePath('sig-p-pv-' + wid, 'pv', v, null);
            }));

            q(B._bind(data.attr('oid_bat'), bound, function (v) {
                B._setText('sig-v-bat-' + wid, B._fmtKW(v));
                updatePath('sig-p-bat-' + wid, 'bat', v, 'bat');
            }));

            q(B._bind(data.attr('oid_grid'), bound, function (v) {
                B._setText('sig-v-grid-' + wid, B._fmtKW(v));
                updatePath('sig-p-grid-' + wid, 'grid', v, 'grid');
            }));

            q(B._bind(data.attr('oid_house'), bound, function (v) {
                B._setText('sig-v-hous-' + wid, B._fmtKW(v));
                updatePath('sig-p-hous-' + wid, 'hous', v, null);
            }));

            q(B._bind(data.attr('oid_soc'), bound, function (v) {
                var el = document.getElementById('sig-icon-bat-' + wid);
                if (el) el.innerHTML = (parseFloat(v) || 0) < 20 ? '&#129707;' : '&#128267;';
            }));

            B._applyBindings(wid, bound, def);
        });
    },


    /* ============================================================
       WIDGET 2 — AKKU-STATUS & PROGNOSEN
       Aufbau: Header (Icon + Titel + SOH) | SOC-Zahl + Balken |
               5-Kacheln-Grid (Leistung, Zeit bis Voll,
               Restlaufzeit, Eigenverbrauch, Autarkie)
       ============================================================ */
    createBatteryStatus: function (widgetID, view, data, style) {
        var B   = vis.binds['vis-2-widgets-sigenergy'];
        var wid = widgetID;

        B._whenReady(wid, function ($div) {
            var dark = data.attr('sig_darkmode') !== 'false';

            /* --- Aktuelle Werte --- */
            var socRaw = parseFloat(B._getVal(data, 'oid_soc')) || 0;
            var soc    = Math.max(0, Math.min(100, socRaw));
            var sohV   = B._getVal(data, 'oid_soh');
            var batW   = parseFloat(B._getVal(data, 'oid_bat')) || 0;
            var ttfV   = B._getVal(data, 'oid_ttf');
            var ttrV   = B._getVal(data, 'oid_ttr');
            var scV    = B._getVal(data, 'oid_sc');
            var autV   = B._getVal(data, 'oid_aut');

            var sc     = B._socColor(soc);
            var barCls = 'sig-bat-bar-fill' + (soc < 20 ? ' sig-bat-crit' : soc < 40 ? ' sig-bat-warn' : '');
            var wrap   = dark ? 'sig-bat-wrap' : 'sig-bat-wrap sig-bat-light';

            /* Leistungsrichtung und -farbe */
            function batPowText(w) {
                w = parseFloat(w) || 0;
                var dir = w > 0.05 ? '\u2191 ' : w < -0.05 ? '\u2193 ' : '';
                return dir + B._fmtKW(Math.abs(w));
            }
            function batPowColor(w) {
                w = parseFloat(w) || 0;
                return w > 0.05 ? '#f39c12' : w < -0.05 ? '#27ae60' : '';
            }

            /* --- HTML --- */
            var html = '<div class="' + wrap + '">';

            /* Header */
            html += '<div class="sig-bat-head">'
                  +   '<span class="sig-bat-head-icon">&#128267;</span>'
                  +   '<span class="sig-bat-head-title">Batterie Status</span>'
                  +   '<span id="sig-soh-' + wid + '" class="sig-bat-soh">SOH: ' + B._fmtPct(sohV) + '</span>'
                  + '</div>';

            /* Grosse SOC-Zahl */
            html += '<div id="sig-soc-big-' + wid + '" class="sig-bat-soc-big" style="color:' + sc + '">'
                  +   Math.round(soc) + '%'
                  + '</div>';

            /* SOC-Balken */
            html += '<div class="sig-bat-bar-bg">'
                  +   '<div id="sig-soc-bar-' + wid + '" class="' + barCls + '" style="width:' + soc + '%;background:' + sc + '"></div>'
                  + '</div>';

            /* Skalenbeschriftung */
            html += '<div class="sig-bat-scale"><span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span></div>';

            /* Statistik-Kacheln (2 Spalten) */
            html += '<div class="sig-bat-stats">';

            var tiles = [
                { id: 'sig-bat-pow-'  + wid, label: '&#9889; Leistung',       val: batPowText(batW),   color: batPowColor(batW) },
                { id: 'sig-bat-ttf-'  + wid, label: '&#8987; Bis Voll',       val: B._fmtMin(ttfV),    color: '' },
                { id: 'sig-bat-ttr-'  + wid, label: '&#9203; Restlaufzeit',   val: B._fmtMin(ttrV),    color: '' },
                { id: 'sig-bat-sc-'   + wid, label: '&#9728; Eigenverbrauch', val: B._fmtPct(scV),     color: '' },
                { id: 'sig-bat-aut-'  + wid, label: '&#127969; Autarkierate', val: B._fmtPct(autV),    color: '' },
            ];

            for (var i = 0; i < tiles.length; i++) {
                var t = tiles[i];
                html += '<div class="sig-bat-tile">'
                      +   '<div class="sig-bat-tile-label">' + t.label + '</div>'
                      +   '<div id="' + t.id + '" class="sig-bat-tile-val"'
                      +     (t.color ? ' style="color:' + t.color + '"' : '') + '>'
                      +     t.val
                      +   '</div>'
                      + '</div>';
            }

            html += '</div>'; /* /sig-bat-stats */
            html += '</div>'; /* /sig-bat-wrap */

            $div.html(html);

            /* --- Live-Bindings --- */
            var bound = [], def = [];
            function q(d) { if (d) def.push(d); }

            q(B._bind(data.attr('oid_soc'), bound, function (v) {
                var s = Math.max(0, Math.min(100, parseFloat(v) || 0));
                var c = B._socColor(s);
                var bc = 'sig-bat-bar-fill' + (s < 20 ? ' sig-bat-crit' : s < 40 ? ' sig-bat-warn' : '');
                B._setTextColor('sig-soc-big-' + wid, Math.round(s) + '%', c);
                var bar = document.getElementById('sig-soc-bar-' + wid);
                if (bar) { bar.style.width = s + '%'; bar.style.background = c; bar.className = bc; }
            }));

            q(B._bind(data.attr('oid_soh'), bound, function (v) {
                B._setText('sig-soh-' + wid, 'SOH: ' + B._fmtPct(v));
            }));

            q(B._bind(data.attr('oid_bat'), bound, function (v) {
                B._setTextColor('sig-bat-pow-' + wid, batPowText(v), batPowColor(v));
            }));

            q(B._bind(data.attr('oid_ttf'),  bound, function (v) { B._setText('sig-bat-ttf-'  + wid, B._fmtMin(v)); }));
            q(B._bind(data.attr('oid_ttr'),  bound, function (v) { B._setText('sig-bat-ttr-'  + wid, B._fmtMin(v)); }));
            q(B._bind(data.attr('oid_sc'),   bound, function (v) { B._setText('sig-bat-sc-'   + wid, B._fmtPct(v)); }));
            q(B._bind(data.attr('oid_aut'),  bound, function (v) { B._setText('sig-bat-aut-'  + wid, B._fmtPct(v)); }));

            B._applyBindings(wid, bound, def);
        });
    },


    /* ============================================================
       WIDGET 3 — ECHTZEIT-LEISTUNG
       Aufbau: Titelzeile mit Live-Punkt + 5 Zeilen (PV, Bat,
               Grid, Haus, SOC) mit farbigen Dots und Werten
       ============================================================ */
    createPowerOverview: function (widgetID, view, data, style) {
        var B   = vis.binds['vis-2-widgets-sigenergy'];
        var wid = widgetID;

        B._whenReady(wid, function ($div) {
            var dark  = data.attr('sig_darkmode') === 'true';
            var title = data.attr('sig_title') || 'Live Leistung';

            /* --- Aktuelle Werte --- */
            var pvW   = B._getVal(data, 'oid_pv');
            var batW  = B._getVal(data, 'oid_bat');
            var gridW = B._getVal(data, 'oid_grid');
            var housW = B._getVal(data, 'oid_house');
            var socV  = B._getVal(data, 'oid_soc');

            var wrap  = dark ? 'sig-pow-wrap' : 'sig-pow-wrap sig-pow-light';

            /* Netz-CSS-Klasse abhaengig von Bezug/Einspeisung */
            function gridValClass(v) {
                var gw = parseFloat(v) || 0;
                return 'sig-pow-val' + (gw > 0.05 ? ' sig-pow-buy' : gw < -0.05 ? ' sig-pow-sell' : '');
            }

            /* Zeilendaten */
            var rows = [
                { id: 'sig-pow-pv-'   + wid, dot: '#f39c12', icon: '&#9728;',  label: 'Solar PV',  val: B._fmtKW(pvW),   cls: 'sig-pow-val', color: '#f39c12' },
                { id: 'sig-pow-bat-'  + wid, dot: '#9b59b6', icon: '&#128267;',label: 'Batterie',   val: B._fmtKW(batW),  cls: 'sig-pow-val', color: ''        },
                { id: 'sig-pow-grid-' + wid, dot: '#3498db', icon: '&#128268;', label: 'Netz',      val: B._fmtKW(gridW), cls: gridValClass(gridW), color: '' },
                { id: 'sig-pow-hous-' + wid, dot: '#27ae60', icon: '&#127968;', label: 'Haus',      val: B._fmtKW(housW), cls: 'sig-pow-val', color: '#27ae60' },
                { id: 'sig-pow-soc-'  + wid, dot: '#8e44ad', icon: '&#128267;', label: 'Akku SOC',  val: B._fmtPct(socV), cls: 'sig-pow-val', color: ''        },
            ];

            /* --- HTML --- */
            var html = '<div class="' + wrap + '">';

            /* Titelzeile */
            html += '<div class="sig-pow-title">'
                  +   '<div class="sig-pow-live-dot"></div>'
                  +   title
                  + '</div>';

            /* Zeilen */
            for (var i = 0; i < rows.length; i++) {
                var r   = rows[i];
                var sep = i < rows.length - 1 ? ' sig-pow-row-sep' : '';
                html += '<div class="sig-pow-row' + sep + '">'
                      +   '<div class="sig-pow-left">'
                      +     '<div class="sig-pow-dot" style="background:' + r.dot + '"></div>'
                      +     r.icon + ' ' + r.label
                      +   '</div>'
                      +   '<div id="' + r.id + '" class="' + r.cls + '"'
                      +     (r.color ? ' style="color:' + r.color + '"' : '') + '>'
                      +     r.val
                      +   '</div>'
                      + '</div>';
            }

            html += '</div>'; /* /sig-pow-wrap */

            $div.html(html);

            /* --- Live-Bindings --- */
            var bound = [], def = [];
            function q(d) { if (d) def.push(d); }

            q(B._bind(data.attr('oid_pv'),    bound, function (v) { B._setText('sig-pow-pv-'   + wid, B._fmtKW(v)); }));
            q(B._bind(data.attr('oid_bat'),   bound, function (v) { B._setText('sig-pow-bat-'  + wid, B._fmtKW(v)); }));

            q(B._bind(data.attr('oid_grid'),  bound, function (v) {
                var el = document.getElementById('sig-pow-grid-' + wid);
                if (el) {
                    el.textContent = B._fmtKW(v);
                    el.className   = gridValClass(v);
                }
            }));

            q(B._bind(data.attr('oid_house'), bound, function (v) { B._setText('sig-pow-hous-' + wid, B._fmtKW(v)); }));
            q(B._bind(data.attr('oid_soc'),   bound, function (v) { B._setText('sig-pow-soc-'  + wid, B._fmtPct(v)); }));

            B._applyBindings(wid, bound, def);
        });
    },


    /* ============================================================
       WIDGET 4 — ENERGIESTATISTIKEN
       Aufbau: Titelzeile + 8 Kacheln als 2x4 Grid
       ============================================================ */
    createStatistics: function (widgetID, view, data, style) {
        var B   = vis.binds['vis-2-widgets-sigenergy'];
        var wid = widgetID;

        B._whenReady(wid, function ($div) {
            var dark  = data.attr('sig_darkmode') === 'true';
            var title = data.attr('sig_title') || 'Tagesstatistik';

            var wrap = dark ? 'sig-stats-wrap sig-stats-dark' : 'sig-stats-wrap';

            /* Kacheldaten (id, icon, label, formatierten Wert, Farbe) */
            var tiles = [
                { id: 'sig-st-aut-'    + wid, icon: '&#127969;', label: 'Autarkierate',    val: B._fmtPct(B._getVal(data,'oid_aut')),     color: '#27ae60' },
                { id: 'sig-st-sc-'     + wid, icon: '&#8635;',   label: 'Eigenverbrauch',  val: B._fmtPct(B._getVal(data,'oid_sc')),      color: '#9b59b6' },
                { id: 'sig-st-maxsoc-' + wid, icon: '&#8593;',   label: 'Max SOC heute',   val: B._fmtPct(B._getVal(data,'oid_maxsoc')),  color: '#f39c12' },
                { id: 'sig-st-minsoc-' + wid, icon: '&#8595;',   label: 'Min SOC heute',   val: B._fmtPct(B._getVal(data,'oid_minsoc')),  color: '#3498db' },
                { id: 'sig-st-chg-'    + wid, icon: '&#11014;',  label: 'Tages-Ladung',    val: B._fmtKWh(B._getVal(data,'oid_charg')),   color: '#16a085' },
                { id: 'sig-st-dchg-'   + wid, icon: '&#11015;',  label: 'Tages-Entladung', val: B._fmtKWh(B._getVal(data,'oid_discharg')),color: '#e74c3c' },
                { id: 'sig-st-cov-'    + wid, icon: '&#8987;',   label: 'Batteriedeckung', val: B._fmtMin(B._getVal(data,'oid_covtime')), color: '#8e44ad' },
                { id: 'sig-st-cht-'    + wid, icon: '&#9889;',   label: 'Ladezeit heute',  val: B._fmtMin(B._getVal(data,'oid_chargt')),  color: '#c0392b' },
            ];

            /* --- HTML --- */
            var html = '<div class="' + wrap + '">';

            /* Titel */
            html += '<div class="sig-stats-title">&#128202; ' + title + '</div>';

            /* Kachelraster */
            html += '<div class="sig-stats-grid">';
            for (var i = 0; i < tiles.length; i++) {
                var t = tiles[i];
                html += '<div class="sig-stats-tile">'
                      +   '<div class="sig-stats-tile-label">' + t.icon + ' ' + t.label + '</div>'
                      +   '<div id="' + t.id + '" class="sig-stats-tile-val" style="color:' + t.color + '">'
                      +     t.val
                      +   '</div>'
                      + '</div>';
            }
            html += '</div>'; /* /sig-stats-grid */
            html += '</div>'; /* /sig-stats-wrap */

            $div.html(html);

            /* --- Live-Bindings --- */
            var bound = [], def = [];
            function q(d) { if (d) def.push(d); }

            q(B._bind(data.attr('oid_aut'),      bound, function (v) { B._setText('sig-st-aut-'    + wid, B._fmtPct(v)); }));
            q(B._bind(data.attr('oid_sc'),       bound, function (v) { B._setText('sig-st-sc-'     + wid, B._fmtPct(v)); }));
            q(B._bind(data.attr('oid_maxsoc'),   bound, function (v) { B._setText('sig-st-maxsoc-' + wid, B._fmtPct(v)); }));
            q(B._bind(data.attr('oid_minsoc'),   bound, function (v) { B._setText('sig-st-minsoc-' + wid, B._fmtPct(v)); }));
            q(B._bind(data.attr('oid_charg'),    bound, function (v) { B._setText('sig-st-chg-'    + wid, B._fmtKWh(v)); }));
            q(B._bind(data.attr('oid_discharg'), bound, function (v) { B._setText('sig-st-dchg-'   + wid, B._fmtKWh(v)); }));
            q(B._bind(data.attr('oid_covtime'),  bound, function (v) { B._setText('sig-st-cov-'    + wid, B._fmtMin(v)); }));
            q(B._bind(data.attr('oid_chargt'),   bound, function (v) { B._setText('sig-st-cht-'    + wid, B._fmtMin(v)); }));

            B._applyBindings(wid, bound, def);
        });
    },

};

vis.binds['vis-2-widgets-sigenergy'].showVersion();
