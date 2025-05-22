import { daggerheart } from '../../helpers/config.mjs';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
const DialogV2 = foundry.applications.api.DialogV2;

export class DaggerheartActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
    #dragDrop;

    constructor(options = {}) {
        super(options);
        this.#dragDrop = this.createDragDropHandlers();
    }

    static DEFAULT_OPTIONS = {
        tag: 'form',
        form: { submitOnChange: true },
        classes: ['daggerheart', 'actor', 'character', 'sheet'],
        position: { width: 850, height: 700 },
        window: { icon: 'fa-solid fa-dagger', resizable: true },
        dragDrop: [{ dragSelector: '[data-drag]', dropSelector: null }],
        actions: {
            editImage: DaggerheartActorSheet.#onEditImage // TODO: remove in v13
        }
    };

    get dragDrop() {
        return this.#dragDrop;
    }

    get title() {
        return this.actor.isToken ? `[Token] ${this.actor.name}` : this.actor.name;
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

    prepareTabs(tabsConstructor) {
        let tabs = {};

        Object.entries(tabsConstructor).forEach(([groupId, config]) => {
            tabs[groupId] = config.reduce((acc, tab) => {
                if (!this.tabGroups[tab.group]) this.tabGroups[tab.group] = tab.id;
                const isActive = this.tabGroups[tab.group] === tab.id;
                acc[tab.id] = { ...tab, active: isActive, cssClass: isActive ? 'active' : '' };
                return acc;
            }, {});
        });

        if (!game.user.isGM) delete tabs?.sheet?.hooks;

        return tabs;
    }

    createDragDropHandlers() {
        return this.options.dragDrop.map(d => {
            d.permissions = {
                dragstart: this._canDragStart.bind(this),
                drop: this._canDragDrop.bind(this)
            };
            d.callbacks = {
                dragstart: this._onDragStart.bind(this),
                dragover: this._onDragOver.bind(this),
                drop: this._onDrop.bind(this)
            };
            return new DragDrop(d);
        });
    }

    _canDragStart(selector) {
        return this.isEditable;
    }

    _canDragDrop(selector) {
        return this.isEditable;
    }

    _onDragStart(event) {
        const el = event.currentTarget;
        if ('link' in event.target.dataset) return;
        let dragData = null;
        if (!dragData) return;
        event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    }

    _onDragOver(event) {}

    async _onClickAction(event, target) {
        event.preventDefault();
        event.stopPropagation();
        const itemId = target.dataset.itemId;
        const item = await this.actor.items.get(itemId);

        switch (target.dataset.action) {
            case 'HpIncrease':
                if (this.actor.system.stats.hp.value < this.actor.system.stats.hp.max) {
                    return this.actor.update({ 'system.stats.hp.value': this.actor.system.stats.hp.value + 1 });
                } else {
                    return ui.notifications.warn('You cant increase more');
                }
            case 'HpDecrease':
                if (this.actor.system.stats.hp.value > 0) {
                    return this.actor.update({ 'system.stats.hp.value': this.actor.system.stats.hp.value - 1 });
                } else {
                    return ui.notifications.warn('You cant increase more');
                }
            case 'StressIncrease':
                if (this.actor.system.stats.stress.value < this.actor.system.stats.stress.max) {
                    return this.actor.update({ 'system.stats.stress.value': this.actor.system.stats.stress.value + 1 });
                } else {
                    return ui.notifications.warn('You cant increase more');
                }
            case 'StressDecrease':
                if (this.actor.system.stats.stress.value > 0) {
                    return this.actor.update({ 'system.stats.stress.value': this.actor.system.stats.stress.value - 1 });
                } else {
                    return ui.notifications.warn('You cant increase more');
                }
            case 'hope':
                const hopeValue = parseInt(target.dataset.hopeValue);
                if (this.actor.system.hope.value === hopeValue) {
                    return this.actor.update({ 'system.hope.value': this.actor.system.hope.value - 1 });
                } else {
                    return this.actor.update({ 'system.hope.value': hopeValue });
                }
            case 'deleteItem':
                event.preventDefault();
                await this.actor.deleteEmbeddedDocuments('Item', [itemId]);
                ui.notifications.info('Item removido!');
                return;
            case 'editItem':
                event.preventDefault();
                await item.sheet.render({ force: true });
                return;
            case 'dualityRoll':
                this._dualityDialog(target);
            case 'openFeatureDescription':
                this.openFeatureDescription(event);
                break;
        }
    }

    async _dualityDialog(target) {
        const rollData = {
            attribute: target.dataset.attribute,
            advantage: false,
            disadvantage: false,
            HopeD20: false,
            extraFormula: ''
        };
        await new DialogV2({
            content: await renderTemplate('systems/daggerheart/templates/chat/duality-roll.hbs', rollData),
            buttons: [
                {
                    action: 'Roll',
                    label: `Roll`,
                    callback: async () => {
                        const hasAdvantage = document.querySelector('#advantage').checked;
                        const hasDisadvantage = document.querySelector('#disadvantage').checked;
                        const isHopeD20 = document.querySelector('#hope-d20').checked;

                        this._dualityRoll(rollData, hasAdvantage, hasDisadvantage, isHopeD20);
                    }
                }
            ]
        }).render(true);
    }

    async _dualityRoll(rollData, hasdAdvantage, hasDisadvantage, isHopeD20) {
        let rollFormula;
        let rollAdvantage = ' + 1d6[Advantage]';
        let rollDisadvantage = ' - 1d6[Disadvantage]';
        let rollLabel;
        let attribute = rollData.attribute;

        if (isHopeD20) {
            rollFormula = '{1d20[Hope], 1d12[Fear]}';
        } else {
            rollFormula = '{1d12[Hope], 1d12[Fear]}';
        }

        if (hasdAdvantage && hasDisadvantage) {
            rollFormula = rollFormula;
        } else if (hasdAdvantage) {
            rollFormula = rollFormula.concat(rollAdvantage);
        } else if (hasDisadvantage) {
            rollFormula = rollFormula.concat(rollDisadvantage);
        }

        const roll = new Roll(rollFormula);
        await roll.roll();

        let resultHope = roll.terms[0].results[0].result;
        let faceHope = roll.terms[0].rolls[0].terms[0]._faces;
        let resultFear = roll.terms[0].results[1].result;
        let fearHope = roll.terms[0].rolls[1].terms[0]._faces;

        if (resultHope > resultFear) {
            rollLabel = `1d${faceHope} ${!hasdAdvantage && !hasDisadvantage ? '' : hasdAdvantage && !hasDisadvantage ? '+ 1d6' : '- 1d6'}`;
        } else if (resultFear > resultHope) {
            rollLabel = `1d${fearHope} ${!hasdAdvantage && !hasDisadvantage ? '' : hasdAdvantage && !hasDisadvantage ? '+ 1d6' : '- 1d6'}`;
        } else {
            rollLabel = `Critical!`;
        }

        roll._formula = rollLabel;
        const rollHTML = await roll.render();

        roll.toMessage();
    }

    openFeatureDescription(event) {
        event.preventDefault();
        event.stopPropagation();

        let listItem = event.target.closest('li');
        let editor = $(listItem).find('.item-description');
        editor.toggleClass('invisible');
    }

    // Rendering methods
    _onRender(context, options) {
        this.#dragDrop.forEach(d => d.bind(this.element));
    }
}
