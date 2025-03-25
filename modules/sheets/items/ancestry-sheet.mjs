import { daggerheart } from '../../helpers/config.mjs';
import { DaggerheartItemSheet } from './item-sheet.mjs';

const { HandlebarsApplicationMixin } = foundry.applications.api;

export class DaggerheartAncestrySheet extends HandlebarsApplicationMixin(DaggerheartItemSheet) {
    static DEFAULT_OPTIONS = {
        classes: ['daggerheart', 'item', 'ancestry']
    };

    static PARTS = {
        header: { template: 'systems/daggerheart/templates/items/ancestry/header.hbs' },
        tabs: { template: 'systems/daggerheart/templates/items/global/partials/tab-navigation.hbs' },
        description: { template: 'systems/daggerheart/templates/items/global/tabs/description.hbs', scrollable: ['.description'] },
        featureSection: {
            template: 'systems/daggerheart/templates/items/global/tabs/feature-section.hbs',
            scrollable: ['.features']
        },
        details: { template: 'systems/daggerheart/templates/items/global/tabs/details.hbs' }
    };

    static TABS = {
        sheet: [
            { id: 'description', group: 'ancestry', label: 'DAGGERHEART.Item.tabs.description' },
            { id: 'features', group: 'ancestry', label: 'DAGGERHEART.Item.tabs.features' },
            { id: 'details', group: 'ancestry', label: 'DAGGERHEART.Item.tabs.details' }
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
