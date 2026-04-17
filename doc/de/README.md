![Logo](../../admin/vis-2-widgets-sigenergy.png)
# ioBroker.vis-2-widgets-sigenergy

[![NPM-Version](https://img.shields.io/npm/v/iobroker.vis-2-widgets-sigenergy.svg)](https://www.npmjs.com/package/iobroker.vis-2-widgets-sigenergy)
[![Downloads](https://img.shields.io/npm/dm/iobroker.vis-2-widgets-sigenergy.svg)](https://www.npmjs.com/package/iobroker.vis-2-widgets-sigenergy)
![Anzahl Installationen](https://iobroker.live/badges/vis-2-widgets-sigenergy-installed.svg)
![Aktuelle Version im Stable-Repository](https://iobroker.live/badges/vis-2-widgets-sigenergy-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.vis-2-widgets-sigenergy.png?downloads=true)](https://nodei.co/npm/iobroker.vis-2-widgets-sigenergy/)

**Tests:** ![Test und Release](https://github.com/ssbingo/ioBroker.vis-2-widgets-sigenergy/workflows/Test%20and%20Release/badge.svg)

## vis-2-widgets-sigenergy Adapter für ioBroker

VIS-2 Widget-Set für den Sigenergy-Energiespeicher-Adapter (`ioBroker.sigenergy`).
Enthält 8 Widgets zur Visualisierung und Steuerung von Energiefluss, Batteriestatus, Echtzeit-Leistung, Tagesstatistiken, AC-Lader, DC-Lader, Inverter und SigenMicro Mikro-Wechselrichter-Übersicht.

## Voraussetzungen

- ioBroker mit installiertem und konfiguriertem `sigenergy`-Adapter
- ioBroker VIS-2 Adapter (≥ 2.0.0)

## Widgets

### Energiefluss-Diagramm
Zeigt den aktuellen Energiefluss zwischen Solar, Batterie, Netz und Haus als animiertes SVG-Diagramm.
Fließende Pfeile visualisieren aktive Verbindungen in Echtzeit.

**OIDs:** `pvPower`, `essPower`, `gridActivePower`, `housePower`, `essSoc`

![Energiefluss-Diagramm](../../img/widget-energiefluss.png)

#### Flussrichtungen

| Datenpunkt | Wert > 0 | Wert < 0 |
|---|---|---|
| `essPower` | Batterie wird geladen → Pfeil von Mitte zur Batterie | Batterie entlädt → Pfeil von Batterie zur Mitte |
| `gridActivePower` | Netzbezug → Pfeil vom Netz zur Mitte | Einspeisung → Pfeil von Mitte zum Netz |
| `pvPower` | PV erzeugt → Pfeil von PV zur Mitte | — |
| `housePower` | Haus verbraucht → Pfeil von Mitte zum Haus | — |

### Akku-Status & Prognosen
Zeigt SOC, SOH, Ladeleistung sowie Prognosen für Ladezeit, Restlaufzeit, Eigenverbrauch und Autarkierate.

**OIDs:** `essSoc`, `essSoh`, `essPower`, `batteryTimeToFull`, `batteryTimeRemaining`, `selfConsumptionRate`, `autarkyRate`

![Akku-Status & Prognosen](../../img/widget-batterie.png)

### Echtzeit-Leistung
Kompakte Listenansicht aller aktuellen Leistungswerte mit farbkodierter Richtungsanzeige.

**OIDs:** `pvPower`, `essPower`, `gridActivePower`, `housePower`, `essSoc`

![Echtzeit-Leistung](../../img/widget-leistung.png)

### Energiestatistiken
Tagesübersicht mit Autarkierate, Eigenverbrauch, SOC-Verlauf, Lade-/Entladeenergie und Batteriedeckung.

**OIDs:** `autarkyRate`, `selfConsumptionRate`, `dayMaxSoc`, `dayMinSoc`, `essDailyChargeEnergy`, `essDailyDischargeEnergy`, `batteryCoverageToday`, `batteryDailyChargeTime`

![Energiestatistiken](../../img/widget-statistiken.png)

### AC-Lader (Sigen EVAC)
Überwachung und Steuerung des Sigenergy AC-Laders (EVAC). Zeigt Ladeleistung, Systemzustand, Nennleistung, Nennstrom und Gesamtenergieverbrauch. Alarme werden farblich hervorgehoben. Der Ladestrom lässt sich per Schieberegler (6–32 A) direkt einstellen.

**OIDs:** `acCharger.systemState`, `acCharger.chargingPower`, `acCharger.totalEnergyConsumed`, `acCharger.ratedPower`, `acCharger.ratedCurrent`, `acCharger.alarm1/2/3`, `acCharger.control.startStop`, `acCharger.control.outputCurrent`

![AC-Lader](../../img/widget-ac-charger.png)

### DC-Lader
Überwachung und Steuerung des Sigenergy DC-Laders. Zeigt Ausgangsleistung, Fahrzeug-SOC mit Fortschrittsbalken, Fahrzeugspannung, Ladestrom sowie Energie und Dauer der aktuellen Ladesitzung.

**OIDs:** `dcCharger.outputPower`, `dcCharger.vehicleSoc`, `dcCharger.vehicleBatteryVoltage`, `dcCharger.chargingCurrent`, `dcCharger.currentChargingCapacity`, `dcCharger.currentChargingDuration`, `dcCharger.control.startStop`

![DC-Lader](../../img/widget-dc-charger.png)

### Inverter
Umfassende Überwachung und Steuerung des Wechselrichters mit Tab-Navigation. Zeigt Betriebszustand, Leistungsdaten, Batterietemperaturen, Phasenspannungen, alle 5 Alarm-Register sowie Geräteinformationen (Modell, Seriennummer, Firmware).

| Tab | Inhalt |
|---|---|
| **Leistung** | Wirkleistung, PV-Leistung, Batterie-Lade/-Entladeleistung, Leistungsanteil-Slider (−100 % bis +100 %) |
| **Batterie** | SOC & SOH mit Balken, Ø Zelltemperatur, Ø Zellspannung, Max/Min Temperatur |
| **Netz** | Phasenspannungen L1/L2/L3, Netzfrequenz, Leistungsfaktor, PCS-Innentemperatur |
| **Alarme** | 5 Alarm-Register (PCS ×2, ESS, Gateway, DC-Lader) mit Hex-Code und Farbmarkierung |
| **Info** | Modelltyp, Seriennummer, Firmware-Version, Remote-EMS-Toggle |

![Inverter](../../img/widget-inverter.png)

**OIDs:** `inverter.activePower`, `inverter.pvPower`, `inverter.essChargeDischargePower`, `inverter.runningState`, `inverter.essBatterySoc/Soh`, `inverter.essAvgCellTemperature/Voltage`, `inverter.phaseA/B/CVoltage`, `inverter.gridFrequency`, `inverter.pcsInternalTemp`, `inverter.alarm1–5`, `inverter.firmwareVersion`, `inverter.modelType`, `inverter.serialNumber`, `inverter.control.startStop`, `inverter.control.remoteEmsDispatchEnable`, `inverter.control.activePowerPercent`

### PV Power
Darstellung von bis zu 3 PV-Strings mit Live-Leistungswerten und animierten Fluss-Pfeilen zum Hybrid-Wechselrichter. Pfeilfarben ändern sich dynamisch je nach Leistung (orange <1 kW, gelb <2 kW, grün >2 kW).

#### Widget-Einstellungen
| Parameter | Typ | Standard | Beschreibung |
|---|---|---|---|
| oid_pv1 … oid_pv3 | OID | sigenergy.0.plant.pv1Power … pv3Power | PV-String-Leistungs-OIDs |
| oid_pvtotal | OID | sigenergy.0.plant.pvPower | Gesamt-PV-Leistung OID |
| sig_title | Text | PV Power | Widget-Titel |
| sig_name1 … sig_name3 | Text | String 1 … String 3 | Frei wählbare Namen je String |
| sig_darkmode | Checkbox | true | Dunkel- / Hellmodus |

![PV Power](../../img/PV-PowerOverview.png)

**OIDs:** `plant.pv1Power`, `plant.pv2Power`, `plant.pv3Power`, `plant.pvPower`

### SigenMicro Übersicht
Übersicht und Detailansicht aller SigenMicro Mikro-Wechselrichter am Modbus-Bus. Tab 1 zeigt alle Geräte als animiertes Netzwerksegment (Ethernet-Bus-Topologie mit senkrechten Stichleitungen). Jeder weitere Tab zeigt alle 15 Register des jeweiligen Geräts in aufsteigender Reihenfolge.

| Tab | Inhalt |
|---|---|
| **Übersicht** | Alle Geräte als animierte Bus-Topologie, Aggregat-Kacheln (Gesamtleistung, Tagesertrag, Lebensertrag, Online-Anzahl) |
| **Gerät 01–20** | Gerätebild oben-links (10 px Abstand), Modell/Seriennummer/Firmware/Status-Badge, alle 15 Register (01–15) mit Wert, Einheit und OID-Pfad |

#### Netzwerksegment-Animation
Die waagerechte Backbone-Linie und die senkrechten Stichleitungen zeigen animierte Dashes, die bei aktiven Geräten (Running) entlang der Leitungen fließen. Inaktive Geräte (Standby/Fault) zeigen nur die dunkle Basislinie ohne Animation.

#### Dynamisches Layout
| Geräte | Zeilen | Bildgröße |
|---|---|---|
| 1–5 | 1 Zeile | 80 × 90 px |
| 6–10 | 1 Zeile | 52 × 60 px |
| 11–15 | 2 Zeilen | 46 × 52 px |
| 16–20 | 2 Zeilen | 40 × 46 px |

#### Widget-Einstellungen
| Parameter | Typ | Standard | Beschreibung |
|---|---|---|---|
| micro_count | Zahl (1–20) | 3 | Anzahl der anzuzeigenden Mikro-Wechselrichter |
| sig_title | Text | SigenMicro Micro-Inverter | Widget-Titel |
| sig_darkmode | Checkbox | true | Dunkel- / Hellmodus |
| oid_micro1 … oid_micro20 | OID | — | Anker-OID je Gerät (z.B. sigenergy.0.sigenmicro.11.outputPower) |

![SigenMicro Übersicht — Übersichts-Tab](../../img/widget-microinverter_01.png)

![SigenMicro Übersicht — Detail-Tab](../../img/widget-microinverter_02.png)

**OIDs (je Gerät, Präfix sigenergy.0.sigenmicro.<slaveId>):**
modelType, serialNumber, firmwareVersion, runningState, outputPower, gridFrequency, temperature, mppt1Voltage, mppt1Current, mppt1Power, mppt2Voltage, mppt2Current, mppt2Power, dailyYield, totalYield

## Darstellung

Alle Widgets unterstützen einen **Hell- und Dunkelmodus**, der über die Widget-Einstellung `Dunkelmodus` umgeschaltet werden kann.

## Changelog
### 1.7.2 (2026-04-17)
* (ssbingo) Nur Dokumentation: uk- und zh-cn-README-Übersetzungen ergänzt

### 1.7.1 (2026-04-17)
* (ssbingo) Fehlende uk- und zh-cn-Übersetzungen in common.news ergänzt

### 1.7.0 (2026-04-17)
* (ssbingo) Widget 9: PV Power hinzugefügt mit 3 PV-String-Anzeige und animierten Fluss-Pfeilen

### 1.6.7 (2026-04-09)
* (ssbingo) Dependabot.yml Cooldown-Syntax korrigiert (default-days statt default)

### 1.6.6 (2026-04-09)
* (ssbingo) Alte Changelog-Einträge in CHANGELOG_OLD.md verschoben; Dependabot-Cooldown (7 Tage) hinzugefügt

### 1.6.5 (2026-04-09)
* (ssbingo) adapter-tests-Job aus Workflow entfernt (nicht anwendbar für VIS-Widget-Adapter); deploy verwendet jetzt Node.js 24

### 1.6.4 (2026-03-26)
* (ssbingo) test:integration als No-op wiederhergestellt (von testing-action-adapter benötigt; kein Node.js-Prozess im mode:none Widget-Adapter)

### 1.6.3 (2026-03-26)
* (ssbingo) Alle Sprach-READMEs mit fehlenden Changelog-Einträgen synchronisiert (1.5.10–1.6.2)

### 1.6.2 (2026-03-26)
* (ssbingo) Integrationstest entfernt — nicht anwendbar für mode:none Widget-Adapter (kein Node.js-Hauptprozess)

### 1.6.1 (2026-03-26)
* (ssbingo) ESLint/Prettier-Setup entfernt — kein Node.js-Quellcode in einem reinen Widget-Adapter; lint-Schritt aus Workflow entfernt

### 1.6.0 (2026-03-26)
* (ssbingo) Tests abgeschlossen

### 1.5.11 (2026-03-26)
* (ssbingo) Workflow: install-command auf npm install gesetzt (Lock-File muss nach Hinzufügen von @iobroker/eslint-config neu generiert werden)

### 1.5.10 (2026-03-26)
* (ssbingo) README.md: LICENSE-Abschnitt ans Ende verschoben (nach CHANGELOG), vollständiger MIT-Lizenztext

### 1.5.8 (2026-03-18)
* (ssbingo) fixed GitHub-Actions (PR)

### 1.5.7 (2026-03-18)
* (ssbingo) Abschnitt '## Installation' aus allen README-Dateien entfernt (S6014)

### 1.5.6 (2026-03-18)
* (ssbingo) Versionserhöhung auf 1.5.6; keine funktionalen Änderungen

### 1.5.5 (2026-03-18)
* (ssbingo) Versionserhöhung: 1.5.4 war bereits auf npm veröffentlicht; keine funktionalen Änderungen

### 1.5.4 (2026-03-18)
* (ssbingo) npm-token zum test-and-release Workflow hinzugefügt für automatische npm-Veröffentlichung

### 1.5.3 (2026-03-17)
* (ssbingo) Beispiel-Installationsschritte aus allen README-Dateien entfernt
* (ssbingo) E1111 behoben: native-Beispielkonfiguration (option1/option2) aus io-package.json entfernt

### 1.5.2 (2026-03-17)
* (ssbingo) Widget-Screenshots ergänzt: SigenMicro Übersicht (widget-microinverter_01.png, widget-microinverter_02.png)
* (ssbingo) Energiefluss-Screenshot aktualisiert (widget-energiefluss.png)

### 1.5.1 (2026-03-17)
* (ssbingo) Bugfix: Widget 8 code placed correctly inside vis.binds object — all widgets visible again

### 1.5.0 (2026-03-17)
* (ssbingo) Widget 8: SigenMicro Übersicht mit animierter Ethernet-Bus-Topologie (Backbone + senkrechte Stichleitungen)
* (ssbingo) Dynamisches Layout für 1–20 Mikro-Wechselrichter, 4 Größenstufen, 1–2 Zeilen
* (ssbingo) Detail-Tab je Gerät mit allen 15 Modbus-Registern (01–15, aufsteigend nach Adresse)
* (ssbingo) VIS-2-konformes Anker-OID-Muster: oid_micro(1-micro_count)/id
* (ssbingo) SigenMicroInverter.png in Widget-Bildordner aufgenommen

### 1.4.4 (2026-03-12)
* Energiefluss-Widget: SOC-Beschriftung und Wert um 5px nach oben verschoben

### 1.3.2 (2026-03-12)
* Dokumentation in README.md eingefügt - mehrsprachig (RU, NL, FR)

### 1.3.1 (2026-03-12)
* Deutsche README unter doc/de/README.md ergänzt
* README: Dokumentations-Sektion mit Sprachlinks ergänzt

### 1.3.0 (2026-03-12)
* Energiefluss-Widget: Netz-Animation auf zwei separate Pfade umgestellt (Netzbezug/Einspeisung)
* Energiefluss-Widget: auto-start-reverse vollständig entfernt – alle Richtungen über separate Pfade

### 1.2.9 (2026-03-12)
* Energiefluss-Widget: Batterie-Pfad Ankerpunkt y=75 → y=71

### 1.2.8 (2026-03-12)
* Energiefluss-Widget: Batterie-Pfeil beim Laden unterhalb der Ziffern positioniert
* Energiefluss-Widget: Schriftgröße der Wertangaben von 10.5 auf 12.5 erhöht

### 1.2.7 (2026-03-12)
* Energiefluss-Widget: Batterie-Richtung komplett neu – zwei separate Pfade (Laden/Entladen) ersetzen fehlerhaftes auto-start-reverse

### 1.2.6 (2026-03-12)
* Energiefluss-Widget: Netz-Animation und Pfeil umgekehrt
* Energiefluss-Widget: Batterie-Animation und Pfeil umgekehrt

### 1.2.5 (2026-03-12)
* Energiefluss-Widget: Batterie-Pfeilrichtung invertiert

### 1.2.4 (2026-03-11)
* `common.mode` auf `none` geändert

### 1.2.3 (2026-03-11)
* `common.mode` auf `once` geändert

### 1.2.2 (2026-03-11)
* Korrekturen

### 1.2.1 (2026-03-11)
* Korrektur README.md

### 1.2.0 (2026-03-11)
* README: Widget-Screenshots für alle 7 Widgets ergänzt
* `img/` Ordner mit Screenshots in `package.json` files aufgenommen

### 1.1.9 (2026-03-11)
* Energiefluss-Widget: Batterie-Pfeilkopf korrigiert — Laden zeigt zur Batterie, Entladen zur Mitte

### 1.1.8 (2026-03-11)
* Energiefluss-Widget: Batterie-Pfeilrichtung korrigiert (Laden vs. Entladen war vertauscht)

### 1.1.7 (2026-03-10)
* W1084 behoben: veraltetes `common.title` entfernt

### 1.1.6 (2026-03-10)
* `title`: „SigenEnergy Widgets" in io-package.json ergänzt

### 1.1.5 (2026-03-10)
* `vis` zu `restartAdapters` in io-package.json ergänzt

### 1.1.4 (2026-03-10)
* W1068 behoben: `ioBroker` aus keywords entfernt

### 1.1.3 (2026-03-10)
* Keyword `ioBroker` in io-package.json ergänzt

### 1.1.2 (2026-03-10)
* `admin/` in package.json `files`-Feld ergänzt — Icon-PNG wird jetzt korrekt mit installiert

### 1.1.1 (2026-03-10)
* E1012 behoben: `icon` = Dateiname, `extIcon` = identische GitHub-Raw-URL

### 1.1.0 (2026-03-10)
* Icon als Base64-Data-URI in io-package.json eingebettet

### 1.0.9 (2026-03-10)
* Icon-Auflösung auf 512×512 px korrigiert

### 1.0.8 (2026-03-10)
* `extIcon` auf GitHub-Raw-URL korrigiert (E1012)

### 1.0.7 (2026-03-10)
* Icon-Einbindung korrigiert

### 1.0.6 (2026-03-10)
* Sigenergy-Logo als Adapter-Icon hinterlegt

### 1.0.5 (2026-03-09)
* Korrekturen
### 1.0.4 (2026-03-09)
* Korrekturen
### 1.0.3 (2026-03-09)
* Korrekturen
### 1.0.2 (2026-03-09)
* Korrekturen
### 1.0.1 (2026-03-09)
* (ssbingo) 4 Widgets neu erstellt im VIS-2-konformen Format
* (ssbingo) Energiefluss-Diagramm mit SVG-Animationen
* (ssbingo) Akku-Status & Prognosen Widget
* (ssbingo) Echtzeit-Leistung Widget
* (ssbingo) Energiestatistiken Widget

## Lizenz
MIT License

Copyright (c) 2026 ssbingo <s.sternitzke@online.de>

Hiermit wird unentgeltlich jeder Person, die eine Kopie der Software und der zugehörigen
Dokumentationen (die „Software") erhält, die Erlaubnis erteilt, sie uneingeschränkt zu nutzen,
inklusive und ohne Ausnahme mit dem Recht, sie zu verwenden, zu kopieren, zu verändern,
zusammenzuführen, zu veröffentlichen, zu verbreiten, zu unterlizenzieren und/oder zu verkaufen,
und Personen, denen diese Software überlassen wird, diese Rechte zu verschaffen, unter den
folgenden Bedingungen:

Der obige Urheberrechtsvermerk und dieser Erlaubnisvermerk sind in allen Kopien oder
wesentlichen Teilen der Software beizulegen.

DIE SOFTWARE WIRD OHNE JEDE AUSDRÜCKLICHE ODER IMPLIZIERTE GARANTIE BEREITGESTELLT,
EINSCHLIEẞLICH DER GARANTIE ZUR BENUTZBARKEIT, EIGNUNG FÜR EINEN BESTIMMTEN ZWECK UND
NICHTVERLETZUNG. IN KEINEM FALL SIND DIE AUTOREN ODER COPYRIGHTINHABER FÜR EINEN SCHADEN
ODER SONSTIGE ANSPRÜCHE HAFTBAR ZU MACHEN, OB INFOLGE DER ERFÜLLUNG EINES VERTRAGES,
EINES DELIKTES ODER ANDERS IM ZUSAMMENHANG MIT DER SOFTWARE ODER SONSTIGER VERWENDUNG
DER SOFTWARE ENTSTANDEN.

## Dokumentation

- 🇩🇪 [Deutsch](../../doc/de/README.md) — diese Datei
- 🇬🇧 [English](../../README.md)
- 🇷🇺 [Русский](../../doc/ru/README.md)
- 🇳🇱 [Nederlands](../../doc/nl/README.md)
- 🇫🇷 [Français](../../doc/fr/README.md)
- 🇮🇹 [Italiano](../../doc/it/README.md)
- 🇪🇸 [Español](../../doc/es/README.md)
- 🇵🇱 [Polski](../../doc/pl/README.md)
- 🇵🇹 [Português](../../doc/pt/README.md)
