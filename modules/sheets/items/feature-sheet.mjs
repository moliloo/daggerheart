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
            resizable: true
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
        sections: { template: 'systems/daggerheart/templates/items/feature/sections.hbs', scrollable: ['.settings'] }
    };

    get title() {
        return this.item.isToken ? `[Token] ${this.item.name}` : this.item.name;
    }

    async _prepareContext(options) {
        console.log(this.document.system.schema.fields);
        return {
            item: this.document,
            source: this.document.toObject(),
            config: daggerheart,
            description: this.document.system.description,
            fields: this.document.system.schema.fields
            // tabs: this._getTabs()
        };
    }
}
