import { daggerheart } from '../../helpers/config.mjs';
import { DaggerheartItemSheet } from './item-sheet.mjs';

const { HandlebarsApplicationMixin } = foundry.applications.api;

export class DaggerheartClassSheet extends HandlebarsApplicationMixin(DaggerheartItemSheet) {
    static DEFAULT_OPTIONS = {
        classes: ['daggerheart', 'item', 'class'],
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
        header: { template: 'systems/daggerheart/templates/items/class/header.hbs' },
        tabs: { template: 'systems/daggerheart/templates/items/global/partials/tab-navigation.hbs' },
        description: {
            template: 'systems/daggerheart/templates/items/global/tabs/description.hbs',
            scrollable: ['.description']
        },
        featureSection: {
            template: 'systems/daggerheart/templates/items/global/tabs/feature-section.hbs',
            scrollable: ['.features']
        },
        tiersSection: {
            template: 'systems/daggerheart/templates/items/class/partials/tiers-section.hbs',
            scrollable: ['.tiers']
        },
        settings: {
            template: 'systems/daggerheart/templates/items/class/partials/settings.hbs',
            scrollable: ['.settings']
        },
        details: { template: 'systems/daggerheart/templates/items/global/tabs/details.hbs' }
    };

    static TABS = {
        sheet: [
            { id: 'description', group: 'class', label: 'DAGGERHEART.Item.tabs.description' },
            { id: 'features', group: 'class', label: 'DAGGERHEART.Item.tabs.features' },
            { id: 'tiers', group: 'class', label: 'Tiers' },
            { id: 'settings', group: 'class', label: 'DAGGERHEART.Item.tabs.settings' },
            { id: 'details', group: 'class', label: 'DAGGERHEART.Item.tabs.details' }
        ]
    };

    tabGroups = {
        sheet: 'description'
    };

    async _prepareContext(options) {
        return {
            item: this.document,
            source: this.document.toObject(),
            config: daggerheart,
            description: this.document.system.description,
            fields: this.document.system.schema.fields,
            tabs: this.prepareTabs(this.constructor.TABS).sheet
        };
    }
}
