import DaggerheartActorBase from './base-actor.mjs';

const fields = foundry.data.fields;

export default class DaggerheartCharacter extends DaggerheartActorBase {
    static defineSchema() {
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = super.defineSchema();

        schema.level = new fields.NumberField({ ...requiredInteger, initial: 1, min: 0, max: 10 });

        schema.proficiency = new fields.NumberField({ ...requiredInteger, initial: 1, min: 1, max: 6 });

        schema.pronouns = new fields.StringField({ initial: '' });

        schema.hope = new fields.SchemaField({
            value: new fields.NumberField({ ...requiredInteger, initial: 6, min: 0 }),
            max: new fields.NumberField({ ...requiredInteger, initial: 6 })
        });

        schema.armor = new fields.SchemaField({
            value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
            max: new fields.NumberField({ ...requiredInteger, initial: 6 }),
            slots: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
                max: new fields.NumberField({ ...requiredInteger, initial: 6 })
            })
        });

        return schema;
    }
}
