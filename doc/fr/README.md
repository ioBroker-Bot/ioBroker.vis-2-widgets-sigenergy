![Logo](../../admin/vis-2-widgets-sigenergy.png)
# ioBroker.vis-2-widgets-sigenergy

[![Version NPM](https://img.shields.io/npm/v/iobroker.vis-2-widgets-sigenergy.svg)](https://www.npmjs.com/package/iobroker.vis-2-widgets-sigenergy)
[![Téléchargements](https://img.shields.io/npm/dm/iobroker.vis-2-widgets-sigenergy.svg)](https://www.npmjs.com/package/iobroker.vis-2-widgets-sigenergy)
![Nombre d'installations](https://iobroker.live/badges/vis-2-widgets-sigenergy-installed.svg)
![Version actuelle dans le dépôt stable](https://iobroker.live/badges/vis-2-widgets-sigenergy-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.vis-2-widgets-sigenergy.png?downloads=true)](https://nodei.co/npm/iobroker.vis-2-widgets-sigenergy/)

**Tests :** ![Test et Release](https://github.com/ssbingo/ioBroker.vis-2-widgets-sigenergy/workflows/Test%20and%20Release/badge.svg)

## Adaptateur vis-2-widgets-sigenergy pour ioBroker

Ensemble de widgets VIS-2 pour l'adaptateur de stockage d'énergie Sigenergy (`ioBroker.sigenergy`).
Contient 7 widgets pour la visualisation et le contrôle du flux d'énergie, de l'état de la batterie, de la puissance en temps réel, des statistiques journalières, du chargeur AC, du chargeur DC et de l'onduleur.

## Prérequis

- ioBroker avec l'adaptateur `sigenergy` installé et configuré
- Adaptateur ioBroker VIS-2 (≥ 2.0.0)

## Installation

Installer l'adaptateur via ioBroker Admin en tant que fichier ZIP :

1. Admin → Adaptateurs → « Installer depuis une URL personnalisée » (icône GitHub)
2. Téléverser le fichier ZIP ou indiquer l'URL
3. Attendre la fin de l'installation — VIS-2 redémarre automatiquement

> **Remarque :** Après l'installation, un **rechargement de l'éditeur VIS-2 dans le navigateur** est nécessaire
> (F5 ou actualiser la page) pour que les widgets apparaissent dans la palette.
> L'adaptateur VIS-2 redémarre automatiquement, mais le navigateur doit être
> actualisé manuellement.

## Widgets

### Diagramme de flux d'énergie
Affiche le flux d'énergie actuel entre les panneaux solaires, la batterie, le réseau et la maison sous forme de diagramme SVG animé. Des flèches animées visualisent les connexions actives en temps réel.

**OID :** `pvPower`, `essPower`, `gridActivePower`, `housePower`, `essSoc`

![Diagramme de flux d'énergie](../../img/widget-energiefluss.png)

#### Directions du flux

| Point de données | Valeur > 0 | Valeur < 0 |
|---|---|---|
| `essPower` | Batterie en charge → flèche du centre vers la batterie | Batterie en décharge → flèche de la batterie vers le centre |
| `gridActivePower` | Soutirage réseau → flèche du réseau vers le centre | Injection réseau → flèche du centre vers le réseau |
| `pvPower` | PV produit → flèche du PV vers le centre | — |
| `housePower` | Maison consomme → flèche du centre vers la maison | — |

### État de la batterie & prévisions
Affiche SOC, SOH, puissance de charge et prévisions pour le temps de charge, l'autonomie restante, l'autoconsommation et le taux d'autarcie.

**OID :** `essSoc`, `essSoh`, `essPower`, `batteryTimeToFull`, `batteryTimeRemaining`, `selfConsumptionRate`, `autarkyRate`

![État de la batterie](../../img/widget-batterie.png)

### Puissance en temps réel
Vue liste compacte de toutes les valeurs de puissance actuelles avec indicateur de direction par code couleur.

**OID :** `pvPower`, `essPower`, `gridActivePower`, `housePower`, `essSoc`

![Puissance en temps réel](../../img/widget-leistung.png)

### Statistiques énergétiques
Récapitulatif journalier avec taux d'autarcie, autoconsommation, évolution du SOC, énergie de charge/décharge et couverture batterie.

**OID :** `autarkyRate`, `selfConsumptionRate`, `dayMaxSoc`, `dayMinSoc`, `essDailyChargeEnergy`, `essDailyDischargeEnergy`, `batteryCoverageToday`, `batteryDailyChargeTime`

![Statistiques énergétiques](../../img/widget-statistiken.png)

### Chargeur AC (Sigen EVAC)
Surveillance et contrôle du chargeur AC Sigenergy (EVAC). Affiche la puissance de charge, l'état du système, la puissance nominale, le courant nominal et la consommation totale d'énergie. Les alarmes sont mises en évidence par couleur. Le courant de charge est réglable via un curseur (6–32 A).

**OID :** `acCharger.systemState`, `acCharger.chargingPower`, `acCharger.totalEnergyConsumed`, `acCharger.ratedPower`, `acCharger.ratedCurrent`, `acCharger.alarm1/2/3`, `acCharger.control.startStop`, `acCharger.control.outputCurrent`

![Chargeur AC](../../img/widget-ac-charger.png)

### Chargeur DC
Surveillance et contrôle du chargeur DC Sigenergy. Affiche la puissance de sortie, le SOC du véhicule avec barre de progression, la tension de la batterie du véhicule, le courant de charge ainsi que l'énergie et la durée de la session de charge en cours.

**OID :** `dcCharger.outputPower`, `dcCharger.vehicleSoc`, `dcCharger.vehicleBatteryVoltage`, `dcCharger.chargingCurrent`, `dcCharger.currentChargingCapacity`, `dcCharger.currentChargingDuration`, `dcCharger.control.startStop`

![Chargeur DC](../../img/widget-dc-charger.png)

### Onduleur
Surveillance et contrôle complets de l'onduleur avec navigation par onglets. Affiche l'état de fonctionnement, les données de puissance, les températures de la batterie, les tensions de phase, les 5 registres d'alarmes et les informations de l'appareil (modèle, numéro de série, firmware).

| Onglet | Contenu |
|---|---|
| **Puissance** | Puissance active, puissance PV, puissance de charge/décharge batterie, curseur de part de puissance (de −100 % à +100 %) |
| **Batterie** | SOC et SOH avec barres, température/tension moyenne des cellules, température max./min. |
| **Réseau** | Tensions de phase L1/L2/L3, fréquence réseau, facteur de puissance, température interne PCS |
| **Alarmes** | 5 registres d'alarmes (PCS ×2, ESS, passerelle, chargeur DC) avec code hex et marquage couleur |
| **Info** | Type de modèle, numéro de série, version du firmware, commutateur Remote-EMS |

![Onduleur](../../img/widget-inverter.png)

**OID :** `inverter.activePower`, `inverter.pvPower`, `inverter.essChargeDischargePower`, `inverter.runningState`, `inverter.essBatterySoc/Soh`, `inverter.essAvgCellTemperature/Voltage`, `inverter.phaseA/B/CVoltage`, `inverter.gridFrequency`, `inverter.pcsInternalTemp`, `inverter.alarm1–5`, `inverter.firmwareVersion`, `inverter.modelType`, `inverter.serialNumber`, `inverter.control.startStop`, `inverter.control.remoteEmsDispatchEnable`, `inverter.control.activePowerPercent`

## Apparence

Tous les widgets prennent en charge un **mode clair et sombre**, commutable via le paramètre de widget `Mode sombre`.

## Changelog
### 1.3.3 (2026-03-12)
* README.md principal traduit en anglais

### 1.3.2 (2026-03-12)
* Documentation ajoutée dans README.md — multilingue (RU, NL, FR)

### 1.3.1 (2026-03-12)
* Documentation allemande ajoutée dans doc/de/README.md ; README : section documentation avec liens par langue ajoutée

### 1.3.0 (2026-03-12)
* Widget flux d'énergie : animation réseau convertie en deux chemins séparés (soutirage/injection)
* Widget flux d'énergie : auto-start-reverse entièrement supprimé — toutes les directions via des chemins séparés

### 1.2.9 (2026-03-12)
* Widget flux d'énergie : point d'ancrage du chemin batterie y=75 → y=71

### 1.2.8 (2026-03-12)
* Widget flux d'énergie : flèche batterie en charge positionnée sous les chiffres
* Widget flux d'énergie : taille de police des valeurs augmentée de 10.5 à 12.5

### 1.2.7 (2026-03-12)
* Widget flux d'énergie : direction batterie entièrement repensée — deux chemins séparés (charge/décharge) remplacent l'auto-start-reverse défaillant

### 1.2.6 (2026-03-12)
* Widget flux d'énergie : animation et flèche réseau inversées
* Widget flux d'énergie : animation et flèche batterie inversées

### 1.2.5 (2026-03-12)
* Widget flux d'énergie : direction de la flèche batterie inversée

### 1.2.4 (2026-03-11)
* `common.mode` changé en `none`

### 1.2.3 (2026-03-11)
* `common.mode` changé en `once`

### 1.2.2 (2026-03-11)
* Corrections

### 1.2.1 (2026-03-11)
* Correction README.md

### 1.2.0 (2026-03-11)
* README : captures d'écran des widgets pour les 7 widgets ajoutées
* Dossier `img/` avec captures d'écran inclus dans package.json files

### 1.1.9 (2026-03-11)
* Widget flux d'énergie : pointe de flèche batterie corrigée

### 1.1.8 (2026-03-11)
* Widget flux d'énergie : direction de la flèche batterie corrigée

### 1.1.7 (2026-03-10)
* W1084 corrigé : `common.title` obsolète supprimé

### 1.1.6 (2026-03-10)
* `title` ajouté dans io-package.json

### 1.1.5 (2026-03-10)
* `vis` ajouté à `restartAdapters` dans io-package.json

### 1.1.4 (2026-03-10)
* W1068 corrigé : `ioBroker` supprimé des keywords

### 1.1.3 (2026-03-10)
* Mot-clé `ioBroker` ajouté dans io-package.json

### 1.1.2 (2026-03-10)
* `admin/` ajouté au champ `files` de package.json — l'icône PNG est désormais installée correctement

### 1.1.1 (2026-03-10)
* E1012 corrigé : `icon` = nom de fichier, `extIcon` = GitHub Raw URL

### 1.1.0 (2026-03-10)
* Icône intégrée comme Base64-Data-URI dans io-package.json

### 1.0.9 (2026-03-10)
* Résolution de l'icône corrigée à 512×512 pixels

### 1.0.8 (2026-03-10)
* `extIcon` corrigé en GitHub Raw URL (E1012)

### 1.0.7 (2026-03-10)
* Liaison de l'icône corrigée

### 1.0.6 (2026-03-10)
* Logo Sigenergy ajouté comme icône de l'adaptateur

### 1.0.5 (2026-03-09)
* Corrections
### 1.0.4 (2026-03-09)
* Corrections
### 1.0.3 (2026-03-09)
* Corrections
### 1.0.2 (2026-03-09)
* Corrections
### 1.0.1 (2026-03-09)
* (ssbingo) 4 widgets créés au format conforme VIS-2
* (ssbingo) Diagramme de flux d'énergie avec animations SVG
* (ssbingo) Widget état de la batterie et prévisions
* (ssbingo) Widget puissance en temps réel
* (ssbingo) Widget statistiques énergétiques

## Licence
MIT License

Copyright (c) 2026 ssbingo <s.sternitzke@online.de>

La présente licence accorde gratuitement à toute personne obtenant une copie de ce logiciel
et des fichiers de documentation associés (le « Logiciel »), la permission de traiter le Logiciel
sans restriction, notamment sans limitation des droits d'utilisation, de copie, de modification,
de fusion, de publication, de distribution, de sous-licence et/ou de vente de copies du Logiciel,
et d'autoriser les personnes à qui le Logiciel est fourni à le faire, sous réserve des conditions
suivantes :

L'avis de droit d'auteur ci-dessus et le présent avis d'autorisation doivent être inclus dans
toutes les copies ou parties substantielles du Logiciel.

LE LOGICIEL EST FOURNI « TEL QUEL », SANS GARANTIE D'AUCUNE SORTE, EXPLICITE OU IMPLICITE,
NOTAMMENT SANS GARANTIE DE QUALITÉ MARCHANDE, D'ADÉQUATION À UN USAGE PARTICULIER ET
D'ABSENCE DE CONTREFAÇON.

## Documentation

- 🇫🇷 [Français](../../doc/fr/README.md) — ce fichier
- 🇩🇪 [Deutsch](../../doc/de/README.md)
- 🇷🇺 [Русский](../../doc/ru/README.md)
- 🇳🇱 [Nederlands](../../doc/nl/README.md)
- 🇬🇧 [English](../../README.md)
