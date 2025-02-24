import { daggerheart } from '../../helpers/config.mjs';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
const DialogV2 = foundry.applications.api.DialogV2;

export class DaggerheartCharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
    // Private properties
    #dragDrop;

    constructor(options = {}) {
        super(options);
        this.#dragDrop = this.#createDragDropHandlers();
    }

    static DEFAULT_OPTIONS = {
        tag: 'form',
        form: { submitOnChange: true },
        classes: ['daggerheart', 'actor', 'character', 'sheet'],
        position: { width: 850, height: 850 },
        window: { icon: 'fa-solid fa-dagger', resizable: true },
        dragDrop: [{ dragSelector: '[data-drag]', dropSelector: null }],
        actions: {
            rollHopeFear: DaggerheartCharacterSheet._openRollDialog,
            editImage: DaggerheartCharacterSheet.#onEditImage // TODO: remove in v13
        }
    };

    static PARTS = {
        header: { template: `systems/daggerheart/templates/actors/character/header.hbs` }
    };

    // Getter for dragDrop private property
    get dragDrop() {
        return this.#dragDrop;
    }

    // Methods related to item editing and image editing

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

    // Prepare the context for rendering
    async _prepareContext(options) {
        return {
            actor: this.document,
            source: this.document.toObject()
        };
    }

    // Methods related to drag and drop functionality
    #createDragDropHandlers() {
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

    async _onDrop(event) {
        event.preventDefault();
        const data = TextEditor.getDragEventData(event);
        if (!data || !data.type) return;

        switch (data.type) {
            case 'Item':
                const item = await Item.fromDropData(data);
                if (item) {
                    let existingItem;

                    switch (item.type) {
                        case 'ancestry':
                            existingItem = this.actor.items.find(existing => existing.type === 'ancestry');
                            break;
                        case 'community':
                            existingItem = this.actor.items.find(existing => existing.type === 'community');
                            break;
                        case 'class':
                            existingItem = this.actor.items.find(existing => existing.type === 'class');
                            break;
                    }

                    if (!existingItem && !this.actor.items.some(existing => existing.id === item.id)) {
                        await this.actor.createEmbeddedDocuments('Item', [item.toObject()]);
                        ui.notifications.info(`${item.name} foi adicionado ao inventário.`);
                    } else {
                        ui.notifications.info(`${item.name} já está no inventário.`);
                    }
                }
                break;
        }
    }

    // Methods related to action handling
    async _onClickAction(event, target) {
        event.preventDefault();
        event.stopPropagation();
        const itemId = target.dataset.itemId;
        const item = await this.actor.items.get(itemId); // Aqui você garante que está pegando o item corretamente

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
        }
    }

    static async _openRollDialog() {
        await new DialogV2({
            title: 'Escolha o tipo de rolagem',
            content: `
            <p>Selecione como deseja rolar os dados:</p>
            <button data-mode="normal">Normal</button>
            <button data-mode="advantage">Vantagem</button>
            <button data-mode="disadvantage">Desvantagem</button>
          `,
            buttons: [
                {
                    action: 'Normal',
                    label: `Normal`,
                    callback: async () => this._rollDice('normal')
                },
                {
                    action: 'Vantagem',
                    label: `Vantagem`,
                    callback: async () => this._rollDice('advantage')
                },
                {
                    action: 'Desvantagem',
                    label: `Desvantagem`,
                    callback: async () => this._rollDice('disadvantage')
                }
            ],
            default: 'normal'
        }).render(true);
    }

    async _rollDice(mode) {
        // Rola os dados separadamente para controle total
        const hopeRoll = new Roll('1d12');
        const fearRoll = new Roll('1d12');

        await hopeRoll.evaluate({ async: true });
        await fearRoll.evaluate({ async: true });

        const hope = hopeRoll.total;
        const fear = fearRoll.total;

        // O maior valor entre os dois é o escolhido
        let finalResult = Math.max(hope, fear);

        let d6Roll = null;
        if (mode !== 'normal') {
            // Adiciona um d6 caso tenha vantagem/desvantagem
            d6Roll = new Roll('1d6');
            await d6Roll.evaluate({ async: true });

            if (mode === 'advantage') {
                finalResult += d6Roll.total;
            } else if (mode === 'disadvantage') {
                finalResult -= d6Roll.total;
            }
        }

        // Criar uma fórmula para exibir os dados corretamente no chat
        let rollFormula = `1d12[Hope] + 1d12[Fear]`;
        if (mode !== 'normal') {
            rollFormula += ` + ${mode === 'advantage' ? '1d6[Vantagem]' : '-1d6[Desvantagem]'}`;
        }

        // Criar um novo Roll que reflete a jogada completa (mas mantendo o maior d12 no total final)
        const fullRoll = new Roll(rollFormula, {});
        await fullRoll.evaluate({ async: true });

        // Substituir o total pelo valor correto (apenas o maior d12 + d6, se aplicável)
        fullRoll._total = finalResult;

        // Enviar a mensagem para o chat
        await fullRoll.toMessage({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker(),
            flavor: `<strong>Rolagem (${mode === 'normal' ? 'Normal' : mode === 'advantage' ? 'Vantagem' : 'Desvantagem'})</strong><br>
          🎲 Hope: ${hope} | 🎲 Fear: ${fear} ${d6Roll ? `<br> 🎲 d6 (${mode}): ${d6Roll.total}` : ''}<br>
          <strong>Resultado Final: ${finalResult}</strong>`
        });
    }

    // Rendering methods
    _onRender(context, options) {
        this.#dragDrop.forEach(d => d.bind(this.element));
    }
}
