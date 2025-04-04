const fields = foundry.data.fields;

export default class DaggerheartItemBase extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = {};

        schema.description = new fields.HTMLField({ required: true, blank: true, initial: 'Description' });

        schema.publication = new fields.SchemaField({
            title: new fields.StringField({ initial: '' }),
            author: new fields.StringField({ initial: '' })
        });

        schema.features = new fields.ArrayField(
            new fields.SchemaField({
                name: new fields.StringField({ initial: '' }),
                img: new fields.StringField({ initial: '' }),
                type: new fields.StringField({ initial: '' }),
                id: new fields.StringField({ initial: '' }),
                description: new fields.HTMLField({ required: true, blank: true, initial: 'Feature Description' }),

                settings: new fields.SchemaField({
                    actionType: new fields.StringField({ initial: 'passive' }),

                    frequency: new fields.SchemaField({
                        times: new fields.NumberField({ ...requiredInteger, initial: 1 }),
                        type: new fields.StringField({ initial: 'atWill' })
                    }),

                    cost: new fields.SchemaField({
                        value: new fields.NumberField({ ...requiredInteger, initial: 1 }),
                        type: new fields.StringField({ initial: 'noCost' })
                    }),

                    uses: new fields.SchemaField({
                        value: new fields.NumberField({ ...requiredInteger, initial: 1 }),
                        type: new fields.StringField({ initial: 'unlimited' })
                    }),

                    actionCategory: new fields.SchemaField({
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
                    })
                })
            })
        );

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
