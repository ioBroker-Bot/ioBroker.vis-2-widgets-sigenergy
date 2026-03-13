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

## Darstellung

Alle Widgets unterstützen einen **Hell- und Dunkelmodus**, der über die Widget-Einstellung `Dunkelmodus` umgeschaltet werden kann.

## Changelog
### 1.3.6 (2026-03-12)
* Dokumentation in README.md eingefügt - mehrsprachig

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
