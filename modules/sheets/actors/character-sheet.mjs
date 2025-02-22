import { daggerheart } from '../../helpers/config.mjs';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

export class DaggerheartCharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
    get title() {
        return this.actor.isToken ? `[Token] ${this.actor.name}` : this.actor.name;
    }

    static DEFAULT_OPTIONS = {
        tag: 'form',
        form: {
            submitOnChange: true
        },
        classes: ['daggerheart', 'actor', 'character', 'sheet'],
        position: {
            width: 450,
            height: 800
        },
        window: {
            icon: 'fa-solid fa-dagger',
            resizable: true
        },
        dragDrop: [
            {
                dragSelector: '[data-drag]',
                dropSelector: null
            }
        ],
        actions: {
            itemEdit: DaggerheartCharacterSheet.#onItemEdit,
            itemDelete: DaggerheartCharacterSheet.#onItemDelete,
            editImage: DaggerheartCharacterSheet.#onEditImage // TODO remove in v13
        }
    };

    static PARTS = {
        header: {
            template: `systems/daggerheart/templates/actors/character/header.hbs`
        }
    };

    static async #onItemEdit(event) {
        const item = this.getEventItem(event);
        await item.sheet.render({ force: true });
    }

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

    static async #onItemDelete(event) {
        const item = this.getEventItem(event);
        await item.deleteDialog();
    }

    async getEventItem(event) {
        const itemId = event.target.closest('.line-item')?.dataset.itemId;
        return this.actor.items.get(itemId, { strict: true });
    }

    async _prepareContext(options) {
        return {
            actor: this.document,
            source: this.document.toObject()
        };
    }

    async _onClickAction(event, target) {
        event.preventDefault();
        event.stopPropagation();
        switch (target.dataset.action) {
            case 'HpIncrease':
                if (this.actor.system.stats.hp.value <= this.actor.system.stats.hp.max) {
                    return this.actor.update({ 'system.stats.hp.value': this.actor.system.stats.hp.value + 1 });
                }
            case 'HpDecrease':
                if (this.actor.system.stats.hp.value >= 0) {
                    return this.actor.update({ 'system.stats.hp.value': this.actor.system.stats.hp.value - 1 });
                }
            case 'StressIncrease':
                if (this.actor.system.stats.stress.value <= this.actor.system.stats.stress.max) {
                    return this.actor.update({ 'system.stats.stress.value': this.actor.system.stats.stress.value + 1 });
                }
            case 'StressDecrease':
                if (this.actor.system.stats.stress.value >= 0) {
                    return this.actor.update({ 'system.stats.stress.value': this.actor.system.stats.stress.value - 1 });
                }
            case 'hope':
                const hopeValue = parseInt(target.dataset.hopeValue);
                return this.actor.update({ 'system.hope.value': hopeValue });
        }
    }

    getData() {
        const context = super.getData();
        const actorData = context.data;

        context.system = actorData.system;
        context.config = CONFIG.DAGGERHEART;
        context.rollData = context.actor.getRollData();

        // context.effects = this.prepareActiveEffectCategories(this.actor.effects)

        this._prepareItems(context);

        return context;
    }

    // async _renderHTML(...args) {
    //     const div = document.createElement('div');
    //     div.innerHTML = `<h1>Test</h1><input type="button" data-action="dothing">`;
    //     return [div];
    // }

    // _replaceHTML(result, content, options) {
    //     content.replaceChildren(...result);
    // }

    // async _prepareItems(event) {
    //     // Inicializa os containers
    //     const consumable = [];
    //     const equipment = [];
    //     const aether = [];
    //     const fate = [];

    //     // Itera pelos itens e aloca nos containers apropriados
    //     for (let i of event.items) {
    //         i.img = i.img || Item.DEFAULT_ICON;

    //         switch (i.type) {
    //             case 'consumable':
    //                 consumable.push(i);
    //                 break;
    //             case 'equipment':
    //                 equipment.push(i);
    //                 break;
    //             case 'card': // Para itens do tipo carta
    //                 if (i.system.location === 'aether') {
    //                     aether.push(i);
    //                 } else if (i.system.location === 'fate') {
    //                     fate.push(i);
    //                 } else {
    //                     console.warn(`Card not located: ${i.name}`);
    //                 }
    //                 break;
    //             default:
    //                 console.warn(`Unexpected type: ${i.type}`);
    //         }
    //     }

    //     // Armazena os dados no ator
    //     event.consumable = consumable;
    //     event.equipment = equipment;
    //     event.aether = aether;
    //     event.fate = fate;
    // }
}
