import DaggerheartItemBase from './base-item.mjs';

const fields = foundry.data.fields;

export default class DaggerheartClass extends DaggerheartItemBase {
    static defineSchema() {
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = super.defineSchema();

        schema.evasion = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });
        schema.damageThreshold = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });
        schema.domainSelected = new fields.StringField({ initial: '' });

        schema.domains = new fields.ArrayField(
            new fields.SchemaField({
                name: new fields.StringField({ initial: '' }),
                value: new fields.StringField({ initial: '' })
            })
        );

        schema.backgroundQuestions = new fields.SchemaField({
            question1: new fields.StringField({ initial: '' }),
            question2: new fields.StringField({ initial: '' }),
            question3: new fields.StringField({ initial: '' })
        });

        schema.connections = new fields.SchemaField({
            question1: new fields.StringField({ initial: '' }),
            question2: new fields.StringField({ initial: '' }),
            question3: new fields.StringField({ initial: '' })
        });

        schema.levelUpTiers = new fields.ArrayField(
            new fields.SchemaField({
                name: new fields.StringField({ initial: '' }),
                id: new fields.StringField({ initial: '' }),
                damageThresholdByLevel: new fields.NumberField({ initial: 2 }),
                domainCardByLevel: new fields.NumberField({ initial: 1 }),
                availableOptions: new fields.NumberField({ initial: 2 }),
                levels: new fields.SchemaField({
                    min: new fields.NumberField(),
                    max: new fields.NumberField()
                }),
                options: new fields.ArrayField(
                    new fields.SchemaField({
                        id: new fields.StringField({ initial: '' }),
                        label: new fields.StringField({ initial: '' }),
                        type: new fields.StringField({ initial: '' }),
                        checkboxQuantity: new fields.NumberField({ initial: 1 }),
                        checkboxArray: new fields.ArrayField(new fields.BooleanField()),
                        spentAvailableOptions: new fields.NumberField({ initial: 0 }),
                        markedCharTraits: new fields.ArrayField(new fields.StringField({ initial: '' })),
                        unmarkedCharTraits: new fields.ArrayField(new fields.StringField({ initial: '' })),
                        value: new fields.NumberField({ initial: 0 }),
                        hasSubclassOption: new fields.BooleanField({ initial: false }),
                        hasMulticlassOption: new fields.BooleanField({ initial: false })
                    })
                ),
                defaultoption: new fields.ArrayField(
                    new fields.SchemaField({
                        level: new fields.NumberField(),
                        type: new fields.StringField({ initial: '' }),
                        value: new fields.NumberField({ initial: 0 })
                    })
                )
            })
        );

        return schema;
    }
}
