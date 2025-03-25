import { daggerheart } from '../../helpers/config.mjs';
import { DaggerheartItemSheet } from './item-sheet.mjs';

const { HandlebarsApplicationMixin } = foundry.applications.api;

export class DaggerheartFeatureSheet extends HandlebarsApplicationMixin(DaggerheartItemSheet) {
    static DEFAULT_OPTIONS = {
        classes: ['daggerheart', 'item', 'feature']
    };

    static PARTS = {
        header: { template: 'systems/daggerheart/templates/items/feature/header.hbs' },
        tabs: { template: 'systems/daggerheart/templates/items/global/partials/tab-navigation.hbs' },
        description: { template: 'systems/daggerheart/templates/items/global/tabs/description.hbs', scrollable: ['.description'] },
        settings: {
            template: 'systems/daggerheart/templates/items/feature/partials/settings.hbs',
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
            { id: 'description', group: 'feature', label: 'DAGGERHEART.Item.tabs.description' },
            { id: 'settings', group: 'feature', label: 'DAGGERHEART.Item.tabs.settings' },
            { id: 'details', group: 'feature', label: 'DAGGERHEART.Item.tabs.details' },
            { id: 'effects', group: 'feature', label: 'DAGGERHEART.Item.tabs.effects' }
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
            effects: this.prepareActiveEffectCategories(this.item.effects),
            tabs: this.prepareTabs(this.constructor.TABS).sheet
        };
    }
}
