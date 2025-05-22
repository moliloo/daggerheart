import DaggerheartItemBase from './base-item.mjs';

const fields = foundry.data.fields;

export default class DaggerheartEquipment extends DaggerheartItemBase {
    static defineSchema() {
        const requiredInteger = { required: true, nullable: false, integer: true };
        const schema = super.defineSchema();

        schema.type = new fields.StringField({ initial: 'weapon' });
        schema.subtype = new fields.StringField({ initial: 'primaryWeapon' });
        schema.trait = new fields.StringField({ initial: 'agility' });
        schema.range = new fields.StringField({ initial: 'melee' });
        schema.burden = new fields.StringField({ initial: 'oneHand' });
        schema.baseScore = new fields.NumberField({ ...requiredInteger, initial: 0 });
        schema.quantity = new fields.NumberField({ ...requiredInteger, initial: 1 });
        schema.tier = new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 });
        schema.usesProficiency = new fields.BooleanField({ initial: true });
        schema.armorSlots = new fields.NumberField({ ...requiredInteger, initial: 0 });
        schema.armorSlots = new fields.NumberField({ ...requiredInteger, initial: 0 });

        schema.damageThreshold = new fields.SchemaField({
            major: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
            }),
            severe: new fields.SchemaField({
                value: new fields.NumberField({ ...requiredInteger, initial: 0 }),
            })
        });

        schema.damage = new fields.SchemaField({
            type: new fields.StringField({ initial: 'physical' }),
            value: new fields.StringField({ initial: 'd6' })
        });

        schema.isEquipped = new fields.BooleanField({ initial: false });

        return schema;
    }
}
