import DaggerheartItemBase from './base-item.mjs';

const fields = foundry.data.fields;

export default class DaggerheartClass extends DaggerheartItemBase {
    static defineSchema() {
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = super.defineSchema();

        return schema;
    }
}
