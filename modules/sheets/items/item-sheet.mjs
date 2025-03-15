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
        actions: {
            editImage: DaggerheartItemSheet.#onEditImage
        }
    };

    static async #onEditImage(event) {
        const attr = event.target.dataset.edit;
        const current = foundry.utils.getProperty(this.document, attr);
        const fp = new FilePicker({
            current,
            type: 'image',
            callback: path => {
                event.target.src = path;
                if (this.options.form.submitOnChange) {
                    const submit = new Event('submit');
                    this.element.dispatchEvent(submit);
                }
            },
            top: this.position.top + 40,
            left: this.position.left + 10
        });
        await fp.browse();
    }
}
