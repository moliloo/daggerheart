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
            icon: '',
            resizable: false
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

    async _onClickAction(event, target) {
        event.preventDefault();
        event.stopPropagation();
        const itemId = target.dataset.itemId;

        switch (target.dataset.action) {
            case 'createEffect':
                this.createActiveEffect(event, this.item);
                break;
            case 'editEffect':
                this.editActiveEffect(event, this.item);
                break;
            case 'deleteEffect':
                this.deleteActiveEffect(event, this.item);
                break;
            case 'toggleEffect':
                this.toggleActiveEffect(event, this.item);
                break;
        }
    }

    prepareActiveEffectCategories(effects) {
        const categories = {
            temporary: {
                type: 'temporary',
                label: game.i18n.localize('DAGGERHEART.ActiveEffect.temporary'),
                effects: []
            },
            passive: {
                type: 'passive',
                label: game.i18n.localize('DAGGERHEART.ActiveEffect.passive'),
                effects: []
            },
            inactive: {
                type: 'inactive',
                label: game.i18n.localize('DAGGERHEART.ActiveEffect.inactive'),
                effects: []
            }
        };

        for (let e of effects) {
            if (e.disabled) categories.inactive.effects.push(e);
            else if (e.isTemporary) categories.temporary.effects.push(e);
            else categories.passive.effects.push(e);
        }
        return categories;
    }

    getEffectId(event, owner) {
        const effectId = event.target.closest('li').dataset.effectId;
        return effectId ? owner.effects.get(effectId) : null;
    }

    createActiveEffect(event, owner) {
        event.preventDefault();
        event.stopPropagation();

        const effectType = event.currentTarget.closest('li')?.dataset.effectType;
        owner.createEmbeddedDocuments('ActiveEffect', [
            {
                name: game.i18n.format('DOCUMENT.New', {
                    type: game.i18n.localize('DOCUMENT.ActiveEffect')
                }),
                icon: owner.img,
                origin: owner.uuid,
                disabled: effectType === 'inactive'
            }
        ]);
    }

    editActiveEffect(event, owner) {
        const effect = this.getEffectId(event, owner);
        return effect.sheet.render(true);
    }

    deleteActiveEffect(event, owner) {
        const effect = this.getEffectId(event, owner);
        return effect.delete();
    }

    toggleActiveEffect(event, owner) {
        const effect = this.getEffectId(event, owner);
        effect.update({ disabled: !effect.disabled });
    }
}
