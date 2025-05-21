import DaggerheartItemBase from './base-item.mjs';

const fields = foundry.data.fields;

export default class DaggerheartSubclass extends DaggerheartItemBase {
    static defineSchema() {
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = super.defineSchema();

        schema.spellcastTrait = new fields.StringField({ initial: 'agility' });

        return schema;
    }
}
