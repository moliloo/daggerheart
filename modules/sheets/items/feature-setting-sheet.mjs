import { daggerheart } from '../../helpers/config.mjs';
import { DaggerheartItemSheet } from './item-sheet.mjs';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

export class DaggerheartFeatureSettingSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
    constructor(item, options) {
        super(item, options);

        this.options.form.handler = this._onFormSubmit.bind(this);
    }

    get title() {
        return this.item.name;
    }

    static DEFAULT_OPTIONS = {
        tag: 'form',
        form: {
            submitOnChange: true
        },
        classes: ['daggerheart', 'actor', 'feature-setting'],
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
        featureSetting: {
            template: 'systems/daggerheart/templates/items/global/partials/feature-settings.hbs'
        }
    };

    async _onFormSubmit(event, form, formData) {
        event.preventDefault();

        const proseMirror = document.querySelector("prose-mirror[name='description']");

        if (proseMirror) proseMirror.setAttribute('data-action', 'editFeature');

        await this._updateFeatureOnSubmit(formData);
        Object.assign(this.options.featureData, formData);
    }

    async _updateFeatureOnSubmit() {
        if (!this.item) return;

        const updateData = {};
        const inputs = document.querySelectorAll('[data-action="editFeature"]');

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

            this.options.featureData[field] = value;
            const featureIndex = this.item.system.features.findIndex(f => f.id === this.options.featureData.id);

            if (featureIndex !== -1) {
                this._setNestedProperty(updateData, field, value);
            }
        });

        if (Object.keys(updateData).length > 0) {
            const updatedFeatures = [...this.item.system.features];
            const featureIndex = this.item.system.features.findIndex(f => f.id === this.options.featureData.id);

            if (featureIndex !== -1) {
                updatedFeatures[featureIndex] = {
                    ...updatedFeatures[featureIndex],
                    ...updateData
                };
            }

            await this.item.update({ 'system.features': updatedFeatures });
        }
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
            actionType: { action: 'editFeature' }
        };
    }

    async _prepareContext(options) {
        return {
            item: this.document,
            features: this.document.system.features,
            feature: this.document.system.features.find(f => f.id === this.options.featureData.id),
            fields: this.document.system.schema.fields,
            description: this.document.system.features.find(f => f.id === this.options.featureData.id).description,
            config: daggerheart,
            datasets: this._getDatasets()
        };
    }
}
