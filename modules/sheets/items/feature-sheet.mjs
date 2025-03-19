import { daggerheart } from '../../helpers/config.mjs';
import { DaggerheartItemSheet } from './item-sheet.mjs';

const { HandlebarsApplicationMixin } = foundry.applications.api;

export class DaggerheartFeatureSheet extends HandlebarsApplicationMixin(DaggerheartItemSheet) {
    get title() {
        return this.item.isToken ? `[Token] ${this.item.name}` : this.item.name;
    }

    static DEFAULT_OPTIONS = {
        tag: 'form',
        form: {
            submitOnChange: true
        },
        classes: ['daggerheart', 'item', 'feature'],
        position: {
            width: 450,
            height: 700
        },
        window: {
            icon: '',
            resizable: false
        },
        dragDrop: [
            {
                dragSelector: '[data-drag]',
                dropSelector: null
            }
        ],
        actions: {}
    };

    static PARTS = {
        header: { template: 'systems/daggerheart/templates/items/feature/header.hbs' },
        tabs: { template: 'systems/daggerheart/templates/items/feature/tab-navigation.hbs' },
        description: { template: 'systems/daggerheart/templates/items/feature/description.hbs' },
        settings: { template: 'systems/daggerheart/templates/items/feature/settings.hbs', scrollable: ['.settings'] },
        details: { template: 'systems/daggerheart/templates/items/feature/details.hbs' },
        effects: { template: 'systems/daggerheart/templates/items/feature/effects.hbs', scrollable: ['.effects'] }
    };

    static TABS = {
        sheet: [
            { id: 'description', group: 'feature', label: 'DAGGERHEART.Feature.tabs.description' },
            { id: 'settings', group: 'feature', label: 'DAGGERHEART.Feature.tabs.settings' },
            { id: 'details', group: 'feature', label: 'DAGGERHEART.Feature.tabs.details' },
            { id: 'effects', group: 'feature', label: 'DAGGERHEART.Feature.tabs.effects' }
        ]
    };

    tabGroups = {
        sheet: 'description'
    };

    #prepareTabs() {
        const tabs = {};
        for (const [groupId, config] of Object.entries(this.constructor.TABS)) {
            const group = {};
            for (const t of config) {
                if (!this.tabGroups[t.group]) this.tabGroups[t.group] = t.id;
                const active = this.tabGroups[t.group] === t.id;
                group[t.id] = Object.assign({ active, cssClass: active ? 'active' : '' }, t);
            }
            tabs[groupId] = group;
        }
        if (!game.user.isGM) delete tabs.sheet.hooks;
        return tabs;
    }

    async _prepareContext(options) {
        return {
            item: this.document,
            source: this.document.toObject(),
            config: daggerheart,
            description: this.document.system.description,
            fields: this.document.system.schema.fields,
            effects: this.prepareActiveEffectCategories(this.item.effects),
            tabs: this.#prepareTabs().sheet
        };
    }
}
