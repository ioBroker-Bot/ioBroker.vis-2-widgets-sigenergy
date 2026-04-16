![Logo](../../admin/vis-2-widgets-sigenergy.png)
# ioBroker.vis-2-widgets-sigenergy

[![Versione NPM](https://img.shields.io/npm/v/iobroker.vis-2-widgets-sigenergy.svg)](https://www.npmjs.com/package/iobroker.vis-2-widgets-sigenergy)
[![Download](https://img.shields.io/npm/dm/iobroker.vis-2-widgets-sigenergy.svg)](https://www.npmjs.com/package/iobroker.vis-2-widgets-sigenergy)
![Numero di installazioni](https://iobroker.live/badges/vis-2-widgets-sigenergy-installed.svg)
![Versione corrente nel repository stabile](https://iobroker.live/badges/vis-2-widgets-sigenergy-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.vis-2-widgets-sigenergy.png?downloads=true)](https://nodei.co/npm/iobroker.vis-2-widgets-sigenergy/)

**Test:** ![Test e Release](https://github.com/ssbingo/ioBroker.vis-2-widgets-sigenergy/workflows/Test%20and%20Release/badge.svg)

## Adattatore vis-2-widgets-sigenergy per ioBroker

Set di widget VIS-2 per l'adattatore di accumulo energetico Sigenergy (`ioBroker.sigenergy`).
Contiene 8 widget per la visualizzazione e il controllo del flusso energetico, stato della batteria, potenza in tempo reale, statistiche giornaliere, caricatore AC, caricatore DC, inverter e panoramica dei micro-inverter SigenMicro. per la visualizzazione e il controllo del flusso energetico, dello stato della batteria, della potenza in tempo reale, delle statistiche giornaliere, del caricatore AC, del caricatore DC e dell'inverter.

## Requisiti

- ioBroker con l'adattatore `sigenergy` installato e configurato
- Adattatore ioBroker VIS-2 (≥ 2.0.0)

## Widget

### Diagramma del flusso energetico
Mostra il flusso energetico corrente tra pannelli solari, batteria, rete e casa come diagramma SVG animato.
Frecce animate visualizzano le connessioni attive in tempo reale.

**OID:** `pvPower`, `essPower`, `gridActivePower`, `housePower`, `essSoc`

![Diagramma del flusso energetico](../../img/widget-energiefluss.png)

#### Direzioni del flusso

| Punto dati | Valore > 0 | Valore < 0 |
|---|---|---|
| `essPower` | Batteria in carica → freccia dal centro alla batteria | Batteria in scarica → freccia dalla batteria al centro |
| `gridActivePower` | Prelievo dalla rete → freccia dalla rete al centro | Immissione in rete → freccia dal centro alla rete |
| `pvPower` | PV produce → freccia dal PV al centro | — |
| `housePower` | Casa consuma → freccia dal centro alla casa | — |

### Stato batteria e previsioni
Mostra SOC, SOH, potenza di carica e previsioni per il tempo di ricarica completa, l'autonomia residua, l'autoconsumo e il tasso di autosufficienza.

**OID:** `essSoc`, `essSoh`, `essPower`, `batteryTimeToFull`, `batteryTimeRemaining`, `selfConsumptionRate`, `autarkyRate`

![Stato batteria e previsioni](../../img/widget-batterie.png)

### Potenza in tempo reale
Vista elenco compatta di tutti i valori di potenza attuali con indicatori di direzione codificati a colori.

**OID:** `pvPower`, `essPower`, `gridActivePower`, `housePower`, `essSoc`

![Potenza in tempo reale](../../img/widget-leistung.png)

### Statistiche energetiche
Riepilogo giornaliero con tasso di autosufficienza, autoconsumo, storico SOC, energia di carica/scarica e copertura della batteria.

**OID:** `autarkyRate`, `selfConsumptionRate`, `dayMaxSoc`, `dayMinSoc`, `essDailyChargeEnergy`, `essDailyDischargeEnergy`, `batteryCoverageToday`, `batteryDailyChargeTime`

![Statistiche energetiche](../../img/widget-statistiken.png)

### Caricatore AC (Sigen EVAC)
Monitoraggio e controllo del caricatore AC Sigenergy (EVAC). Mostra la potenza di carica, lo stato del sistema, la potenza nominale, la corrente nominale e il consumo totale di energia. Gli allarmi sono evidenziati a colori. La corrente di carica è regolabile tramite cursore (6–32 A).

**OID:** `acCharger.systemState`, `acCharger.chargingPower`, `acCharger.totalEnergyConsumed`, `acCharger.ratedPower`, `acCharger.ratedCurrent`, `acCharger.alarm1/2/3`, `acCharger.control.startStop`, `acCharger.control.outputCurrent`

![Caricatore AC](../../img/widget-ac-charger.png)

### Caricatore DC
Monitoraggio e controllo del caricatore DC Sigenergy. Mostra la potenza di uscita, il SOC del veicolo con barra di avanzamento, la tensione della batteria del veicolo, la corrente di carica e l'energia e la durata della sessione di carica corrente.

**OID:** `dcCharger.outputPower`, `dcCharger.vehicleSoc`, `dcCharger.vehicleBatteryVoltage`, `dcCharger.chargingCurrent`, `dcCharger.currentChargingCapacity`, `dcCharger.currentChargingDuration`, `dcCharger.control.startStop`

![Caricatore DC](../../img/widget-dc-charger.png)

### Inverter
Monitoraggio e controllo completi dell'inverter con navigazione a schede. Mostra lo stato operativo, i dati di potenza, le temperature della batteria, le tensioni di fase, tutti i 5 registri di allarme e le informazioni sul dispositivo (modello, numero di serie, firmware).

| Scheda | Contenuto |
|---|---|
| **Potenza** | Potenza attiva, potenza PV, potenza di carica/scarica batteria, cursore quota di potenza (da −100 % a +100 %) |
| **Batteria** | SOC e SOH con barre, temperatura/tensione media delle celle, temperatura max./min. |
| **Rete** | Tensioni di fase L1/L2/L3, frequenza di rete, fattore di potenza, temperatura interna PCS |
| **Allarmi** | 5 registri di allarme (PCS ×2, ESS, gateway, caricatore DC) con codice hex e marcatura a colori |
| **Info** | Tipo di modello, numero di serie, versione firmware, interruttore Remote-EMS |

![Inverter](../../img/widget-inverter.png)

**OID:** `inverter.activePower`, `inverter.pvPower`, `inverter.essChargeDischargePower`, `inverter.runningState`, `inverter.essBatterySoc/Soh`, `inverter.essAvgCellTemperature/Voltage`, `inverter.phaseA/B/CVoltage`, `inverter.gridFrequency`, `inverter.pcsInternalTemp`, `inverter.alarm1–5`, `inverter.firmwareVersion`, `inverter.modelType`, `inverter.serialNumber`, `inverter.control.startStop`, `inverter.control.remoteEmsDispatchEnable`, `inverter.control.activePowerPercent`

### Panoramica SigenMicro
Panoramica e visualizzazione dettagliata di tutti i micro-inverter SigenMicro sul bus Modbus. La scheda 1 mostra tutti i dispositivi come segmento di rete animato (topologia bus Ethernet con derivazioni verticali).

#### Layout dinamico
| Dispositivi | Righe | Dimensione immagine |
|---|---|---|
| 1–5 | 1 riga | 80 × 90 px |
| 6–10 | 1 riga | 52 × 60 px |
| 11–15 | 2 righe | 46 × 52 px |
| 16–20 | 2 righe | 40 × 46 px |

## Aspetto

Tutti i widget supportano una **modalità chiara e scura**, commutabile tramite l'impostazione widget `Modalità scura`.

## Changelog
### 1.6.8 (2026-04-16)
* (ssbingo) Widget 9 aggiunto: Panoramica stringhe PV con frecce animate per stringa

### 1.6.7 (2026-04-09)
* (ssbingo) Sintassi cooldown di dependabot.yml corretta (default-days invece di default)

### 1.6.6 (2026-04-09)
* (ssbingo) Vecchie voci del changelog spostate in CHANGELOG_OLD.md; aggiunto cooldown Dependabot (7 giorni)

### 1.6.5 (2026-04-09)
* (ssbingo) Job adapter-tests rimosso dal workflow (non applicabile all'adattatore widget VIS); deploy usa ora Node.js 24

### 1.6.4 (2026-03-26)
* (ssbingo) test:integration ripristinato come no-op (richiesto da testing-action-adapter; nessun processo Node.js nell'adattatore widget mode:none)

### 1.6.3 (2026-03-26)
* (ssbingo) Sincronizzati tutti i README di lingua con le voci di changelog mancanti (1.5.10–1.6.2)

### 1.6.2 (2026-03-26)
* (ssbingo) Test di integrazione rimosso — non applicabile per adattatore widget mode:none (nessun processo Node.js principale)

### 1.6.1 (2026-03-26)
* (ssbingo) Configurazione ESLint/Prettier rimossa — nessun codice Node.js da analizzare in un adattatore widget puro; passo lint rimosso dal workflow

### 1.6.0 (2026-03-26)
* (ssbingo) Test completati

### 1.5.11 (2026-03-26)
* (ssbingo) Workflow: install-command impostato su npm install (rigenerazione del lock file necessaria dopo l'aggiunta di @iobroker/eslint-config)

### 1.5.10 (2026-03-26)
* (ssbingo) README.md: sezione LICENSE spostata alla fine (dopo CHANGELOG), testo completo della licenza MIT

### 1.5.8 (2026-03-18)
* (ssbingo) fixed GitHub-Actions (PR)

### 1.5.7 (2026-03-18)
* (ssbingo) Sezione '## Installazione' rimossa da tutti i file README (S6014)

### 1.5.6 (2026-03-18)
* (ssbingo) Incremento versione a 1.5.6; nessuna modifica funzionale

### 1.5.5 (2026-03-18)
* (ssbingo) Incremento versione: 1.5.4 era già pubblicata su npm; nessuna modifica funzionale

### 1.5.4 (2026-03-18)
* (ssbingo) Aggiunto npm-token al workflow test-and-release per la pubblicazione npm automatica

### 1.5.3 (2026-03-17)
* (ssbingo) Rimossi i passaggi di installazione di esempio da tutti i file README
* (ssbingo) Corretto E1111: configurazione native di esempio (option1/option2) rimossa da io-package.json

### 1.5.2 (2026-03-17)
* (ssbingo) Screenshot widget aggiunti: panoramica SigenMicro
* (ssbingo) Screenshot flusso energetico aggiornato

### 1.5.1 (2026-03-17)
* (ssbingo) Bugfix: Widget 8 code placed correctly inside vis.binds object — all widgets visible again

### 1.5.0 (2026-03-17)
* (ssbingo) Widget 8: panoramica SigenMicro con topologia bus Ethernet animata
* (ssbingo) Layout dinamico per 1–20 micro-inverter, 4 livelli di dimensione, 1–2 righe
* (ssbingo) Scheda dettaglio per dispositivo con tutti i 15 registri Modbus (01–15)

### 1.4.4 (2026-03-12)
* Widget flusso energetico: etichetta SOC e valore spostati di 5px verso l'alto

### 1.3.4 (2026-03-12)
* common.news ridotto alla versione corrente (solo 1.3.4)

### 1.3.3 (2026-03-12)
* README.md principale tradotto in inglese

### 1.3.2 (2026-03-12)
* Documentazione aggiunta in README.md — multilingue (RU, NL, FR)

### 1.3.1 (2026-03-12)
* Documentazione tedesca aggiunta in doc/de/README.md
* README: sezione documentazione con collegamenti per lingua aggiunta

### 1.3.0 (2026-03-12)
* Widget flusso energetico: animazione rete convertita in due percorsi separati (prelievo/immissione)
* Widget flusso energetico: auto-start-reverse completamente rimosso — tutte le direzioni tramite percorsi separati

### 1.2.9 (2026-03-12)
* Widget flusso energetico: punto di ancoraggio percorso batteria y=75 → y=71

### 1.2.8 (2026-03-12)
* Widget flusso energetico: freccia batteria posizionata sotto le cifre durante la carica
* Widget flusso energetico: dimensione del carattere dei valori aumentata da 10.5 a 12.5

### 1.2.7 (2026-03-12)
* Widget flusso energetico: direzione batteria completamente riprogettata — due percorsi separati (carica/scarica) sostituiscono l'auto-start-reverse difettoso

### 1.2.6 (2026-03-12)
* Widget flusso energetico: animazione e freccia rete invertite
* Widget flusso energetico: animazione e freccia batteria invertite

### 1.2.5 (2026-03-12)
* Widget flusso energetico: direzione freccia batteria invertita

### 1.2.4 (2026-03-11)
* `common.mode` cambiato in `none`

### 1.2.3 (2026-03-11)
* `common.mode` cambiato in `once`

### 1.2.2 (2026-03-11)
* Correzioni

### 1.2.1 (2026-03-11)
* Correzione README.md

### 1.2.0 (2026-03-11)
* README: screenshot dei widget aggiunti per tutti i 7 widget
* Cartella `img/` con screenshot inclusa in package.json files

### 1.1.9 (2026-03-11)
* Widget flusso energetico: punta freccia batteria corretta

### 1.1.8 (2026-03-11)
* Widget flusso energetico: direzione freccia batteria corretta

### 1.1.7 (2026-03-10)
* W1084 corretto: `common.title` obsoleto rimosso

### 1.1.6 (2026-03-10)
* `title` aggiunto in io-package.json

### 1.1.5 (2026-03-10)
* `vis` aggiunto a `restartAdapters` in io-package.json

### 1.1.4 (2026-03-10)
* W1068 corretto: `ioBroker` rimosso dai keywords

### 1.1.3 (2026-03-10)
* Keyword `ioBroker` aggiunto in io-package.json

### 1.1.2 (2026-03-10)
* `admin/` aggiunto al campo `files` di package.json — icona PNG ora installata correttamente

### 1.1.1 (2026-03-10)
* E1012 corretto: `icon` = nome file, `extIcon` = GitHub Raw URL identico

### 1.1.0 (2026-03-10)
* Icona incorporata come Base64-Data-URI in io-package.json

### 1.0.9 (2026-03-10)
* Risoluzione icona corretta a 512×512 px

### 1.0.8 (2026-03-10)
* `extIcon` corretto con GitHub Raw URL (E1012)

### 1.0.7 (2026-03-10)
* Collegamento icona corretto

### 1.0.6 (2026-03-10)
* Logo Sigenergy aggiunto come icona dell'adattatore

### 1.0.5 (2026-03-09)
* Correzioni
### 1.0.4 (2026-03-09)
* Correzioni
### 1.0.3 (2026-03-09)
* Correzioni
### 1.0.2 (2026-03-09)
* Correzioni
### 1.0.1 (2026-03-09)
* (ssbingo) 4 widget creati in formato conforme VIS-2
* (ssbingo) Diagramma flusso energetico con animazioni SVG
* (ssbingo) Widget stato batteria e previsioni
* (ssbingo) Widget potenza in tempo reale
* (ssbingo) Widget statistiche energetiche

## Licenza
MIT License

Copyright (c) 2026 ssbingo <s.sternitzke@online.de>

Con la presente si concede gratuitamente a chiunque ottenga una copia di questo software
e dei file di documentazione associati (il «Software»), il permesso di trattare il Software
senza restrizioni, inclusi senza limitazione i diritti di utilizzare, copiare, modificare,
unire, pubblicare, distribuire, concedere in sublicenza e/o vendere copie del Software,
e di permettere alle persone a cui il Software è fornito di fare lo stesso, alle seguenti condizioni:

L'avviso di copyright di cui sopra e questo avviso di autorizzazione devono essere inclusi
in tutte le copie o parti sostanziali del Software.

IL SOFTWARE VIENE FORNITO «COSÌ COM'È», SENZA GARANZIA DI ALCUN TIPO, ESPRESSA O IMPLICITA,
INCLUSE MA NON LIMITATE LE GARANZIE DI COMMERCIABILITÀ, IDONEITÀ PER UNO SCOPO PARTICOLARE
E NON VIOLAZIONE.

## Documentazione

- 🇮🇹 [Italiano](../../doc/it/README.md) — questo file
- 🇩🇪 [Deutsch](../../doc/de/README.md)
- 🇬🇧 [English](../../README.md)
- 🇷🇺 [Русский](../../doc/ru/README.md)
- 🇳🇱 [Nederlands](../../doc/nl/README.md)
- 🇫🇷 [Français](../../doc/fr/README.md)
- 🇪🇸 [Español](../../doc/es/README.md)
- 🇵🇱 [Polski](../../doc/pl/README.md)
- 🇵🇹 [Português](../../doc/pt/README.md)
