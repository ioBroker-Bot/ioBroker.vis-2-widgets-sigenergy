/* eslint no-unused-vars: off */
/* eslint no-global-assign: off */
/* global systemDictionary */
'use strict';

systemDictionary = {
    /* ── Gruppen ── */
    'group_oids': {
        'en': 'OID Assignments', 'de': 'OID-Zuweisungen',
        'ru': 'Назначение OID', 'fr': 'Affectations OID',
        'it': 'Assegnazioni OID', 'es': 'Asignaciones OID',
        'pl': 'Przypisania OID', 'nl': 'OID toewijzingen',
        'pt': 'Atribuições OID', 'uk': 'Призначення OID', 'zh-cn': 'OID 分配'
    },
    'group_appear': {
        'en': 'Appearance', 'de': 'Darstellung',
        'ru': 'Внешний вид', 'fr': 'Apparence',
        'it': 'Aspetto', 'es': 'Apariencia',
        'pl': 'Wygląd', 'nl': 'Uiterlijk',
        'pt': 'Aparência', 'uk': 'Зовнішній вигляд', 'zh-cn': '外观'
    },

    /* ── OID-Felder ── */
    'oid_pv': {
        'en': 'OID — PV Power (kW)', 'de': 'OID — PV-Leistung (kW)',
        'ru': 'OID — Мощность ФЭ (кВт)', 'fr': 'OID — Puissance PV (kW)',
        'it': 'OID — Potenza FV (kW)', 'es': 'OID — Potencia FV (kW)',
        'pl': 'OID — Moc PV (kW)', 'nl': 'OID — PV vermogen (kW)',
        'pt': 'OID — Potência FV (kW)', 'uk': 'OID — Потужність СЕС (кВт)', 'zh-cn': 'OID — 光伏功率 (kW)'
    },
    'oid_bat': {
        'en': 'OID — Battery Power (kW)', 'de': 'OID — Batterie-Leistung (kW)',
        'ru': 'OID — Мощность АКБ (кВт)', 'fr': 'OID — Puissance batterie (kW)',
        'it': 'OID — Potenza batteria (kW)', 'es': 'OID — Potencia batería (kW)',
        'pl': 'OID — Moc akumulatora (kW)', 'nl': 'OID — Batterijvermogen (kW)',
        'pt': 'OID — Potência bateria (kW)', 'uk': 'OID — Потужність АКБ (кВт)', 'zh-cn': 'OID — 电池功率 (kW)'
    },
    'oid_grid': {
        'en': 'OID — Grid Power (kW)', 'de': 'OID — Netz-Leistung (kW)',
        'ru': 'OID — Мощность сети (кВт)', 'fr': 'OID — Puissance réseau (kW)',
        'it': 'OID — Potenza rete (kW)', 'es': 'OID — Potencia red (kW)',
        'pl': 'OID — Moc sieci (kW)', 'nl': 'OID — Netwerkvermogen (kW)',
        'pt': 'OID — Potência rede (kW)', 'uk': 'OID — Потужність мережі (кВт)', 'zh-cn': 'OID — 电网功率 (kW)'
    },
    'oid_house': {
        'en': 'OID — House Consumption (kW)', 'de': 'OID — Haus-Verbrauch (kW)',
        'ru': 'OID — Потребление дома (кВт)', 'fr': 'OID — Consommation maison (kW)',
        'it': 'OID — Consumo casa (kW)', 'es': 'OID — Consumo casa (kW)',
        'pl': 'OID — Zużycie domu (kW)', 'nl': 'OID — Huisverbruik (kW)',
        'pt': 'OID — Consumo casa (kW)', 'uk': 'OID — Споживання будинку (кВт)', 'zh-cn': 'OID — 家庭用电 (kW)'
    },
    'oid_soc': {
        'en': 'OID — Battery SOC (%)', 'de': 'OID — Batterie-Ladung (%)',
        'ru': 'OID — СОЗ батареи (%)', 'fr': 'OID — SOC batterie (%)',
        'it': 'OID — SOC batteria (%)', 'es': 'OID — SOC batería (%)',
        'pl': 'OID — SOC akumulatora (%)', 'nl': 'OID — Accu SOC (%)',
        'pt': 'OID — SOC bateria (%)', 'uk': 'OID — СОЗ АКБ (%)', 'zh-cn': 'OID — 电池 SOC (%)'
    },
    'oid_soh': {
        'en': 'OID — Battery Health SOH (%)', 'de': 'OID — Batterie-Gesundheit SOH (%)',
        'ru': 'OID — Здоровье АКБ (%)', 'fr': 'OID — Santé batterie SOH (%)',
        'it': 'OID — Salute batteria SOH (%)', 'es': 'OID — Salud batería SOH (%)',
        'pl': 'OID — Zdrowie akumulatora SOH (%)', 'nl': 'OID — Accu gezondheid SOH (%)',
        'pt': 'OID — Saúde bateria SOH (%)', 'uk': 'OID — Здоров\'я АКБ (%)', 'zh-cn': 'OID — 电池健康度 SOH (%)'
    },
    'oid_ttf': {
        'en': 'OID — Time to Full (min)', 'de': 'OID — Zeit bis Voll (min)',
        'ru': 'OID — Время до заряда (мин)', 'fr': 'OID — Temps avant plein (min)',
        'it': 'OID — Tempo a pieno (min)', 'es': 'OID — Tiempo hasta lleno (min)',
        'pl': 'OID — Czas do naładowania (min)', 'nl': 'OID — Tijd tot vol (min)',
        'pt': 'OID — Tempo para cheio (min)', 'uk': 'OID — Час до повного заряду (хв)', 'zh-cn': 'OID — 充满时间 (分钟)'
    },
    'oid_ttr': {
        'en': 'OID — Time Remaining (min)', 'de': 'OID — Restlaufzeit (min)',
        'ru': 'OID — Оставшееся время (мин)', 'fr': 'OID — Temps restant (min)',
        'it': 'OID — Tempo rimanente (min)', 'es': 'OID — Tiempo restante (min)',
        'pl': 'OID — Pozostały czas (min)', 'nl': 'OID — Resterende tijd (min)',
        'pt': 'OID — Tempo restante (min)', 'uk': 'OID — Залишковий час (хв)', 'zh-cn': 'OID — 剩余时间 (分钟)'
    },
    'oid_sc': {
        'en': 'OID — Self Consumption (%)', 'de': 'OID — Eigenverbrauch (%)',
        'ru': 'OID — Самопотребление (%)', 'fr': 'OID — Autoconsommation (%)',
        'it': 'OID — Autoconsumo (%)', 'es': 'OID — Autoconsumo (%)',
        'pl': 'OID — Autokonsumpcja (%)', 'nl': 'OID — Eigenverbruik (%)',
        'pt': 'OID — Autoconsumo (%)', 'uk': 'OID — Власне споживання (%)', 'zh-cn': 'OID — 自用率 (%)'
    },
    'oid_aut': {
        'en': 'OID — Autarky Rate (%)', 'de': 'OID — Autarkierate (%)',
        'ru': 'OID — Уровень автономии (%)', 'fr': 'OID — Taux d\'autarcie (%)',
        'it': 'OID — Tasso di autonomia (%)', 'es': 'OID — Tasa de autarquía (%)',
        'pl': 'OID — Wskaźnik autarkii (%)', 'nl': 'OID — Autarkiegraad (%)',
        'pt': 'OID — Taxa de autarquia (%)', 'uk': 'OID — Рівень автономії (%)', 'zh-cn': 'OID — 自给率 (%)'
    },
    'oid_maxsoc': {
        'en': 'OID — Day Max SOC (%)', 'de': 'OID — Tages-Maximum SOC (%)',
        'ru': 'OID — Макс. СОЗ за день (%)', 'fr': 'OID — SOC max journalier (%)',
        'it': 'OID — SOC max giornaliero (%)', 'es': 'OID — SOC máximo diario (%)',
        'pl': 'OID — Maks. SOC dzienny (%)', 'nl': 'OID — Dagelijks max SOC (%)',
        'pt': 'OID — SOC máx diário (%)', 'uk': 'OID — Макс. СОЗ за день (%)', 'zh-cn': 'OID — 日最大 SOC (%)'
    },
    'oid_minsoc': {
        'en': 'OID — Day Min SOC (%)', 'de': 'OID — Tages-Minimum SOC (%)',
        'ru': 'OID — Мин. СОЗ за день (%)', 'fr': 'OID — SOC min journalier (%)',
        'it': 'OID — SOC min giornaliero (%)', 'es': 'OID — SOC mínimo diario (%)',
        'pl': 'OID — Min. SOC dzienny (%)', 'nl': 'OID — Dagelijks min SOC (%)',
        'pt': 'OID — SOC mín diário (%)', 'uk': 'OID — Мін. СОЗ за день (%)', 'zh-cn': 'OID — 日最小 SOC (%)'
    },
    'oid_charg': {
        'en': 'OID — Daily Charge Energy (kWh)', 'de': 'OID — Tages-Ladeenergie (kWh)',
        'ru': 'OID — Дневной заряд (кВт·ч)', 'fr': 'OID — Énergie charge journalière (kWh)',
        'it': 'OID — Energia carica giornaliera (kWh)', 'es': 'OID — Energía carga diaria (kWh)',
        'pl': 'OID — Dzienna energia ładowania (kWh)', 'nl': 'OID — Dagelijkse laadenergie (kWh)',
        'pt': 'OID — Energia carregamento diário (kWh)', 'uk': 'OID — Добова енергія заряду (кВт·год)', 'zh-cn': 'OID — 日充电量 (kWh)'
    },
    'oid_discharg': {
        'en': 'OID — Daily Discharge Energy (kWh)', 'de': 'OID — Tages-Entladeenergie (kWh)',
        'ru': 'OID — Дневной разряд (кВт·ч)', 'fr': 'OID — Énergie décharge journalière (kWh)',
        'it': 'OID — Energia scarica giornaliera (kWh)', 'es': 'OID — Energía descarga diaria (kWh)',
        'pl': 'OID — Dzienna energia rozładowania (kWh)', 'nl': 'OID — Dagelijkse ontlaadenergie (kWh)',
        'pt': 'OID — Energia descarga diária (kWh)', 'uk': 'OID — Добова енергія розряду (кВт·год)', 'zh-cn': 'OID — 日放电量 (kWh)'
    },
    'oid_covtime': {
        'en': 'OID — Battery Coverage Time (min)', 'de': 'OID — Batteriedeckungszeit (min)',
        'ru': 'OID — Время покрытия АКБ (мин)', 'fr': 'OID — Temps couverture batterie (min)',
        'it': 'OID — Tempo copertura batteria (min)', 'es': 'OID — Tiempo cobertura batería (min)',
        'pl': 'OID — Czas pokrycia baterii (min)', 'nl': 'OID — Accudekking tijd (min)',
        'pt': 'OID — Tempo cobertura bateria (min)', 'uk': 'OID — Час покриття АКБ (хв)', 'zh-cn': 'OID — 电池覆盖时间 (分钟)'
    },
    'oid_chargt': {
        'en': 'OID — Daily Charge Time (min)', 'de': 'OID — Tages-Ladezeit (min)',
        'ru': 'OID — Время зарядки за день (мин)', 'fr': 'OID — Temps de charge journalier (min)',
        'it': 'OID — Tempo di carica giornaliero (min)', 'es': 'OID — Tiempo de carga diario (min)',
        'pl': 'OID — Dzienny czas ładowania (min)', 'nl': 'OID — Dagelijkse laadtijd (min)',
        'pt': 'OID — Tempo carregamento diário (min)', 'uk': 'OID — Добовий час заряду (хв)', 'zh-cn': 'OID — 日充电时间 (分钟)'
    },

    /* ── Darstellungsoptionen ── */
    'sig_title': {
        'en': 'Widget Title', 'de': 'Widget-Titel',
        'ru': 'Заголовок виджета', 'fr': 'Titre du widget',
        'it': 'Titolo widget', 'es': 'Título del widget',
        'pl': 'Tytuł widżetu', 'nl': 'Widget titel',
        'pt': 'Título do widget', 'uk': 'Заголовок віджета', 'zh-cn': '组件标题'
    },
    'sig_darkmode': {
        'en': 'Dark Mode', 'de': 'Dunkelmodus',
        'ru': 'Тёмный режим', 'fr': 'Mode sombre',
        'it': 'Modalità scura', 'es': 'Modo oscuro',
        'pl': 'Tryb ciemny', 'nl': 'Donkere modus',
        'pt': 'Modo escuro', 'uk': 'Темний режим', 'zh-cn': '深色模式'
    },
    'sig_animation': {
        'en': 'Animate Energy Flow', 'de': 'Energiefluss animieren',
        'ru': 'Анимация потока энергии', 'fr': 'Animer le flux d\'énergie',
        'it': 'Anima flusso energetico', 'es': 'Animar flujo de energía',
        'pl': 'Animuj przepływ energii', 'nl': 'Energiestroom animeren',
        'pt': 'Animar fluxo de energia', 'uk': 'Анімувати потік енергії', 'zh-cn': '动画能量流'
    },
};
