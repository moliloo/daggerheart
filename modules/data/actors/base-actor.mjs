const fields = foundry.data.fields;

export default class DaggerheartActorBase extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = {};

        schema.biography = new fields.HTMLField({ required: true, blank: true, initial: 'Biography' });

        schema.stats = new fields.SchemaField({
            hp: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
                max: new fields.NumberField({ ...requiredInteger, initial: 6 })
            }),
            stress: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
                max: new fields.NumberField({ ...requiredInteger, initial: 6 })
            }),
            evasion: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 9, min: 0 })
            }),
            armor: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 })
            })
        });

        schema.attributes = new fields.SchemaField({
            agility: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
                isChecked: new fields.BooleanField({ initial: false })
            }),
            strength: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
                isChecked: new fields.BooleanField({ initial: false })
            }),
            finesse: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
                isChecked: new fields.BooleanField({ initial: false })
            }),
            instinct: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
                isChecked: new fields.BooleanField({ initial: false })
            }),
            presence: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
                isChecked: new fields.BooleanField({ initial: false })
            }),
            knowledge: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
                isChecked: new fields.BooleanField({ initial: false })
            })
        });

        schema.damageThreshold = new fields.SchemaField({
            value: new fields.NumberField({ ...requiredInteger, initial: 0 })
        });

        schema.currency = new fields.SchemaField({
            coins: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0 })
            }),
            handfuls: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0 })
            }),
            bags: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0 })
            }),
            chests: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0 })
            })
        });

        return schema;
    }
}
