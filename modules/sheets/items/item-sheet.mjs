import { daggerheart } from '../../helpers/config.mjs';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

export class DaggerheartItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
    get title() {
        return this.item.isToken ? `[Token] ${this.item.name}` : this.item.name;
    }

    static DEFAULT_OPTIONS = {
        tag: 'form',
        form: {
            submitOnChange: true
        },
        classes: ['daggerheart', 'item', 'ancestry'],
        position: {
            width: 500,
            height: 750
        },
        window: {
            icon: 'fa-solid fa-leaf',
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
}
