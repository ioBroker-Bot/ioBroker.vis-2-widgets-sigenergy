# Older Changelog

### 1.7.0 (2026-04-17)
* (ssbingo) Widget 9: PV Power added with 3 PV string display and animated flow arrows

### 1.6.7 (2026-04-09)
* (ssbingo) Fixed dependabot.yml cooldown syntax (default-days instead of default)

### 1.6.6 (2026-04-09)
* (ssbingo) Moved old changelog entries to CHANGELOG_OLD.md; added Dependabot cooldown (7 days)

### 1.6.5 (2026-04-09)
* (ssbingo) Removed adapter-tests job from workflow (not applicable for VIS widget adapter); deploy now uses Node.js 24

### 1.6.4 (2026-03-26)
* (ssbingo) Restored test:integration as no-op (required by testing-action-adapter; no Node.js process in mode:none widget adapter)

### 1.6.3 (2026-03-26)
* (ssbingo) Sync all language READMEs with missing changelog entries (1.5.10–1.6.2)

### 1.6.2 (2026-03-26)
* (ssbingo) Removed integration test — not applicable for mode:none widget adapter (no Node.js main process)

### 1.6.1 (2026-03-26)
* (ssbingo) Removed ESLint/Prettier setup — no Node.js source to lint in a pure widget adapter; removed lint step from workflow

### 1.6.0 (2026-03-26)
* (ssbingo) Test completed

### 1.5.11 (2026-03-26)
* (ssbingo) Workflow: install-command set to npm install (package-lock.json regeneration required after adding @iobroker/eslint-config)

### 1.5.10 (2026-03-26)
* (ssbingo) README.md: LICENSE section moved to end (after CHANGELOG), full MIT licence text

### 1.5.8 (2026-03-18)
* (ssbingo) fixed GitHub-Actions (PR)

### 1.5.7 (2026-03-18)
* (ssbingo) Removed '## Installation' section from all README files (S6014)

### 1.5.6 (2026-03-18)
* (ssbingo) Version bump to 1.5.6; no functional changes

### 1.5.5 (2026-03-18)
* (ssbingo) Version bump: 1.5.4 was already published on npm; no functional changes

### 1.5.4 (2026-03-18)
* (ssbingo) Added npm-token to test-and-release workflow to enable automated npm publishing

### 1.5.3 (2026-03-17)
* (ssbingo) Removed example installation steps from all README files
* (ssbingo) Fixed E1111: cleared native example config (option1/option2) from io-package.json

### 1.5.2 (2026-03-17)
* (ssbingo) Widget screenshots added: SigenMicro Overview (widget-microinverter_01.png, widget-microinverter_02.png)
* (ssbingo) Energy Flow screenshot updated (widget-energiefluss.png)

### 1.5.1 (2026-03-17)
* (ssbingo) Bugfix: Widget 8 code placed correctly inside vis.binds object — all widgets visible again

### 1.5.0 (2026-03-17)
* (ssbingo) Widget 8: SigenMicro Overview with animated Ethernet bus topology (backbone + vertical drop lines)
* (ssbingo) Dynamic layout for 1-20 micro-inverters, 4 size tiers, 1-2 rows
* (ssbingo) Detail tab per device with all 15 Modbus registers (01-15, ascending by address)
* (ssbingo) VIS-2-compliant Anchor-OID pattern: oid_micro(1-micro_count)/id
* (ssbingo) SigenMicroInverter.png added to widget image folder
* (ssbingo) CSS keyframes sig-sm-bus and sig-sm-stub for line-based dash animation

### 1.4.4 (2026-03-12)
* Energy flow widget: SOC label and value shifted 5px upward

### 1.3.2 (2026-03-12)
* Documentation added to README.md - multilingual (RU, NL, FR)

### 1.3.1 (2026-03-12)
* Documentation added: German README under doc/de/README.md
* README: documentation section with language links added

### 1.3.0 (2026-03-12)
* Energy flow widget: grid animation converted to two separate paths (consumption/feed-in)
* Energy flow widget: auto-start-reverse fully removed — all directions via separate paths

### 1.2.9 (2026-03-12)
* Energy flow widget: battery path anchor point y=75 → y=71

### 1.2.8 (2026-03-12)
* Energy flow widget: battery arrow positioned below digits when charging
* Energy flow widget: font size of value labels increased from 10.5 to 12.5

### 1.2.7 (2026-03-12)
* Energy flow widget: battery direction fully reworked — two separate paths (charge/discharge) replace faulty auto-start-reverse

### 1.2.6 (2026-03-12)
* Energy flow widget: grid animation and arrow reversed
* Energy flow widget: battery animation and arrow reversed

### 1.2.5 (2026-03-12)
* Energy flow widget: battery arrow direction inverted

### 1.2.4 (2026-03-11)
* `common.mode` changed to `none`

### 1.2.3 (2026-03-11)
* `common.mode` changed to `once`

### 1.2.2 (2026-03-11)
* fixes

### 1.2.1 (2026-03-11)
* README.md correction

### 1.2.0 (2026-03-11)
* README: widget screenshots added for all 7 widgets
* `img/` folder with screenshots added to package.json files

### 1.1.9 (2026-03-11)
* Energy flow widget: battery arrow head corrected — charging points to battery (marker-start-reverse), discharging to centre (marker-end)
* CSS: `@keyframes sig-dash-reverse` and class `.active.reverse` added for reverse path animation

### 1.1.8 (2026-03-11)
* Energy flow widget: battery arrow direction corrected (charging vs. discharging was swapped)

### 1.1.7 (2026-03-10)
* W1084 fixed: deprecated `common.title` removed

### 1.1.6 (2026-03-10)
* `title`: "SigenEnergy Widgets" added in io-package.json

### 1.1.5 (2026-03-10)
* `vis` added to `restartAdapters` in io-package.json

### 1.1.4 (2026-03-10)
* W1068 fixed: `ioBroker` removed from keywords

### 1.1.3 (2026-03-10)
* Keyword `ioBroker` added in io-package.json

### 1.1.2 (2026-03-10)
* `admin/` added to `files` field in package.json — icon PNG now installed correctly

### 1.1.1 (2026-03-10)
* E1012 fixed: `icon` = filename, `extIcon` = identical GitHub raw URL

### 1.1.0 (2026-03-10)
* Icon embedded as Base64-Data-URI in io-package.json — independent of admin folder serving

### 1.0.9 (2026-03-10)
* Icon resolution corrected to 512×512 px (was 64×64 px)

### 1.0.8 (2026-03-10)
* `extIcon` corrected to GitHub raw URL (E1012)

### 1.0.7 (2026-03-10)
* Icon integration corrected: `icon` as filename, `extIcon` as Base64-URI

### 1.0.6 (2026-03-10)
* Sigenergy logo added as adapter icon

### 1.0.5 (2026-03-09)
* corrections
### 1.0.4 (2026-03-09)
* corrections
### 1.0.3 (2026-03-09)
* corrections
### 1.0.2 (2026-03-09)
* corrections
### 1.0.1 (2026-03-09)
* (ssbingo) 4 widgets created in VIS-2-compliant format
* (ssbingo) Energy flow diagram with SVG animations
* (ssbingo) Battery status & forecasts widget
* (ssbingo) Real-time power widget
* (ssbingo) Energy statistics widget

