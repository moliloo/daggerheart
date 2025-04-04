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
                isChecked: new fields.BooleanField({ initial: false }),
                descriptions: new fields.SchemaField({
                    sprint: new fields.StringField({
                        initial: game.i18n.localize('DAGGERHEART.Actor.attributes.agility.descriptions.sprint')
                    }),
                    leap: new fields.StringField({
                        initial: game.i18n.localize('DAGGERHEART.Actor.attributes.agility.descriptions.leap')
                    }),
                    maneuver: new fields.StringField({
                        initial: game.i18n.localize('DAGGERHEART.Actor.attributes.agility.descriptions.maneuver')
                    })
                })
            }),
            strength: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
                isChecked: new fields.BooleanField({ initial: false }),
                descriptions: new fields.SchemaField({
                    lift: new fields.StringField({
                        initial: game.i18n.localize('DAGGERHEART.Actor.attributes.strength.descriptions.lift')
                    }),
                    smash: new fields.StringField({
                        initial: game.i18n.localize('DAGGERHEART.Actor.attributes.strength.descriptions.smash')
                    }),
                    grapple: new fields.StringField({
                        initial: game.i18n.localize('DAGGERHEART.Actor.attributes.strength.descriptions.grapple')
                    })
                })
            }),
            finesse: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
                isChecked: new fields.BooleanField({ initial: false }),
                descriptions: new fields.SchemaField({
                    control: new fields.StringField({
                        initial: game.i18n.localize('DAGGERHEART.Actor.attributes.finesse.descriptions.control')
                    }),
                    hide: new fields.StringField({
                        initial: game.i18n.localize('DAGGERHEART.Actor.attributes.finesse.descriptions.hide')
                    }),
                    tinker: new fields.StringField({
                        initial: game.i18n.localize('DAGGERHEART.Actor.attributes.finesse.descriptions.tinker')
                    })
                })
            }),
            instinct: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
                isChecked: new fields.BooleanField({ initial: false }),
                descriptions: new fields.SchemaField({
                    perceive: new fields.StringField({
                        initial: game.i18n.localize('DAGGERHEART.Actor.attributes.instinct.descriptions.perceive')
                    }),
                    sense: new fields.StringField({
                        initial: game.i18n.localize('DAGGERHEART.Actor.attributes.instinct.descriptions.sense')
                    }),
                    navigate: new fields.StringField({
                        initial: game.i18n.localize('DAGGERHEART.Actor.attributes.instinct.descriptions.navigate')
                    })
                })
            }),
            presence: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
                isChecked: new fields.BooleanField({ initial: false }),
                descriptions: new fields.SchemaField({
                    charm: new fields.StringField({
                        initial: game.i18n.localize('DAGGERHEART.Actor.attributes.presence.descriptions.charm')
                    }),
                    perform: new fields.StringField({
                        initial: game.i18n.localize('DAGGERHEART.Actor.attributes.presence.descriptions.perform')
                    }),
                    deceive: new fields.StringField({
                        initial: game.i18n.localize('DAGGERHEART.Actor.attributes.presence.descriptions.deceive')
                    })
                })
            }),
            knowledge: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
                isChecked: new fields.BooleanField({ initial: false }),
                descriptions: new fields.SchemaField({
                    recall: new fields.StringField({
                        initial: game.i18n.localize('DAGGERHEART.Actor.attributes.knowledge.descriptions.recall')
                    }),
                    analyze: new fields.StringField({
                        initial: game.i18n.localize('DAGGERHEART.Actor.attributes.knowledge.descriptions.analyze')
                    }),
                    comprehend: new fields.StringField({
                        initial: game.i18n.localize('DAGGERHEART.Actor.attributes.knowledge.descriptions.comprehend')
                    })
                })
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
