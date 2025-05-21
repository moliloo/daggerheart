import { daggerheart } from '../../helpers/config.mjs';
import { DaggerheartItemSheet } from './item-sheet.mjs';

const { HandlebarsApplicationMixin } = foundry.applications.api;

export class DaggerheartSubclassSheet extends HandlebarsApplicationMixin(DaggerheartItemSheet) {
    static DEFAULT_OPTIONS = {
        classes: ['daggerheart', 'item', 'subclass'],
        position: {
            width: 550,
            height: 700
        },
        window: {
            icon: '',
            resizable: false
        }
    };

    static PARTS = {
        header: { template: 'systems/daggerheart/templates/items/subclass/header.hbs' },
        tabs: { template: 'systems/daggerheart/templates/items/global/partials/tab-navigation.hbs' },
        description: {
            template: 'systems/daggerheart/templates/items/global/tabs/description.hbs',
            scrollable: ['.description']
        },
        settings: {
            template: 'systems/daggerheart/templates/items/subclass/settings.hbs',
            scrollable: ['.settings']
        },
        featureSection: {
            template: 'systems/daggerheart/templates/items/global/tabs/feature-section.hbs',
            scrollable: ['.features']
        },
        details: { template: 'systems/daggerheart/templates/items/global/tabs/details.hbs' },
        effects: {
            template: 'systems/daggerheart/templates/items/global/tabs/effects.hbs',
            scrollable: ['.effects']
        }
    };

    static TABS = {
        sheet: [
            { id: 'description', group: 'subclass', label: 'DAGGERHEART.Item.tabs.description' },
            { id: 'features', group: 'subclass', label: 'DAGGERHEART.Item.tabs.features' },
            { id: 'settings', group: 'subclass', label: 'DAGGERHEART.Item.tabs.settings' },
            { id: 'details', group: 'subclass', label: 'DAGGERHEART.Item.tabs.details' },
            { id: 'effects', group: 'subclass', label: 'DAGGERHEART.Item.tabs.effects' }
        ]
    };

    async _prepareContext(options) {
        return {
            item: this.document,
            source: this.document.toObject(),
            config: daggerheart,
            description: this.document.system.description,
            fields: this.document.system.schema.fields,
            tabs: this.prepareTabs(this.constructor.TABS).sheet,
            effects: this.prepareActiveEffectCategories(this.item.effects)
        };
    }
}
