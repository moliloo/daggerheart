import { daggerheart } from '../../helpers/config.mjs';
import { DaggerheartActorSheet } from './actor-sheet.mjs';

const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
const DialogV2 = foundry.applications.api.DialogV2;

export class DaggerheartCharacterSheet extends HandlebarsApplicationMixin(DaggerheartActorSheet) {
    static PARTS = {
        header: { template: 'systems/daggerheart/templates/actors/character/header.hbs' },
        // tabs: { template: 'systems/daggerheart/templates/items/global/partials/tab-navigation.hbs' },
        // sidebar: { template: 'systems/daggerheart/templates/actors/character/sidebar.hbs' },
        sections: { template: 'systems/daggerheart/templates/actors/character/sections.hbs' }
        // tabs: { template: 'systems/daggerheart/templates/actors/character/tab-navigation.hbs' },
        // summary: { template: 'systems/daggerheart/templates/actors/character/summary.hbs' },
        // domainCards: { template: 'systems/daggerheart/templates/actors/character/domain-cards.hbs' }
    };

    static TABS = {
        sheet: [
            { id: 'summary', group: 'character', label: 'Features' },
            { id: 'domainCards', group: 'character', label: 'Domain Cards' },
            { id: 'equipment', group: 'character', label: 'Equipment' }
        ]
    };

    async _prepareContext(options) {
        return {
            actor: this.document,
            source: this.document.toObject(),
            tabs: this.prepareTabs(this.constructor.TABS).sheet
        };
    }

    async _onDrop(event) {
        event.preventDefault();
        const data = TextEditor.getDragEventData(event);
        if (!data || !data.type) return;

        switch (data.type) {
            case 'Item':
                const item = await Item.fromDropData(data);
                if (item) {
                    let existingItem;

                    switch (item.type) {
                        case 'ancestry':
                            existingItem = this.actor.items.find(existing => existing.type === 'ancestry');
                            break;
                        case 'community':
                            existingItem = this.actor.items.find(existing => existing.type === 'community');
                            break;
                        case 'class':
                            existingItem = this.actor.items.find(existing => existing.type === 'class');
                            break;
                    }

                    if (!existingItem && !this.actor.items.some(existing => existing.id === item.id)) {
                        await this.actor.createEmbeddedDocuments('Item', [item.toObject()]);
                        ui.notifications.info(`${item.name} foi adicionado ao inventário.`);
                    } else {
                        ui.notifications.info(`${item.name} já está no inventário.`);
                    }
                }
                break;
        }
    }
}
