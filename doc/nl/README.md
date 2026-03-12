![Logo](../../admin/vis-2-widgets-sigenergy.png)
# ioBroker.vis-2-widgets-sigenergy

[![NPM-versie](https://img.shields.io/npm/v/iobroker.vis-2-widgets-sigenergy.svg)](https://www.npmjs.com/package/iobroker.vis-2-widgets-sigenergy)
[![Downloads](https://img.shields.io/npm/dm/iobroker.vis-2-widgets-sigenergy.svg)](https://www.npmjs.com/package/iobroker.vis-2-widgets-sigenergy)
![Aantal installaties](https://iobroker.live/badges/vis-2-widgets-sigenergy-installed.svg)
![Huidige versie in stabiele repository](https://iobroker.live/badges/vis-2-widgets-sigenergy-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.vis-2-widgets-sigenergy.png?downloads=true)](https://nodei.co/npm/iobroker.vis-2-widgets-sigenergy/)

**Tests:** ![Test en Release](https://github.com/ssbingo/ioBroker.vis-2-widgets-sigenergy/workflows/Test%20and%20Release/badge.svg)

## vis-2-widgets-sigenergy adapter voor ioBroker

VIS-2 widget-set voor de Sigenergy energieopslag-adapter (`ioBroker.sigenergy`).
Bevat 7 widgets voor visualisatie en bediening van energiestroom, batterijstatus, realtime vermogen, dagstatistieken, AC-lader, DC-lader en omvormer.

## Vereisten

- ioBroker met geïnstalleerde en geconfigureerde `sigenergy`-adapter
- ioBroker VIS-2 adapter (≥ 2.0.0)

## Installatie

De adapter via ioBroker Admin installeren als ZIP-bestand:

1. Admin → Adapters → „Installeren via eigen URL" (GitHub-icoon)
2. ZIP-bestand uploaden of URL opgeven
3. Wacht op voltooiing van de installatie — VIS-2 wordt automatisch opnieuw gestart

> **Opmerking:** Na de installatie is een **herlaad van de VIS-2 editor in de browser** vereist
> (F5 of pagina vernieuwen) zodat de widgets in de palette verschijnen.
> De VIS-2 adapter wordt automatisch opnieuw gestart, maar de browser moet
> handmatig worden vernieuwd.

## Widgets

### Energiestroom-diagram
Toont de huidige energiestroom tussen zonnepanelen, batterij, net en huis als geanimeerd SVG-diagram. Geanimeerde pijlen visualiseren actieve verbindingen in realtime.

**OID's:** `pvPower`, `essPower`, `gridActivePower`, `housePower`, `essSoc`

![Energiestroom-diagram](../../img/widget-energiefluss.png)

#### Stroomrichtingen

| Datapunt | Waarde > 0 | Waarde < 0 |
|---|---|---|
| `essPower` | Batterij wordt geladen → pijl van midden naar batterij | Batterij ontlaadt → pijl van batterij naar midden |
| `gridActivePower` | Netafname → pijl van net naar midden | Teruglevering → pijl van midden naar net |
| `pvPower` | PV produceert → pijl van PV naar midden | — |
| `housePower` | Huis verbruikt → pijl van midden naar huis | — |

### Batterijstatus & prognoses
Toont SOC, SOH, laadvermogen en prognoses voor laadtijd, resterende looptijd, eigenverbruik en zelfredzaamheidsgraad.

**OID's:** `essSoc`, `essSoh`, `essPower`, `batteryTimeToFull`, `batteryTimeRemaining`, `selfConsumptionRate`, `autarkyRate`

![Batterijstatus](../../img/widget-batterie.png)

### Realtime vermogen
Compacte lijstweergave van alle huidige vermogenswaarden met kleurgecodeerde richtingsindicatie.

**OID's:** `pvPower`, `essPower`, `gridActivePower`, `housePower`, `essSoc`

![Realtime vermogen](../../img/widget-leistung.png)

### Energiestatistieken
Dagoverzicht met zelfredzaamheidsgraad, eigenverbruik, SOC-verloop, laad-/ontlaadenergie en batterijdekking.

**OID's:** `autarkyRate`, `selfConsumptionRate`, `dayMaxSoc`, `dayMinSoc`, `essDailyChargeEnergy`, `essDailyDischargeEnergy`, `batteryCoverageToday`, `batteryDailyChargeTime`

![Energiestatistieken](../../img/widget-statistiken.png)

### AC-lader (Sigen EVAC)
Bewaking en bediening van de Sigenergy AC-lader (EVAC). Toont laadvermogen, systeemstatus, nominaal vermogen, nominale stroom en totaal energieverbruik. Alarmen worden met kleur gemarkeerd. De laadstroom is instelbaar via een schuifregelaar (6–32 A).

**OID's:** `acCharger.systemState`, `acCharger.chargingPower`, `acCharger.totalEnergyConsumed`, `acCharger.ratedPower`, `acCharger.ratedCurrent`, `acCharger.alarm1/2/3`, `acCharger.control.startStop`, `acCharger.control.outputCurrent`

![AC-lader](../../img/widget-ac-charger.png)

### DC-lader
Bewaking en bediening van de Sigenergy DC-lader. Toont uitgangsvermogen, voertuig-SOC met voortgangsbalk, voertuigbatterijspanning, laadstroom en energie en duur van de huidige laadsessie.

**OID's:** `dcCharger.outputPower`, `dcCharger.vehicleSoc`, `dcCharger.vehicleBatteryVoltage`, `dcCharger.chargingCurrent`, `dcCharger.currentChargingCapacity`, `dcCharger.currentChargingDuration`, `dcCharger.control.startStop`

![DC-lader](../../img/widget-dc-charger.png)

### Omvormer
Uitgebreide bewaking en bediening van de omvormer met tabnavigatie. Toont bedrijfsstatus, vermogensgegevens, batterijtemperaturen, fasenspanningen, alle 5 alarmregisters en apparaatinformatie (model, serienummer, firmware).

| Tab | Inhoud |
|---|---|
| **Vermogen** | Werkzaam vermogen, PV-vermogen, batterij laad-/ontlaadvermogen, vermogensaandeel-schuifregelaar (−100 % tot +100 %) |
| **Batterij** | SOC en SOH met balken, gem. celtemperatuur/-spanning, max./min. temperatuur |
| **Net** | Fasenspanningen L1/L2/L3, netfrequentie, vermogensfactor, PCS interne temperatuur |
| **Alarmen** | 5 alarmregisters (PCS ×2, ESS, gateway, DC-lader) met hex-code en kleurmarkering |
| **Info** | Modeltype, serienummer, firmwareversie, Remote-EMS-schakelaar |

![Omvormer](../../img/widget-inverter.png)

**OID's:** `inverter.activePower`, `inverter.pvPower`, `inverter.essChargeDischargePower`, `inverter.runningState`, `inverter.essBatterySoc/Soh`, `inverter.essAvgCellTemperature/Voltage`, `inverter.phaseA/B/CVoltage`, `inverter.gridFrequency`, `inverter.pcsInternalTemp`, `inverter.alarm1–5`, `inverter.firmwareVersion`, `inverter.modelType`, `inverter.serialNumber`, `inverter.control.startStop`, `inverter.control.remoteEmsDispatchEnable`, `inverter.control.activePowerPercent`

## Weergave

Alle widgets ondersteunen een **lichte en donkere modus**, die kan worden omgeschakeld via de widget-instelling `Donkere modus`.

## Changelog
### 1.3.3 (2026-03-12)
* Hoofd-README.md vertaald naar het Engels

### 1.3.2 (2026-03-12)
* Documentatie toegevoegd aan README.md — meertalig (RU, NL, FR)

### 1.3.1 (2026-03-12)
* Duitse documentatie toegevoegd in doc/de/README.md; README: documentatiesectie met taallinks toegevoegd

### 1.3.0 (2026-03-12)
* Energiestroom-widget: netanimatie omgezet naar twee afzonderlijke paden (afname/teruglevering)
* Energiestroom-widget: auto-start-reverse volledig verwijderd — alle richtingen via afzonderlijke paden

### 1.2.9 (2026-03-12)
* Energiestroom-widget: ankerpunt batterijpad y=75 → y=71

### 1.2.8 (2026-03-12)
* Energiestroom-widget: batterijpijl bij laden geplaatst onder de cijfers
* Energiestroom-widget: lettergrootte van waarden vergroot van 10.5 naar 12.5

### 1.2.7 (2026-03-12)
* Energiestroom-widget: batterijrichting volledig vernieuwd — twee afzonderlijke paden (laden/ontladen) vervangen foutieve auto-start-reverse

### 1.2.6 (2026-03-12)
* Energiestroom-widget: netanimatie en pijl omgekeerd
* Energiestroom-widget: batterijanimatie en pijl omgekeerd

### 1.2.5 (2026-03-12)
* Energiestroom-widget: richting van batterijpijl omgekeerd

### 1.2.4 (2026-03-11)
* `common.mode` gewijzigd naar `none`

### 1.2.3 (2026-03-11)
* `common.mode` gewijzigd naar `once`

### 1.2.2 (2026-03-11)
* Correcties

### 1.2.1 (2026-03-11)
* Correctie README.md

### 1.2.0 (2026-03-11)
* README: widget-schermafbeeldingen voor alle 7 widgets toegevoegd
* Map `img/` met schermafbeeldingen opgenomen in package.json files

### 1.1.9 (2026-03-11)
* Energiestroom-widget: batterijpijlpunt gecorrigeerd

### 1.1.8 (2026-03-11)
* Energiestroom-widget: richting batterijpijl gecorrigeerd

### 1.1.7 (2026-03-10)
* W1084 opgelost: verouderd `common.title` verwijderd

### 1.1.6 (2026-03-10)
* `title` toegevoegd in io-package.json

### 1.1.5 (2026-03-10)
* `vis` toegevoegd aan `restartAdapters` in io-package.json

### 1.1.4 (2026-03-10)
* W1068 opgelost: `ioBroker` uit keywords verwijderd

### 1.1.3 (2026-03-10)
* Keyword `ioBroker` toegevoegd in io-package.json

### 1.1.2 (2026-03-10)
* `admin/` toegevoegd aan `files`-veld in package.json — icoon-PNG wordt nu correct meegeïnstalleerd

### 1.1.1 (2026-03-10)
* E1012 opgelost: `icon` = bestandsnaam, `extIcon` = GitHub Raw URL

### 1.1.0 (2026-03-10)
* Icoon ingebed als Base64-Data-URI in io-package.json

### 1.0.9 (2026-03-10)
* Icoonresolutie gecorrigeerd naar 512×512 pixels

### 1.0.8 (2026-03-10)
* `extIcon` gecorrigeerd naar GitHub Raw URL (E1012)

### 1.0.7 (2026-03-10)
* Icoonkoppeling gecorrigeerd

### 1.0.6 (2026-03-10)
* Sigenergy-logo toegevoegd als adapter-icoon

### 1.0.5 (2026-03-09)
* Correcties
### 1.0.4 (2026-03-09)
* Correcties
### 1.0.3 (2026-03-09)
* Correcties
### 1.0.2 (2026-03-09)
* Correcties
### 1.0.1 (2026-03-09)
* (ssbingo) 4 widgets gemaakt in VIS-2-conform formaat
* (ssbingo) Energiestroom-diagram met SVG-animaties
* (ssbingo) Widget batterijstatus en prognoses
* (ssbingo) Widget realtime vermogen
* (ssbingo) Widget energiestatistieken

## Licentie
MIT License

Copyright (c) 2026 ssbingo <s.sternitzke@online.de>

Hierbij wordt gratis toestemming verleend aan elke persoon die een kopie van deze software
en bijbehorende documentatiebestanden (de „Software") verkrijgt, om zonder beperking
gebruik te maken van de Software, met inbegrip van maar niet beperkt tot het recht om
te gebruiken, kopiëren, wijzigen, samenvoegen, publiceren, distribueren, in sublicentie
te geven en/of te verkopen, en om personen aan wie de Software wordt verstrekt, dit toe
te staan, onder de volgende voorwaarden:

De bovenstaande copyrightvermelding en deze toestemmingsvermelding dienen te worden
opgenomen in alle kopieën of substantiële delen van de Software.

DE SOFTWARE WORDT GELEVERD „ZOALS ZIJ IS", ZONDER ENIGE GARANTIE, UITDRUKKELIJK OF
IMPLICIET, INCLUSIEF MAAR NIET BEPERKT TOT DE GARANTIES VAN VERKOOPBAARHEID, GESCHIKTHEID
VOOR EEN BEPAALD DOEL EN NIET-INBREUK.

## Documentatie

- 🇳🇱 [Nederlands](../../doc/nl/README.md) — dit bestand
- 🇩🇪 [Deutsch](../../doc/de/README.md)
- 🇷🇺 [Русский](../../doc/ru/README.md)
- 🇫🇷 [Français](../../doc/fr/README.md)
- 🇬🇧 [English](../../README.md)
