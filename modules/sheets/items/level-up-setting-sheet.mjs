import { daggerheart } from '../../helpers/config.mjs';
import { DaggerheartItemSheet } from './item-sheet.mjs';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;
const DialogV2 = foundry.applications.api.DialogV2;

export class DaggerheartTierSettingSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
    constructor(item, options) {
        super(item, options);

        this.options.form.handler = this._onFormSubmit.bind(this);
    }

    get title() {
        return this.document.system.levelUpTiers.find(f => f.id === this.options.tierData.id).name;
    }

    static DEFAULT_OPTIONS = {
        tag: 'form',
        form: {
            submitOnChange: true
        },
        classes: ['daggerheart', 'actor', 'level-up-setting'],
        position: {
            width: 450
        },
        window: {
            icon: '',
            resizable: false
        },
        dragDrop: [],
        actions: {},
        form: {
            submitOnChange: true,
            closeOnSubmit: false
        }
    };

    static PARTS = {
        levelUpSetting: {
            template: 'systems/daggerheart/templates/items/global/partials/level-up-settings.hbs'
        }
    };

    async _onClickAction(event, target) {
        event.preventDefault();
        event.stopPropagation();

        switch (target.dataset.action) {
            case 'addTierOption':
                this.addTierOption(this.options.tierData, this.item);
                break;
            case 'removeOption':
                const optionIndex = parseInt(target.dataset.optionIndex);
                this.removeTierOption(this.options.tierData, this.item, optionIndex);
                break;
            case 'editOption':
                this.editOption(event, this.item);
                break;
        }
    }

    async _onFormSubmit(event, form, formData) {
        event.preventDefault();

        const proseMirror = document.querySelector("prose-mirror[name='description']");

        if (proseMirror) proseMirror.setAttribute('data-action', 'editTier');

        await this._updateFeatureOnSubmit(formData);
        Object.assign(this.options.tierData, formData);
    }

    async _updateFeatureOnSubmit() {
        if (!this.item) return;

        const updateData = {};
        const inputs = document.querySelectorAll('[data-action="editTier"]');

        inputs.forEach(input => {
            const field = input.name;
            let value;

            if (input.type === 'checkbox') {
                value = input.checked;
            } else if (input.tagName.toLowerCase() === 'select') {
                value = input.value;
            } else {
                value = input.value;
            }

            this.options.tierData[field] = value;
            const tierIndex = this.item.system.levelUpTiers.findIndex(f => f.id === this.options.tierData.id);

            if (tierIndex !== -1) {
                this._setNestedProperty(updateData, field, value);
            }
        });

        if (Object.keys(updateData).length > 0) {
            const updatedTiers = [...this.item.system.levelUpTiers];
            const tierIndex = this.item.system.levelUpTiers.findIndex(f => f.id === this.options.tierData.id);

            if (tierIndex !== -1) {
                updatedTiers[tierIndex] = {
                    ...updatedTiers[tierIndex],
                    ...updateData
                };
            }

            await this.item.update({ 'system.levelUpTiers': updatedTiers });
        }
    }

    async removeTierOption(tier, item, optionIndex) {
        if (!item || !item._id) return;

        let levelUpTiers = foundry.utils.deepClone(item.system.levelUpTiers);
        const tierIndex = levelUpTiers.findIndex(t => t.id === tier.id);

        if (tierIndex === -1) return;

        levelUpTiers[tierIndex].options.splice(optionIndex, 1);

        await item.update({ 'system.levelUpTiers': levelUpTiers });
    }

    _setNestedProperty(obj, path, value) {
        const keys = path.split('.');
        let current = obj;

        while (keys.length > 1) {
            const key = keys.shift();
            if (!(key in current)) {
                current[key] = {};
            }
            current = current[key];
        }

        current[keys[0]] = value;
    }

    _getDatasets() {
        return {
            actionType: { action: 'editTier' }
        };
    }

    async addTierOption(tier, item) {
        if (!item || !item._id) return;

        let levelUpTiers = foundry.utils.deepClone(item.system.levelUpTiers);
        const tierIndex = levelUpTiers.findIndex(t => t.id === tier.id);

        if (tierIndex === -1) return;

        if (!Array.isArray(levelUpTiers[tierIndex].options)) {
            levelUpTiers[tierIndex].options = [];
        }

        const optionData = {
            id: `Item.${item._id}.LevelUpOption.${foundry.utils.randomID()}`,
            label: 'Option',
            type: 'trait',
            checkboxQuantity: 1,
            spentAvailableOptions: 0,
            markedCharTraits: [],
            unmarkedCharTraits: [],
            value: 0,
            hasSubclassOption: false,
            hasMulticlassOption: false
        };

        levelUpTiers[tierIndex].options.push(optionData);

        await item.update({ 'system.levelUpTiers': levelUpTiers });
    }

    async editOption(event, item) {
        let tierId = event.target.closest('li')?.dataset.tierId;
        let optionId = event.target.closest('li')?.dataset.optionId;

        const tiers = foundry.utils.deepClone(item.system.levelUpTiers);
        const tier = tiers.find(tier => tier.id === tierId);

        const option = tier.options.find(option => option.id === optionId);

        const data = {
            option: option,
            config: daggerheart
        };

        await DialogV2.prompt({
            window: { title: 'Edit Option' },
            content: await renderTemplate('systems/daggerheart/templates/dialog/edit-level-up-options.hbs', data),
            modal: true,
            ok: {
                label: 'Submit',
                callback: async (event, button, dialog) => {
                    let label = button.form.elements['option.label'].value;
                    let type = button.form.elements['option.type'].value;
                    let value = button.form.elements['option.value'].value;
                    let checkboxQuantity = button.form.elements['option.checkboxQuantity'].value;
                    let levelUpTiers = foundry.utils.deepClone(item.system.levelUpTiers);

                    const tierIndex = levelUpTiers.findIndex(t => t.id === tierId);
                    const optionIndex = levelUpTiers[tierIndex].options.findIndex(o => o.id === optionId);

                    if (optionIndex === -1 || tierIndex === -1) return;

                    levelUpTiers[tierIndex].options[optionIndex] = {
                        ...levelUpTiers[tierIndex].options[optionIndex],
                        label,
                        type,
                        value,
                        checkboxQuantity
                    };

                    await item.update({ 'system.levelUpTiers': levelUpTiers });
                }
            }
        });
    }

    async _prepareContext(options) {
        return {
            item: this.document,
            levelUpTiers: this.document.system.levelUpTiers,
            tier: this.document.system.levelUpTiers.find(f => f.id === this.options.tierData.id),
            config: daggerheart,
            datasets: this._getDatasets()
        };
    }
}
