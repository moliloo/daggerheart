import DaggerheartItemBase from './base-item.mjs';

const fields = foundry.data.fields;

export default class DaggerheartDomainCard extends DaggerheartItemBase {
    static defineSchema() {
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = super.defineSchema();

        schema.cardType = new fields.StringField({ initial: 'ability' });
        schema.domainType = new fields.StringField({ initial: '' });
        schema.level = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });
        schema.recallCost = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });

        return schema;
    }
}
