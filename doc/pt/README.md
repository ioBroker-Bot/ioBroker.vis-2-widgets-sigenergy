![Logo](../../admin/vis-2-widgets-sigenergy.png)
# ioBroker.vis-2-widgets-sigenergy

[![Versão NPM](https://img.shields.io/npm/v/iobroker.vis-2-widgets-sigenergy.svg)](https://www.npmjs.com/package/iobroker.vis-2-widgets-sigenergy)
[![Transferências](https://img.shields.io/npm/dm/iobroker.vis-2-widgets-sigenergy.svg)](https://www.npmjs.com/package/iobroker.vis-2-widgets-sigenergy)
![Número de instalações](https://iobroker.live/badges/vis-2-widgets-sigenergy-installed.svg)
![Versão atual no repositório estável](https://iobroker.live/badges/vis-2-widgets-sigenergy-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.vis-2-widgets-sigenergy.png?downloads=true)](https://nodei.co/npm/iobroker.vis-2-widgets-sigenergy/)

**Testes:** ![Teste e lançamento](https://github.com/ssbingo/ioBroker.vis-2-widgets-sigenergy/workflows/Test%20and%20Release/badge.svg)

## Adaptador vis-2-widgets-sigenergy para ioBroker

Conjunto de widgets VIS-2 para o adaptador de armazenamento de energia Sigenergy (`ioBroker.sigenergy`).
Contém 7 widgets para visualização e controlo do fluxo de energia, estado da bateria, potência em tempo real, estatísticas diárias, carregador AC, carregador DC e inversor.

## Requisitos

- ioBroker com o adaptador `sigenergy` instalado e configurado
- Adaptador ioBroker VIS-2 (≥ 2.0.0)

## Instalação

Instalar o adaptador através do ioBroker Admin como ficheiro ZIP:

1. Admin → Adaptadores → «Instalar a partir de URL personalizado» (ícone GitHub)
2. Carregar o ficheiro ZIP ou introduzir o URL
3. Aguardar a conclusão da instalação — o VIS-2 reinicia automaticamente

> **Nota:** Após a instalação é necessário **recarregar o editor VIS-2 no browser**
> (F5 ou atualizar a página) para que os widgets apareçam na paleta.
> O adaptador VIS-2 reinicia automaticamente, mas o browser deve ser
> atualizado manualmente.

## Widgets

### Diagrama de fluxo de energia
Apresenta o fluxo de energia atual entre painéis solares, bateria, rede e casa como um diagrama SVG animado.
Setas animadas visualizam as ligações ativas em tempo real.

**OIDs:** `pvPower`, `essPower`, `gridActivePower`, `housePower`, `essSoc`

![Diagrama de fluxo de energia](../../img/widget-energiefluss.png)

#### Direções do fluxo

| Ponto de dados | Valor > 0 | Valor < 0 |
|---|---|---|
| `essPower` | Bateria a carregar → seta do centro para a bateria | Bateria a descarregar → seta da bateria para o centro |
| `gridActivePower` | Consumo da rede → seta da rede para o centro | Injeção na rede → seta do centro para a rede |
| `pvPower` | PV a produzir → seta do PV para o centro | — |
| `housePower` | Casa a consumir → seta do centro para a casa | — |

### Estado da bateria e previsões
Apresenta SOC, SOH, potência de carga e previsões do tempo até carga completa, autonomia restante, autoconsumo e taxa de autarcia.

**OIDs:** `essSoc`, `essSoh`, `essPower`, `batteryTimeToFull`, `batteryTimeRemaining`, `selfConsumptionRate`, `autarkyRate`

![Estado da bateria e previsões](../../img/widget-batterie.png)

### Potência em tempo real
Vista de lista compacta de todos os valores de potência atuais com indicadores de direção codificados por cor.

**OIDs:** `pvPower`, `essPower`, `gridActivePower`, `housePower`, `essSoc`

![Potência em tempo real](../../img/widget-leistung.png)

### Estatísticas de energia
Resumo diário com taxa de autarcia, autoconsumo, histórico de SOC, energia de carga/descarga e cobertura da bateria.

**OIDs:** `autarkyRate`, `selfConsumptionRate`, `dayMaxSoc`, `dayMinSoc`, `essDailyChargeEnergy`, `essDailyDischargeEnergy`, `batteryCoverageToday`, `batteryDailyChargeTime`

![Estatísticas de energia](../../img/widget-statistiken.png)

### Carregador AC (Sigen EVAC)
Monitorização e controlo do carregador AC Sigenergy (EVAC). Apresenta a potência de carga, o estado do sistema, a potência nominal, a corrente nominal e o consumo total de energia. Os alarmes são realçados a cores. A corrente de carga é ajustável através de um controlo deslizante (6–32 A).

**OIDs:** `acCharger.systemState`, `acCharger.chargingPower`, `acCharger.totalEnergyConsumed`, `acCharger.ratedPower`, `acCharger.ratedCurrent`, `acCharger.alarm1/2/3`, `acCharger.control.startStop`, `acCharger.control.outputCurrent`

![Carregador AC](../../img/widget-ac-charger.png)

### Carregador DC
Monitorização e controlo do carregador DC Sigenergy. Apresenta a potência de saída, o SOC do veículo com barra de progresso, a tensão da bateria do veículo, a corrente de carga e a energia e duração da sessão de carga atual.

**OIDs:** `dcCharger.outputPower`, `dcCharger.vehicleSoc`, `dcCharger.vehicleBatteryVoltage`, `dcCharger.chargingCurrent`, `dcCharger.currentChargingCapacity`, `dcCharger.currentChargingDuration`, `dcCharger.control.startStop`

![Carregador DC](../../img/widget-dc-charger.png)

### Inversor
Monitorização e controlo abrangentes do inversor com navegação por separadores. Apresenta o estado de funcionamento, dados de potência, temperaturas da bateria, tensões de fase, todos os 5 registos de alarme e informações do dispositivo (modelo, número de série, firmware).

| Separador | Conteúdo |
|---|---|
| **Potência** | Potência ativa, potência PV, potência de carga/descarga da bateria, controlo deslizante de quota de potência (de −100 % a +100 %) |
| **Bateria** | SOC e SOH com barras, temperatura/tensão média das células, temperatura máx./mín. |
| **Rede** | Tensões de fase L1/L2/L3, frequência da rede, fator de potência, temperatura interna do PCS |
| **Alarmes** | 5 registos de alarme (PCS ×2, ESS, gateway, carregador DC) com código hex e marcação a cores |
| **Info** | Tipo de modelo, número de série, versão de firmware, comutador Remote-EMS |

![Inversor](../../img/widget-inverter.png)

**OIDs:** `inverter.activePower`, `inverter.pvPower`, `inverter.essChargeDischargePower`, `inverter.runningState`, `inverter.essBatterySoc/Soh`, `inverter.essAvgCellTemperature/Voltage`, `inverter.phaseA/B/CVoltage`, `inverter.gridFrequency`, `inverter.pcsInternalTemp`, `inverter.alarm1–5`, `inverter.firmwareVersion`, `inverter.modelType`, `inverter.serialNumber`, `inverter.control.startStop`, `inverter.control.remoteEmsDispatchEnable`, `inverter.control.activePowerPercent`

## Aparência

Todos os widgets suportam um **modo claro e escuro**, comutável através da definição do widget `Modo escuro`.

## Changelog
### 1.3.5 (2026-03-12)
* Documentação inserida em README.md - multilingue

### 1.3.4 (2026-03-12)
* common.news reduzido à versão atual (apenas 1.3.4)

### 1.3.3 (2026-03-12)
* README.md principal traduzido para inglês

### 1.3.2 (2026-03-12)
* Documentação adicionada ao README.md — multilingue (RU, NL, FR)

### 1.3.1 (2026-03-12)
* Documentação alemã adicionada em doc/de/README.md
* README: secção de documentação com ligações de idioma adicionada

### 1.3.0 (2026-03-12)
* Widget fluxo de energia: animação de rede convertida em dois caminhos separados (consumo/injeção)
* Widget fluxo de energia: auto-start-reverse completamente removido — todas as direções através de caminhos separados

### 1.2.9 (2026-03-12)
* Widget fluxo de energia: ponto de ancoragem do caminho da bateria y=75 → y=71

### 1.2.8 (2026-03-12)
* Widget fluxo de energia: seta da bateria posicionada abaixo dos dígitos durante a carga
* Widget fluxo de energia: tamanho de fonte dos valores aumentado de 10.5 para 12.5

### 1.2.7 (2026-03-12)
* Widget fluxo de energia: direção da bateria completamente redesenhada — dois caminhos separados (carga/descarga) substituem o auto-start-reverse com falha

### 1.2.6 (2026-03-12)
* Widget fluxo de energia: animação e seta da rede invertidas
* Widget fluxo de energia: animação e seta da bateria invertidas

### 1.2.5 (2026-03-12)
* Widget fluxo de energia: direção da seta da bateria invertida

### 1.2.4 (2026-03-11)
* `common.mode` alterado para `none`

### 1.2.3 (2026-03-11)
* `common.mode` alterado para `once`

### 1.2.2 (2026-03-11)
* Correções

### 1.2.1 (2026-03-11)
* Correção README.md

### 1.2.0 (2026-03-11)
* README: capturas de ecrã dos widgets adicionadas para todos os 7 widgets
* Pasta `img/` com capturas de ecrã incluída em package.json files

### 1.1.9 (2026-03-11)
* Widget fluxo de energia: ponta da seta da bateria corrigida

### 1.1.8 (2026-03-11)
* Widget fluxo de energia: direção da seta da bateria corrigida

### 1.1.7 (2026-03-10)
* W1084 corrigido: `common.title` obsoleto removido

### 1.1.6 (2026-03-10)
* `title` adicionado em io-package.json

### 1.1.5 (2026-03-10)
* `vis` adicionado a `restartAdapters` em io-package.json

### 1.1.4 (2026-03-10)
* W1068 corrigido: `ioBroker` removido dos keywords

### 1.1.3 (2026-03-10)
* Keyword `ioBroker` adicionado em io-package.json

### 1.1.2 (2026-03-10)
* `admin/` adicionado ao campo `files` de package.json — PNG do ícone agora instalado corretamente

### 1.1.1 (2026-03-10)
* E1012 corrigido: `icon` = nome do ficheiro, `extIcon` = GitHub Raw URL idêntico

### 1.1.0 (2026-03-10)
* Ícone incorporado como Base64-Data-URI em io-package.json

### 1.0.9 (2026-03-10)
* Resolução do ícone corrigida para 512×512 px

### 1.0.8 (2026-03-10)
* `extIcon` corrigido para GitHub Raw URL (E1012)

### 1.0.7 (2026-03-10)
* Ligação do ícone corrigida

### 1.0.6 (2026-03-10)
* Logo Sigenergy adicionado como ícone do adaptador

### 1.0.5 (2026-03-09)
* Correções
### 1.0.4 (2026-03-09)
* Correções
### 1.0.3 (2026-03-09)
* Correções
### 1.0.2 (2026-03-09)
* Correções
### 1.0.1 (2026-03-09)
* (ssbingo) 4 widgets criados em formato conforme VIS-2
* (ssbingo) Diagrama de fluxo de energia com animações SVG
* (ssbingo) Widget estado da bateria e previsões
* (ssbingo) Widget potência em tempo real
* (ssbingo) Widget estatísticas de energia

## Licença
MIT License

Copyright (c) 2026 ssbingo <s.sternitzke@online.de>

Por meio deste instrumento é concedida permissão, gratuitamente, a qualquer pessoa que obtenha
uma cópia deste software e dos ficheiros de documentação associados (o «Software»), para utilizar
o Software sem restrições, incluindo, sem limitação, os direitos de usar, copiar, modificar,
fundir, publicar, distribuir, sublicenciar e/ou vender cópias do Software, e permitir que as
pessoas a quem o Software seja fornecido o façam, sujeito às seguintes condições:

O aviso de direitos de autor acima e este aviso de permissão devem ser incluídos em todas
as cópias ou partes substanciais do Software.

O SOFTWARE É FORNECIDO «TAL COMO ESTÁ», SEM GARANTIA DE QUALQUER TIPO, EXPRESSA OU IMPLÍCITA,
INCLUINDO, MAS NÃO SE LIMITANDO ÀS GARANTIAS DE COMERCIALIZAÇÃO, ADEQUAÇÃO A UM DETERMINADO
FIM E NÃO VIOLAÇÃO.

## Documentação

- 🇵🇹 [Português](../../doc/pt/README.md) — este ficheiro
- 🇩🇪 [Deutsch](../../doc/de/README.md)
- 🇬🇧 [English](../../README.md)
- 🇷🇺 [Русский](../../doc/ru/README.md)
- 🇳🇱 [Nederlands](../../doc/nl/README.md)
- 🇫🇷 [Français](../../doc/fr/README.md)
- 🇮🇹 [Italiano](../../doc/it/README.md)
- 🇪🇸 [Español](../../doc/es/README.md)
- 🇵🇱 [Polski](../../doc/pl/README.md)
