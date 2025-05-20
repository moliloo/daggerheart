import { daggerheart } from '../../helpers/config.mjs';
import { DaggerheartItemSheet } from './item-sheet.mjs';

const { HandlebarsApplicationMixin } = foundry.applications.api;

export class DaggerheartEquipmentSheet extends HandlebarsApplicationMixin(DaggerheartItemSheet) {
    static DEFAULT_OPTIONS = {
        classes: ['daggerheart', 'item', 'equipment'],
        position: {
            width: 700,
            height: 480
        },
        window: {
            icon: '',
            resizable: true
        }
    };

    static PARTS = {
        header: { template: 'systems/daggerheart/templates/items/equipment/header.hbs' },
        tabs: { template: 'systems/daggerheart/templates/items/global/partials/tab-navigation.hbs' },
        description: {
            template: 'systems/daggerheart/templates/items/global/tabs/description.hbs',
            scrollable: ['.description']
        },
        featureSection: {
            template: 'systems/daggerheart/templates/items/global/tabs/feature-section.hbs',
            scrollable: ['.features']
        },
        settings: {
            template: 'systems/daggerheart/templates/items/equipment/settings.hbs',
            scrollable: ['.settings']
        },
        details: { template: 'systems/daggerheart/templates/items/global/tabs/details.hbs' },
        effects: {
            template: 'systems/daggerheart/templates/items/global/tabs/effects.hbs',
            scrollable: ['.effects']
        }
    };

    static TABS = {
        sheet: [
            { id: 'description', group: 'equipment', label: 'DAGGERHEART.Item.tabs.description' },
            { id: 'settings', group: 'equipment', label: 'DAGGERHEART.Item.tabs.settings' },
            { id: 'features', group: 'equipment', label: 'DAGGERHEART.Item.tabs.features' },
            { id: 'details', group: 'equipment', label: 'DAGGERHEART.Item.tabs.details' },
            { id: 'effects', group: 'equipment', label: 'DAGGERHEART.Item.tabs.effects' }
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
            tabs: this.prepareTabs(this.constructor.TABS).sheet,
            effects: this.prepareActiveEffectCategories(this.item.effects)
        };
    }
}
