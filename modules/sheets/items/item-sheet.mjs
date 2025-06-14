import { daggerheart } from '../../helpers/config.mjs';
import { DaggerheartFeatureSettingSheet } from './feature-setting-sheet.mjs';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

export class DaggerheartItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
    #dragDrop;

    featureSetting = undefined;

    constructor(options = {}) {
        super(options);
        this.#dragDrop = this.#createDragDropHandlers();
    }

    get title() {
        return this.item.isToken ? `[Token] ${this.item.name}` : this.item.name;
    }

    get dragDrop() {
        return this.#dragDrop;
    }

    static DEFAULT_OPTIONS = {
        tag: 'form',
        form: {
            submitOnChange: true
        },
        position: {
            width: 450,
            height: 700
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
        if (!data) return;

        if (data.type === 'Item') {
            const item = await Item.fromDropData(data);
            if (!item) return;

            const updatedItems = [...this.item.system.items, item];

            await this.item.update({
                'system.items': updatedItems
            });
        }
    }

    async _onClickAction(event, target) {
        event.preventDefault();
        event.stopPropagation();

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
            case 'openFeatureDescription':
                this.openFeatureDescription(event);
                break;
            case 'addFeature':
                this.addFeature(this.item);
                break;
            case 'editFeature':
                this.editFeature(event, this.item);
                break;
            case 'deleteFeature':
                this.deleteFeature(event, this.item);
                break;
        }
    }

    openFeatureDescription(event) {
        event.preventDefault();
        event.stopPropagation();

        let listItem = event.target.closest('li');
        let editor = $(listItem).find('.item-description');
        editor.toggleClass('invisible');
    }

    async addFeature(item) {
        if (!item || !item._id) return;

        let features = foundry.utils.deepClone(item.system.features);
        let featureData = {
            id: `Item.${item._id}.Feature.${foundry.utils.randomID()}`,
            name: 'Feature',
            img: item.img,
            settings: {
                actionType: 'passive',
                frequency: {
                    times: 1,
                    type: 'atWill'
                },
                cost: {
                    value: 0,
                    type: 'noCost'
                },
                uses: {
                    value: 1,
                    type: 'unlimited'
                },
                actionCategory: {
                    type: 'none',
                    roll: {
                        rollFormula: ''
                    },
                    attack: {
                        attribute: '',
                        rollsDamage: false,
                        usesProficiency: false,
                        type: 'physical',
                        rollFormula: ''
                    },
                    damageBonus: {
                        rollFormula: ''
                    },
                    heal: {
                        rollFormula: ''
                    },
                    attributeCheck: {
                        attribute: '',
                        dc: 0,
                        rollsDice: false,
                        rollFormula: ''
                    }
                }
            }
        };

        features.push(featureData);

        await item.update({ 'system.features': features });
        console.log(item.system.features);
    }

    async deleteFeature(event, item) {
        const featureId = event.target.closest('li').dataset.featureId;
        if (!item) return;

        item.update({
            'system.features': item.system.features.filter(i => i.id !== featureId)
        });
    }

    async editFeature(event, item) {
        let featureId = event.target.closest('li')?.dataset.featureId;
        const features = foundry.utils.deepClone(item.system.features);
        const feature = features.find(feature => feature.id === featureId);

        this.featureSetting = new DaggerheartFeatureSettingSheet({ document: this.item, featureData: feature });
        this.featureSetting.render(true);
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

    getItemObj(event, owner) {
        const itemId = event.target.closest('li').dataset.itemId;
        return itemId ? owner.system.features.find(item => item._id === itemId) : null;
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

    _onRender(context, options) {
        this.#dragDrop.forEach(d => d.bind(this.element));
    }
}
