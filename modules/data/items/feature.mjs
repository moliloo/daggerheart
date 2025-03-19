import DaggerheartItemBase from './base-item.mjs';

const fields = foundry.data.fields;

export default class DaggerheartFeature extends DaggerheartItemBase {
    static defineSchema() {
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = super.defineSchema();

        schema.type = new fields.StringField({ initial: '' });
        schema.cost = new fields.NumberField({ ...requiredInteger, initial: 0 });

        schema.frequency = new fields.SchemaField({
            times: new fields.NumberField({ ...requiredInteger, initial: 1 }),
            type: new fields.StringField({ initial: 'atWill' })
        });

        schema.cost = new fields.SchemaField({
            value: new fields.NumberField({ ...requiredInteger, initial: 1 }),
            type: new fields.StringField({ initial: 'noCost' })
        });

        schema.uses = new fields.SchemaField({
            value: new fields.NumberField({ ...requiredInteger, initial: 1 }),
            type: new fields.StringField({ initial: 'unlimited' })
        });

        schema.actionCategory = new fields.SchemaField({
            type: new fields.StringField({ initial: 'none' }),
            roll: new fields.SchemaField({
                rollFormula: new fields.StringField({ initial: '' })
            }),
            attack: new fields.SchemaField({
                attribute: new fields.StringField({ initial: '' }),
                rollsDamage: new fields.BooleanField({ initial: false }),
                usesProficiency: new fields.BooleanField({ initial: false }),
                type: new fields.StringField({ initial: 'physical' }),
                rollFormula: new fields.StringField({ initial: '' })
            }),
            damageBonus: new fields.SchemaField({
                rollFormula: new fields.StringField({ initial: '' })
            }),
            heal: new fields.SchemaField({
                rollFormula: new fields.StringField({ initial: '' })
            }),
            attributeCheck: new fields.SchemaField({
                attribute: new fields.StringField({ initial: '' }),
                dc: new fields.NumberField({ ...requiredInteger, initial: 0 }),
                rollsDice: new fields.BooleanField({ initial: false }),
                rollFormula: new fields.StringField({ initial: '' })
            })
        });

        return schema;
    }
}
