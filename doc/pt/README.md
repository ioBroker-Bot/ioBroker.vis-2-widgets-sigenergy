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
Contém 8 widgets para visualização e controlo do fluxo de energia, estado da bateria, potência em tempo real, estatísticas diárias, carregador AC, carregador DC, inversor e visão geral dos micro-inversores SigenMicro. para visualização e controlo do fluxo de energia, estado da bateria, potência em tempo real, estatísticas diárias, carregador AC, carregador DC e inversor.

## Requisitos

- ioBroker com o adaptador `sigenergy` instalado e configurado
- Adaptador ioBroker VIS-2 (≥ 2.0.0)

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

### Visão geral SigenMicro
Visão geral e detalhe de todos os micro-inversores SigenMicro no barramento Modbus. O separador 1 mostra todos os dispositivos como segmento de rede animado (topologia de barramento Ethernet com derivações verticais).

#### Layout dinâmico
| Dispositivos | Linhas | Tamanho imagem |
|---|---|---|
| 1–5 | 1 linha | 80 × 90 px |
| 6–10 | 1 linha | 52 × 60 px |
| 11–15 | 2 linhas | 46 × 52 px |
| 16–20 | 2 linhas | 40 × 46 px |

## Aparência

Todos os widgets suportam um **modo claro e escuro**, comutável através da definição do widget `Modo escuro`.

## Changelog
### 1.6.18 (2026-04-17)
* (ssbingo) Títulos de widgets unificados: Energy Flow, Battery Status, Statistics e PV Power agora compartilham tamanho idêntico (0.9rem, 600)

### 1.6.17 (2026-04-17)
* (ssbingo) Widget 9 PV Power: valores movidos mais 10% para cima (agora 30%), cor do texto cinza quando ≤0.1 kW

### 1.6.16 (2026-04-17)
* (ssbingo) Widget 9 PV Power: valores movidos 10% para cima nos painéis para melhor visibilidade

### 1.6.15 (2026-04-17)
* (ssbingo) Widget 9 PV Power: nomes de strings configuráveis, valores centralizados nos painéis, cores de setas por limiar (<1kW laranja, <2kW amarelo, >2kW verde)

### 1.6.14 (2026-04-16)
* (ssbingo) Corrigido erro de sintaxe JavaScript no widget SigenMicro (aspas triplas) que impedia o carregamento de todos os widgets

### 1.6.14 (2026-04-16)
* (ssbingo) Widget 9: PV Power adicionado com exibição de 3 strings PV e setas de fluxo animadas

### 1.6.7 (2026-04-09)
* (ssbingo) Sintaxe cooldown do dependabot.yml corrigida (default-days em vez de default)

### 1.6.6 (2026-04-09)
* (ssbingo) Entradas antigas do changelog movidas para CHANGELOG_OLD.md; cooldown do Dependabot adicionado (7 dias)

### 1.6.5 (2026-04-09)
* (ssbingo) Job adapter-tests removido do workflow (não aplicável a adaptador widget VIS); deploy usa agora Node.js 24

### 1.6.4 (2026-03-26)
* (ssbingo) test:integration restaurado como no-op (exigido pelo testing-action-adapter; sem processo Node.js no adaptador widget mode:none)

### 1.6.3 (2026-03-26)
* (ssbingo) Sincronizados todos os READMEs de idiomas com entradas de changelog em falta (1.5.10–1.6.2)

### 1.6.2 (2026-03-26)
* (ssbingo) Teste de integração removido — não aplicável para adaptador widget com mode:none (sem processo Node.js principal)

### 1.6.1 (2026-03-26)
* (ssbingo) Configuração ESLint/Prettier removida — sem código Node.js para verificar num adaptador de widget puro; passo lint removido do workflow

### 1.6.0 (2026-03-26)
* (ssbingo) Testes concluídos

### 1.5.11 (2026-03-26)
* (ssbingo) Workflow: install-command definido como npm install (regeneração do lock file necessária após adicionar @iobroker/eslint-config)

### 1.5.10 (2026-03-26)
* (ssbingo) README.md: secção LICENSE movida para o fim (após CHANGELOG), texto completo da licença MIT

### 1.5.8 (2026-03-18)
* (ssbingo) fixed GitHub-Actions (PR)

### 1.5.7 (2026-03-18)
* (ssbingo) Secção '## Instalação' removida de todos os ficheiros README (S6014)

### 1.5.6 (2026-03-18)
* (ssbingo) Incremento de versão para 1.5.6; sem alterações funcionais

### 1.5.5 (2026-03-18)
* (ssbingo) Incremento de versão: 1.5.4 já estava publicada no npm; sem alterações funcionais

### 1.5.4 (2026-03-18)
* (ssbingo) npm-token adicionado ao workflow test-and-release para publicação npm automática

### 1.5.3 (2026-03-17)
* (ssbingo) Removidos os passos de instalação de exemplo de todos os ficheiros README
* (ssbingo) Corrigido E1111: configuração native de exemplo (option1/option2) removida do io-package.json

### 1.5.2 (2026-03-17)
* (ssbingo) Capturas de ecrã de widgets adicionadas: visão geral SigenMicro
* (ssbingo) Captura do fluxo de energia atualizada

### 1.5.1 (2026-03-17)
* (ssbingo) Bugfix: Widget 8 code placed correctly inside vis.binds object — all widgets visible again

### 1.5.0 (2026-03-17)
* (ssbingo) Widget 8: visão geral SigenMicro com topologia de barramento Ethernet animada
* (ssbingo) Layout dinâmico para 1–20 micro-inversores, 4 níveis de tamanho, 1–2 linhas
* (ssbingo) Separador de detalhe por dispositivo com todos os 15 registos Modbus (01–15)

### 1.4.4 (2026-03-12)
* Widget fluxo de energia: etiqueta SOC e valor deslocados 5px para cima

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
