![Logo](../../admin/vis-2-widgets-sigenergy.png)
# ioBroker.vis-2-widgets-sigenergy

[![Wersja NPM](https://img.shields.io/npm/v/iobroker.vis-2-widgets-sigenergy.svg)](https://www.npmjs.com/package/iobroker.vis-2-widgets-sigenergy)
[![Pobrania](https://img.shields.io/npm/dm/iobroker.vis-2-widgets-sigenergy.svg)](https://www.npmjs.com/package/iobroker.vis-2-widgets-sigenergy)
![Liczba instalacji](https://iobroker.live/badges/vis-2-widgets-sigenergy-installed.svg)
![Aktualna wersja w stabilnym repozytorium](https://iobroker.live/badges/vis-2-widgets-sigenergy-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.vis-2-widgets-sigenergy.png?downloads=true)](https://nodei.co/npm/iobroker.vis-2-widgets-sigenergy/)

**Testy:** ![Test i wydanie](https://github.com/ssbingo/ioBroker.vis-2-widgets-sigenergy/workflows/Test%20and%20Release/badge.svg)

## Adapter vis-2-widgets-sigenergy dla ioBroker

Zestaw widżetów VIS-2 dla adaptera magazynowania energii Sigenergy (`ioBroker.sigenergy`).
Zawiera 7 widżetów do wizualizacji i sterowania przepływem energii, stanem baterii, mocą w czasie rzeczywistym, statystykami dziennymi, ładowarką AC, ładowarką DC i falownikiem.

## Wymagania

- ioBroker z zainstalowanym i skonfigurowanym adapterem `sigenergy`
- Adapter ioBroker VIS-2 (≥ 2.0.0)

## Instalacja

Zainstaluj adapter przez ioBroker Admin jako plik ZIP:

1. Admin → Adaptery → „Zainstaluj z własnego URL" (ikona GitHub)
2. Prześlij plik ZIP lub podaj URL
3. Poczekaj na zakończenie instalacji — VIS-2 restartuje się automatycznie

> **Uwaga:** Po instalacji wymagane jest **ponowne załadowanie edytora VIS-2 w przeglądarce**
> (F5 lub odśwież stronę), aby widżety pojawiły się w palecie.
> Adapter VIS-2 restartuje się automatycznie, ale przeglądarka musi zostać
> odświeżona ręcznie.

## Widżety

### Diagram przepływu energii
Wyświetla aktualny przepływ energii między panelami słonecznymi, baterią, siecią i domem jako animowany diagram SVG.
Animowane strzałki wizualizują aktywne połączenia w czasie rzeczywistym.

**OID:** `pvPower`, `essPower`, `gridActivePower`, `housePower`, `essSoc`

![Diagram przepływu energii](../../img/widget-energiefluss.png)

#### Kierunki przepływu

| Punkt danych | Wartość > 0 | Wartość < 0 |
|---|---|---|
| `essPower` | Bateria ładuje się → strzałka od środka do baterii | Bateria rozładowuje się → strzałka od baterii do środka |
| `gridActivePower` | Pobór z sieci → strzałka od sieci do środka | Oddawanie do sieci → strzałka od środka do sieci |
| `pvPower` | PV produkuje → strzałka od PV do środka | — |
| `housePower` | Dom zużywa → strzałka od środka do domu | — |

### Stan baterii i prognozy
Wyświetla SOC, SOH, moc ładowania oraz prognozy czasu do pełnego naładowania, pozostałego czasu pracy, autokonsumpcji i stopnia autarki.

**OID:** `essSoc`, `essSoh`, `essPower`, `batteryTimeToFull`, `batteryTimeRemaining`, `selfConsumptionRate`, `autarkyRate`

![Stan baterii i prognozy](../../img/widget-batterie.png)

### Moc w czasie rzeczywistym
Kompaktowy widok listy wszystkich aktualnych wartości mocy z kolorowo zakodowanymi wskaźnikami kierunku.

**OID:** `pvPower`, `essPower`, `gridActivePower`, `housePower`, `essSoc`

![Moc w czasie rzeczywistym](../../img/widget-leistung.png)

### Statystyki energii
Dzienny przegląd ze stopniem autarki, autokonsumpcją, historią SOC, energią ładowania/rozładowania i pokryciem baterii.

**OID:** `autarkyRate`, `selfConsumptionRate`, `dayMaxSoc`, `dayMinSoc`, `essDailyChargeEnergy`, `essDailyDischargeEnergy`, `batteryCoverageToday`, `batteryDailyChargeTime`

![Statystyki energii](../../img/widget-statistiken.png)

### Ładowarka AC (Sigen EVAC)
Monitorowanie i sterowanie ładowarką AC Sigenergy (EVAC). Wyświetla moc ładowania, stan systemu, moc znamionową, prąd znamionowy i całkowite zużycie energii. Alarmy są wyróżnione kolorami. Prąd ładowania można regulować suwakiem (6–32 A).

**OID:** `acCharger.systemState`, `acCharger.chargingPower`, `acCharger.totalEnergyConsumed`, `acCharger.ratedPower`, `acCharger.ratedCurrent`, `acCharger.alarm1/2/3`, `acCharger.control.startStop`, `acCharger.control.outputCurrent`

![Ładowarka AC](../../img/widget-ac-charger.png)

### Ładowarka DC
Monitorowanie i sterowanie ładowarką DC Sigenergy. Wyświetla moc wyjściową, SOC pojazdu z paskiem postępu, napięcie baterii pojazdu, prąd ładowania oraz energię i czas trwania bieżącej sesji ładowania.

**OID:** `dcCharger.outputPower`, `dcCharger.vehicleSoc`, `dcCharger.vehicleBatteryVoltage`, `dcCharger.chargingCurrent`, `dcCharger.currentChargingCapacity`, `dcCharger.currentChargingDuration`, `dcCharger.control.startStop`

![Ładowarka DC](../../img/widget-dc-charger.png)

### Falownik
Kompleksowe monitorowanie i sterowanie falownikiem z nawigacją zakładkową. Wyświetla stan pracy, dane mocy, temperatury baterii, napięcia fazowe, wszystkie 5 rejestrów alarmów oraz informacje o urządzeniu (model, numer seryjny, firmware).

| Zakładka | Zawartość |
|---|---|
| **Moc** | Moc czynna, moc PV, moc ładowania/rozładowania baterii, suwak udziału mocy (od −100 % do +100 %) |
| **Bateria** | SOC i SOH z paskami, śr. temperatura/napięcie ogniw, temperatura maks./min. |
| **Sieć** | Napięcia fazowe L1/L2/L3, częstotliwość sieci, współczynnik mocy, temperatura wewnętrzna PCS |
| **Alarmy** | 5 rejestrów alarmów (PCS ×2, ESS, brama, ładowarka DC) z kodem hex i oznaczeniem kolorystycznym |
| **Info** | Typ modelu, numer seryjny, wersja firmware, przełącznik Remote-EMS |

![Falownik](../../img/widget-inverter.png)

**OID:** `inverter.activePower`, `inverter.pvPower`, `inverter.essChargeDischargePower`, `inverter.runningState`, `inverter.essBatterySoc/Soh`, `inverter.essAvgCellTemperature/Voltage`, `inverter.phaseA/B/CVoltage`, `inverter.gridFrequency`, `inverter.pcsInternalTemp`, `inverter.alarm1–5`, `inverter.firmwareVersion`, `inverter.modelType`, `inverter.serialNumber`, `inverter.control.startStop`, `inverter.control.remoteEmsDispatchEnable`, `inverter.control.activePowerPercent`

## Wygląd

Wszystkie widżety obsługują **tryb jasny i ciemny**, przełączany przez ustawienie widżetu `Tryb ciemny`.

## Changelog
### 1.4.4 (2026-03-12)
* Widget przepływu energii: etykieta SOC i wartość przesunięte o 5px w górę

### 1.3.4 (2026-03-12)
* common.news zredukowane do bieżącej wersji (tylko 1.3.4)

### 1.3.3 (2026-03-12)
* Główny README.md przetłumaczony na angielski

### 1.3.2 (2026-03-12)
* Dokumentacja dodana do README.md — wielojęzyczna (RU, NL, FR)

### 1.3.1 (2026-03-12)
* Dodano niemiecką dokumentację w doc/de/README.md
* README: dodano sekcję dokumentacji z łączami do języków

### 1.3.0 (2026-03-12)
* Widget przepływu energii: animacja sieci podzielona na dwie osobne ścieżki (pobór/oddawanie)
* Widget przepływu energii: auto-start-reverse całkowicie usunięty — wszystkie kierunki przez osobne ścieżki

### 1.2.9 (2026-03-12)
* Widget przepływu energii: punkt zakotwiczenia ścieżki baterii y=75 → y=71

### 1.2.8 (2026-03-12)
* Widget przepływu energii: strzałka baterii umieszczona poniżej cyfr podczas ładowania
* Widget przepływu energii: rozmiar czcionki wartości zwiększony z 10.5 do 12.5

### 1.2.7 (2026-03-12)
* Widget przepływu energii: kierunek baterii całkowicie przeprojektowany — dwie osobne ścieżki (ładowanie/rozładowanie) zastępują wadliwy auto-start-reverse

### 1.2.6 (2026-03-12)
* Widget przepływu energii: animacja i strzałka sieci odwrócone
* Widget przepływu energii: animacja i strzałka baterii odwrócone

### 1.2.5 (2026-03-12)
* Widget przepływu energii: kierunek strzałki baterii odwrócony

### 1.2.4 (2026-03-11)
* `common.mode` zmieniony na `none`

### 1.2.3 (2026-03-11)
* `common.mode` zmieniony na `once`

### 1.2.2 (2026-03-11)
* Poprawki

### 1.2.1 (2026-03-11)
* Korekta README.md

### 1.2.0 (2026-03-11)
* README: zrzuty ekranu widżetów dodane dla wszystkich 7 widżetów
* Folder `img/` ze zrzutami ekranu dodany do package.json files

### 1.1.9 (2026-03-11)
* Widget przepływu energii: grot strzałki baterii poprawiony

### 1.1.8 (2026-03-11)
* Widget przepływu energii: kierunek strzałki baterii poprawiony

### 1.1.7 (2026-03-10)
* Naprawiono W1084: usunięto przestarzałe `common.title`

### 1.1.6 (2026-03-10)
* Dodano `title` w io-package.json

### 1.1.5 (2026-03-10)
* Dodano `vis` do `restartAdapters` w io-package.json

### 1.1.4 (2026-03-10)
* Naprawiono W1068: `ioBroker` usunięty z keywords

### 1.1.3 (2026-03-10)
* Keyword `ioBroker` dodany w io-package.json

### 1.1.2 (2026-03-10)
* `admin/` dodany do pola `files` w package.json — PNG ikony teraz instalowane poprawnie

### 1.1.1 (2026-03-10)
* Naprawiono E1012: `icon` = nazwa pliku, `extIcon` = identyczny GitHub Raw URL

### 1.1.0 (2026-03-10)
* Ikona osadzona jako Base64-Data-URI w io-package.json

### 1.0.9 (2026-03-10)
* Rozdzielczość ikony poprawiona do 512×512 px

### 1.0.8 (2026-03-10)
* `extIcon` poprawiony na GitHub Raw URL (E1012)

### 1.0.7 (2026-03-10)
* Powiązanie ikony poprawione

### 1.0.6 (2026-03-10)
* Logo Sigenergy dodane jako ikona adaptera

### 1.0.5 (2026-03-09)
* Poprawki
### 1.0.4 (2026-03-09)
* Poprawki
### 1.0.3 (2026-03-09)
* Poprawki
### 1.0.2 (2026-03-09)
* Poprawki
### 1.0.1 (2026-03-09)
* (ssbingo) 4 widżety stworzone w formacie zgodnym z VIS-2
* (ssbingo) Diagram przepływu energii z animacjami SVG
* (ssbingo) Widżet stanu baterii i prognoz
* (ssbingo) Widżet mocy w czasie rzeczywistym
* (ssbingo) Widżet statystyk energii

## Licencja
MIT License

Copyright (c) 2026 ssbingo <s.sternitzke@online.de>

Niniejszym udziela się bezpłatnego zezwolenia każdej osobie, która uzyska kopię
tego oprogramowania i powiązanych plików dokumentacji (dalej „Oprogramowanie"),
na używanie Oprogramowania bez ograniczeń, w tym bez ograniczeń prawa do używania,
kopiowania, modyfikowania, scalania, publikowania, dystrybucji, udzielania sublicencji
i/lub sprzedaży kopii Oprogramowania, pod następującymi warunkami:

Powyższe zastrzeżenie praw autorskich oraz niniejsza informacja o zezwoleniu muszą być
zawarte we wszystkich kopiach lub istotnych częściach Oprogramowania.

OPROGRAMOWANIE JEST DOSTARCZANE „TAK JAK JEST", BEZ JAKIEJKOLWIEK GWARANCJI, WYRAŹNEJ
LUB DOROZUMIANEJ, W TYM BEZ GWARANCJI PRZYDATNOŚCI HANDLOWEJ, PRZYDATNOŚCI DO OKREŚLONEGO
CELU I NIENARUSZANIA PRAW.

## Dokumentacja

- 🇵🇱 [Polski](../../doc/pl/README.md) — ten plik
- 🇩🇪 [Deutsch](../../doc/de/README.md)
- 🇬🇧 [English](../../README.md)
- 🇷🇺 [Русский](../../doc/ru/README.md)
- 🇳🇱 [Nederlands](../../doc/nl/README.md)
- 🇫🇷 [Français](../../doc/fr/README.md)
- 🇮🇹 [Italiano](../../doc/it/README.md)
- 🇪🇸 [Español](../../doc/es/README.md)
- 🇵🇹 [Português](../../doc/pt/README.md)
