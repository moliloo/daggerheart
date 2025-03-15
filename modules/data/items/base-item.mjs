const fields = foundry.data.fields;

export default class DaggerheartItemBase extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = {};

        schema.description = new fields.HTMLField({ required: true, blank: true, initial: 'Biography' });

        schema.publication = new fields.SchemaField({
            title: new fields.StringField({ initial: '' }),
            author: new fields.StringField({ initial: '' })
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
