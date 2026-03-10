![Logo](admin/vis-2-widgets-sigenergy.png)
# ioBroker.vis-2-widgets-sigenergy

[![NPM version](https://img.shields.io/npm/v/iobroker.vis-2-widgets-sigenergy.svg)](https://www.npmjs.com/package/iobroker.vis-2-widgets-sigenergy)
[![Downloads](https://img.shields.io/npm/dm/iobroker.vis-2-widgets-sigenergy.svg)](https://www.npmjs.com/package/iobroker.vis-2-widgets-sigenergy)
![Number of Installations](https://iobroker.live/badges/vis-2-widgets-sigenergy-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/vis-2-widgets-sigenergy-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.vis-2-widgets-sigenergy.png?downloads=true)](https://nodei.co/npm/iobroker.vis-2-widgets-sigenergy/)

**Tests:** ![Test and Release](https://github.com/ssbingo/ioBroker.vis-2-widgets-sigenergy/workflows/Test%20and%20Release/badge.svg)

## vis-2-widgets-sigenergy adapter for ioBroker

VIS-2 Widget-Set für den Sigenergy-Energiespeicher-Adapter (`ioBroker.sigenergy`).
Enthält 7 Widgets zur Visualisierung und Steuerung von Energiefluss, Batteriestatus, Echtzeit-Leistung, Tagesstatistiken, AC-Lader, DC-Lader und Inverter.

## Voraussetzungen

- ioBroker mit installiertem und konfiguriertem `sigenergy`-Adapter
- ioBroker VIS-2 Adapter (≥ 2.0.0)

## Installation

Den Adapter über den ioBroker Admin als ZIP-Datei installieren:

1. Admin → Adapter → „Von eigener URL installieren" (GitHub-Icon)
2. ZIP-Datei hochladen oder URL angeben
3. Installation abwarten — VIS-2 wird automatisch neu gestartet

> **Hinweis:** Nach der Installation ist ein **Reload des VIS-2 Editors im Browser** erforderlich
> (F5 bzw. Seite neu laden), damit die Widgets in der Palette erscheinen.
> Der Neustart des VIS-2 Adapters erfolgt automatisch, der Browser muss jedoch
> manuell aktualisiert werden.

## Widgets

### Energiefluss-Diagramm
Zeigt den aktuellen Energiefluss zwischen Solar, Batterie, Netz und Haus als animiertes SVG-Diagramm.
Fließende Pfeile visualisieren aktive Verbindungen in Echtzeit.

**OIDs:** `pvPower`, `essPower`, `gridActivePower`, `housePower`, `essSoc`

### Akku-Status & Prognosen
Zeigt SOC, SOH, Ladeleistung sowie Prognosen für Ladezeit, Restlaufzeit, Eigenverbrauch und Autarkierate.

**OIDs:** `essSoc`, `essSoh`, `essPower`, `batteryTimeToFull`, `batteryTimeRemaining`, `selfConsumptionRate`, `autarkyRate`

### Echtzeit-Leistung
Kompakte Listenansicht aller aktuellen Leistungswerte mit farbkodierter Richtungsanzeige.

**OIDs:** `pvPower`, `essPower`, `gridActivePower`, `housePower`, `essSoc`

### Energiestatistiken
Tagesübersicht mit Autarkierate, Eigenverbrauch, SOC-Verlauf, Lade-/Entladeenergie und Batteriedeckung.

**OIDs:** `autarkyRate`, `selfConsumptionRate`, `dayMaxSoc`, `dayMinSoc`, `essDailyChargeEnergy`, `essDailyDischargeEnergy`, `batteryCoverageToday`, `batteryDailyChargeTime`

### AC-Lader (Sigen EVAC)
Überwachung und Steuerung des Sigenergy AC-Laders (EVAC). Zeigt Ladeleistung, Systemzustand, Nennleistung, Nennstrom und Gesamtenergieverbrauch. Alarme werden farblich hervorgehoben. Der Ladestrom lässt sich per Schieberegler (6–32 A) direkt einstellen.

**OIDs:** `acCharger.systemState`, `acCharger.chargingPower`, `acCharger.totalEnergyConsumed`, `acCharger.ratedPower`, `acCharger.ratedCurrent`, `acCharger.alarm1/2/3`, `acCharger.control.startStop`, `acCharger.control.outputCurrent`

### DC-Lader
Überwachung und Steuerung des Sigenergy DC-Laders. Zeigt Ausgangsleistung, Fahrzeug-SOC mit Fortschrittsbalken, Fahrzeugspannung, Ladestrom sowie Energie und Dauer der aktuellen Ladesitzung.

**OIDs:** `dcCharger.outputPower`, `dcCharger.vehicleSoc`, `dcCharger.vehicleBatteryVoltage`, `dcCharger.chargingCurrent`, `dcCharger.currentChargingCapacity`, `dcCharger.currentChargingDuration`, `dcCharger.control.startStop`

### Inverter
Umfassende Überwachung und Steuerung des Wechselrichters mit Tab-Navigation. Zeigt Betriebs­zustand, Leistungsdaten, Batterietemperaturen, Phasenspannungen, alle 5 Alarm-Register sowie Geräteinformationen (Modell, Seriennummer, Firmware).

| Tab | Inhalt |
|---|---|
| **Leistung** | Wirkleistung, PV-Leistung, Batterie-Lade/-Entladeleistung, Leistungsanteil-Slider (−100 % bis +100 %) |
| **Batterie** | SOC & SOH mit Balken, Ø Zelltemperatur, Ø Zellspannung, Max/Min Temperatur |
| **Netz** | Phasenspannungen L1/L2/L3, Netzfrequenz, Leistungsfaktor, PCS-Innentemperatur |
| **Alarme** | 5 Alarm-Register (PCS ×2, ESS, Gateway, DC-Lader) mit Hex-Code und Farbmarkierung |
| **Info** | Modelltyp, Seriennummer, Firmware-Version, Remote-EMS-Toggle |

**OIDs:** `inverter.activePower`, `inverter.pvPower`, `inverter.essChargeDischargePower`, `inverter.runningState`, `inverter.essBatterySoc/Soh`, `inverter.essAvgCellTemperature/Voltage`, `inverter.phaseA/B/CVoltage`, `inverter.gridFrequency`, `inverter.pcsInternalTemp`, `inverter.alarm1–5`, `inverter.firmwareVersion`, `inverter.modelType`, `inverter.serialNumber`, `inverter.control.startStop`, `inverter.control.remoteEmsDispatchEnable`, `inverter.control.activePowerPercent`

## Darstellung

Alle Widgets unterstützen einen **Hell- und Dunkelmodus**, der über die Widget-Einstellung `Dunkelmodus` umgeschaltet werden kann.


## Changelog
### 1.1.6 (2026-03-10)
* `title`: "SigenEnergy Widgets" in io-package.json ergänzt

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
* Icon als Base64-Data-URI in io-package.json eingebettet — unabhängig von Admin-Ordner-Serving

### 1.0.9 (2026-03-10)
* Icon-Auflösung auf 512×512 px korrigiert (war 64×64 px)

### 1.0.8 (2026-03-10)
* `extIcon` auf GitHub-Raw-URL korrigiert (E1012)

### 1.0.7 (2026-03-10)
* Icon-Einbindung korrigiert: `icon` als Dateiname, `extIcon` als Base64-URI

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

## License
MIT License

Copyright (c) 2026 ssbingo <s.sternitzke@online.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.