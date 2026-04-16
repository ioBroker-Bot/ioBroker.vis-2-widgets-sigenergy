![Logo](../../admin/vis-2-widgets-sigenergy.png)
# ioBroker.vis-2-widgets-sigenergy

[![Versión NPM](https://img.shields.io/npm/v/iobroker.vis-2-widgets-sigenergy.svg)](https://www.npmjs.com/package/iobroker.vis-2-widgets-sigenergy)
[![Descargas](https://img.shields.io/npm/dm/iobroker.vis-2-widgets-sigenergy.svg)](https://www.npmjs.com/package/iobroker.vis-2-widgets-sigenergy)
![Número de instalaciones](https://iobroker.live/badges/vis-2-widgets-sigenergy-installed.svg)
![Versión actual en el repositorio estable](https://iobroker.live/badges/vis-2-widgets-sigenergy-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.vis-2-widgets-sigenergy.png?downloads=true)](https://nodei.co/npm/iobroker.vis-2-widgets-sigenergy/)

**Pruebas:** ![Prueba y publicación](https://github.com/ssbingo/ioBroker.vis-2-widgets-sigenergy/workflows/Test%20and%20Release/badge.svg)

## Adaptador vis-2-widgets-sigenergy para ioBroker

Conjunto de widgets VIS-2 para el adaptador de almacenamiento de energía Sigenergy (`ioBroker.sigenergy`).
Contiene 8 widgets para la visualización y control del flujo de energía, estado de la batería, potencia en tiempo real, estadísticas diarias, cargador AC, cargador DC, inversor y vista general de los microinversores SigenMicro. para la visualización y el control del flujo de energía, el estado de la batería, la potencia en tiempo real, las estadísticas diarias, el cargador AC, el cargador DC y el inversor.

## Requisitos

- ioBroker con el adaptador `sigenergy` instalado y configurado
- Adaptador ioBroker VIS-2 (≥ 2.0.0)

## Widgets

### Diagrama de flujo de energía
Muestra el flujo de energía actual entre los paneles solares, la batería, la red y el hogar como un diagrama SVG animado.
Las flechas animadas visualizan las conexiones activas en tiempo real.

**OIDs:** `pvPower`, `essPower`, `gridActivePower`, `housePower`, `essSoc`

![Diagrama de flujo de energía](../../img/widget-energiefluss.png)

#### Direcciones del flujo

| Punto de datos | Valor > 0 | Valor < 0 |
|---|---|---|
| `essPower` | Batería cargándose → flecha del centro a la batería | Batería descargándose → flecha de la batería al centro |
| `gridActivePower` | Consumo de red → flecha de la red al centro | Inyección a la red → flecha del centro a la red |
| `pvPower` | PV produciendo → flecha del PV al centro | — |
| `housePower` | Hogar consumiendo → flecha del centro al hogar | — |

### Estado de la batería y previsiones
Muestra SOC, SOH, potencia de carga y previsiones de tiempo de carga completa, autonomía restante, autoconsumo y tasa de autarquía.

**OIDs:** `essSoc`, `essSoh`, `essPower`, `batteryTimeToFull`, `batteryTimeRemaining`, `selfConsumptionRate`, `autarkyRate`

![Estado de la batería y previsiones](../../img/widget-batterie.png)

### Potencia en tiempo real
Vista de lista compacta de todos los valores de potencia actuales con indicadores de dirección codificados por colores.

**OIDs:** `pvPower`, `essPower`, `gridActivePower`, `housePower`, `essSoc`

![Potencia en tiempo real](../../img/widget-leistung.png)

### Estadísticas de energía
Resumen diario con tasa de autarquía, autoconsumo, historial de SOC, energía de carga/descarga y cobertura de la batería.

**OIDs:** `autarkyRate`, `selfConsumptionRate`, `dayMaxSoc`, `dayMinSoc`, `essDailyChargeEnergy`, `essDailyDischargeEnergy`, `batteryCoverageToday`, `batteryDailyChargeTime`

![Estadísticas de energía](../../img/widget-statistiken.png)

### Cargador AC (Sigen EVAC)
Monitorización y control del cargador AC Sigenergy (EVAC). Muestra la potencia de carga, el estado del sistema, la potencia nominal, la corriente nominal y el consumo total de energía. Las alarmas se resaltan con colores. La corriente de carga se puede ajustar directamente mediante un control deslizante (6–32 A).

**OIDs:** `acCharger.systemState`, `acCharger.chargingPower`, `acCharger.totalEnergyConsumed`, `acCharger.ratedPower`, `acCharger.ratedCurrent`, `acCharger.alarm1/2/3`, `acCharger.control.startStop`, `acCharger.control.outputCurrent`

![Cargador AC](../../img/widget-ac-charger.png)

### Cargador DC
Monitorización y control del cargador DC Sigenergy. Muestra la potencia de salida, el SOC del vehículo con barra de progreso, la tensión de la batería del vehículo, la corriente de carga y la energía y duración de la sesión de carga actual.

**OIDs:** `dcCharger.outputPower`, `dcCharger.vehicleSoc`, `dcCharger.vehicleBatteryVoltage`, `dcCharger.chargingCurrent`, `dcCharger.currentChargingCapacity`, `dcCharger.currentChargingDuration`, `dcCharger.control.startStop`

![Cargador DC](../../img/widget-dc-charger.png)

### Inversor
Monitorización y control completos del inversor con navegación por pestañas. Muestra el estado operativo, los datos de potencia, las temperaturas de la batería, las tensiones de fase, los 5 registros de alarma y la información del dispositivo (modelo, número de serie, firmware).

| Pestaña | Contenido |
|---|---|
| **Potencia** | Potencia activa, potencia PV, potencia de carga/descarga de batería, control deslizante de cuota de potencia (de −100 % a +100 %) |
| **Batería** | SOC y SOH con barras, temperatura/tensión media de celdas, temperatura máx./mín. |
| **Red** | Tensiones de fase L1/L2/L3, frecuencia de red, factor de potencia, temperatura interna PCS |
| **Alarmas** | 5 registros de alarma (PCS ×2, ESS, pasarela, cargador DC) con código hex y marcado de color |
| **Info** | Tipo de modelo, número de serie, versión de firmware, interruptor Remote-EMS |

![Inversor](../../img/widget-inverter.png)

**OIDs:** `inverter.activePower`, `inverter.pvPower`, `inverter.essChargeDischargePower`, `inverter.runningState`, `inverter.essBatterySoc/Soh`, `inverter.essAvgCellTemperature/Voltage`, `inverter.phaseA/B/CVoltage`, `inverter.gridFrequency`, `inverter.pcsInternalTemp`, `inverter.alarm1–5`, `inverter.firmwareVersion`, `inverter.modelType`, `inverter.serialNumber`, `inverter.control.startStop`, `inverter.control.remoteEmsDispatchEnable`, `inverter.control.activePowerPercent`

### Vista general SigenMicro
Vista general y detallada de todos los microinversores SigenMicro en el bus Modbus. La pestaña 1 muestra todos los dispositivos como segmento de red animado (topología de bus Ethernet con derivaciones verticales).

#### Diseño dinámico
| Dispositivos | Filas | Tamaño imagen |
|---|---|---|
| 1–5 | 1 fila | 80 × 90 px |
| 6–10 | 1 fila | 52 × 60 px |
| 11–15 | 2 filas | 46 × 52 px |
| 16–20 | 2 filas | 40 × 46 px |

## Apariencia

Todos los widgets admiten un **modo claro y oscuro**, conmutable mediante el ajuste de widget `Modo oscuro`.

## Changelog
### 1.6.9 (2026-04-16)
* (ssbingo) Widget 9 renombrado a 'PV Power'

### 1.6.8 (2026-04-16)
* (ssbingo) Widget 9 añadido: Resumen de strings PV con flechas animadas por string

### 1.6.7 (2026-04-09)
* (ssbingo) Sintaxis cooldown de dependabot.yml corregida (default-days en lugar de default)

### 1.6.6 (2026-04-09)
* (ssbingo) Entradas antiguas del changelog movidas a CHANGELOG_OLD.md; cooldown de Dependabot añadido (7 días)

### 1.6.5 (2026-04-09)
* (ssbingo) Job adapter-tests eliminado del workflow (no aplicable al adaptador widget VIS); deploy usa ahora Node.js 24

### 1.6.4 (2026-03-26)
* (ssbingo) test:integration restaurado como no-op (requerido por testing-action-adapter; sin proceso Node.js en el adaptador widget mode:none)

### 1.6.3 (2026-03-26)
* (ssbingo) Sincronizados todos los READMEs de idiomas con entradas de changelog faltantes (1.5.10–1.6.2)

### 1.6.2 (2026-03-26)
* (ssbingo) Prueba de integración eliminada — no aplicable para adaptador widget mode:none (sin proceso Node.js principal)

### 1.6.1 (2026-03-26)
* (ssbingo) Configuración ESLint/Prettier eliminada — sin código Node.js que analizar en un adaptador de widget puro; paso lint eliminado del workflow

### 1.6.0 (2026-03-26)
* (ssbingo) Pruebas completadas

### 1.5.11 (2026-03-26)
* (ssbingo) Workflow: install-command configurado como npm install (regeneración del lock file requerida tras añadir @iobroker/eslint-config)

### 1.5.10 (2026-03-26)
* (ssbingo) README.md: sección LICENSE movida al final (después del CHANGELOG), texto completo de la licencia MIT

### 1.5.8 (2026-03-18)
* (ssbingo) fixed GitHub-Actions (PR)

### 1.5.7 (2026-03-18)
* (ssbingo) Sección '## Instalación' eliminada de todos los archivos README (S6014)

### 1.5.6 (2026-03-18)
* (ssbingo) Incremento de versión a 1.5.6; sin cambios funcionales

### 1.5.5 (2026-03-18)
* (ssbingo) Incremento de versión: 1.5.4 ya estaba publicada en npm; sin cambios funcionales

### 1.5.4 (2026-03-18)
* (ssbingo) npm-token añadido al workflow test-and-release para publicación npm automática

### 1.5.3 (2026-03-17)
* (ssbingo) Eliminados los pasos de instalación de ejemplo de todos los archivos README
* (ssbingo) Corregido E1111: configuración native de ejemplo (option1/option2) eliminada de io-package.json

### 1.5.2 (2026-03-17)
* (ssbingo) Capturas de pantalla de widgets añadidas: vista general SigenMicro
* (ssbingo) Captura de flujo de energía actualizada

### 1.5.1 (2026-03-17)
* (ssbingo) Bugfix: Widget 8 code placed correctly inside vis.binds object — all widgets visible again

### 1.5.0 (2026-03-17)
* (ssbingo) Widget 8: vista general SigenMicro con topología de bus Ethernet animada
* (ssbingo) Diseño dinámico para 1–20 microinversores, 4 niveles de tamaño, 1–2 filas
* (ssbingo) Pestaña de detalle por dispositivo con los 15 registros Modbus (01–15)

### 1.4.4 (2026-03-12)
* Widget flujo de energía: etiqueta SOC y valor desplazados 5px hacia arriba

### 1.3.4 (2026-03-12)
* common.news reducido a la versión actual (solo 1.3.4)

### 1.3.3 (2026-03-12)
* README.md principal traducido al inglés

### 1.3.2 (2026-03-12)
* Documentación añadida en README.md — multilingüe (RU, NL, FR)

### 1.3.1 (2026-03-12)
* Documentación alemana añadida en doc/de/README.md
* README: sección de documentación con enlaces de idioma añadida

### 1.3.0 (2026-03-12)
* Widget flujo de energía: animación de red convertida a dos rutas separadas (consumo/inyección)
* Widget flujo de energía: auto-start-reverse completamente eliminado — todas las direcciones mediante rutas separadas

### 1.2.9 (2026-03-12)
* Widget flujo de energía: punto de anclaje de ruta de batería y=75 → y=71

### 1.2.8 (2026-03-12)
* Widget flujo de energía: flecha de batería posicionada debajo de las cifras durante la carga
* Widget flujo de energía: tamaño de fuente de los valores aumentado de 10.5 a 12.5

### 1.2.7 (2026-03-12)
* Widget flujo de energía: dirección de batería completamente rediseñada — dos rutas separadas (carga/descarga) reemplazan el auto-start-reverse defectuoso

### 1.2.6 (2026-03-12)
* Widget flujo de energía: animación y flecha de red invertidas
* Widget flujo de energía: animación y flecha de batería invertidas

### 1.2.5 (2026-03-12)
* Widget flujo de energía: dirección de flecha de batería invertida

### 1.2.4 (2026-03-11)
* `common.mode` cambiado a `none`

### 1.2.3 (2026-03-11)
* `common.mode` cambiado a `once`

### 1.2.2 (2026-03-11)
* Correcciones

### 1.2.1 (2026-03-11)
* Corrección README.md

### 1.2.0 (2026-03-11)
* README: capturas de pantalla de widgets añadidas para los 7 widgets
* Carpeta `img/` con capturas de pantalla incluida en package.json files

### 1.1.9 (2026-03-11)
* Widget flujo de energía: punta de flecha de batería corregida

### 1.1.8 (2026-03-11)
* Widget flujo de energía: dirección de flecha de batería corregida

### 1.1.7 (2026-03-10)
* W1084 corregido: `common.title` obsoleto eliminado

### 1.1.6 (2026-03-10)
* `title` añadido en io-package.json

### 1.1.5 (2026-03-10)
* `vis` añadido a `restartAdapters` en io-package.json

### 1.1.4 (2026-03-10)
* W1068 corregido: `ioBroker` eliminado de los keywords

### 1.1.3 (2026-03-10)
* Keyword `ioBroker` añadido en io-package.json

### 1.1.2 (2026-03-10)
* `admin/` añadido al campo `files` de package.json — el PNG del icono se instala ahora correctamente

### 1.1.1 (2026-03-10)
* E1012 corregido: `icon` = nombre de archivo, `extIcon` = GitHub Raw URL idéntica

### 1.1.0 (2026-03-10)
* Icono incorporado como Base64-Data-URI en io-package.json

### 1.0.9 (2026-03-10)
* Resolución del icono corregida a 512×512 px

### 1.0.8 (2026-03-10)
* `extIcon` corregido con GitHub Raw URL (E1012)

### 1.0.7 (2026-03-10)
* Vinculación del icono corregida

### 1.0.6 (2026-03-10)
* Logo Sigenergy añadido como icono del adaptador

### 1.0.5 (2026-03-09)
* Correcciones
### 1.0.4 (2026-03-09)
* Correcciones
### 1.0.3 (2026-03-09)
* Correcciones
### 1.0.2 (2026-03-09)
* Correcciones
### 1.0.1 (2026-03-09)
* (ssbingo) 4 widgets creados en formato conforme VIS-2
* (ssbingo) Diagrama de flujo de energía con animaciones SVG
* (ssbingo) Widget estado de la batería y previsiones
* (ssbingo) Widget potencia en tiempo real
* (ssbingo) Widget estadísticas de energía

## Licencia
MIT License

Copyright (c) 2026 ssbingo <s.sternitzke@online.de>

Por la presente se concede permiso, de forma gratuita, a cualquier persona que obtenga
una copia de este software y de los archivos de documentación asociados (el «Software»),
para utilizar el Software sin restricciones, incluyendo sin limitación los derechos a usar,
copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del Software,
y para permitir a las personas a quienes se les proporcione el Software que lo hagan,
sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso se incluirán en todas las copias
o partes sustanciales del Software.

EL SOFTWARE SE PROPORCIONA «TAL CUAL», SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O IMPLÍCITA,
INCLUYENDO PERO NO LIMITADO A LAS GARANTÍAS DE COMERCIABILIDAD, IDONEIDAD PARA UN PROPÓSITO
PARTICULAR Y NO INFRACCIÓN.

## Documentación

- 🇪🇸 [Español](../../doc/es/README.md) — este archivo
- 🇩🇪 [Deutsch](../../doc/de/README.md)
- 🇬🇧 [English](../../README.md)
- 🇷🇺 [Русский](../../doc/ru/README.md)
- 🇳🇱 [Nederlands](../../doc/nl/README.md)
- 🇫🇷 [Français](../../doc/fr/README.md)
- 🇮🇹 [Italiano](../../doc/it/README.md)
- 🇵🇱 [Polski](../../doc/pl/README.md)
- 🇵🇹 [Português](../../doc/pt/README.md)
