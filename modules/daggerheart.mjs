import { DaggerheartActor } from './documents/actor.mjs';
import { DaggerheartItem } from './documents/item.mjs';

import { DaggerheartCharacterSheet } from './sheets/actors/character-sheet.mjs';

import { DaggerheartItemSheet } from './sheets/items/item-sheet.mjs';
import { DaggerheartCommunitySheet } from './sheets/items/community-sheet.mjs';
import { DaggerheartAncestrySheet } from './sheets/items/ancestry-sheet.mjs';
import { DaggerheartDomainCardSheet } from './sheets/items/domainCard-sheet.mjs';
import { DaggerheartClassSheet } from './sheets/items/class-sheet.mjs';

import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { daggerheart } from './helpers/config.mjs';

import * as models from './data/_module.mjs';

Hooks.once('init', function () {
    console.log(daggerheart.ascii);
    console.log('Daggerheart | ...');

    game.daggerheart = {
        DaggerheartActor,
        DaggerheartItem,
        DaggerheartCharacterSheet
    };

    CONFIG.DAGGERHEART = daggerheart;

    CONFIG.Actor.documentClass = DaggerheartActor;
    CONFIG.Item.documentClass = DaggerheartItem;
    CONFIG.Item.entityClass = DaggerheartItem;

    CONFIG.Actor.dataModels = {
        character: models.DaggerheartCharacter
    };
    CONFIG.Item.dataModels = {
        ancestry: models.DaggerheartAncestry,
        community: models.DaggerheartCommunity,
        domainCard: models.DaggerheartDomainCard,
        class: models.DaggerheartClass
    };

    Items.unregisterSheet('core', ItemSheet);
    Items.registerSheet('daggerheart', DaggerheartItemSheet, { makeDefault: true });
    Items.registerSheet('daggerheart', DaggerheartCommunitySheet, { types: ['community'], makeDefault: true });
    Items.registerSheet('daggerheart', DaggerheartAncestrySheet, { types: ['ancestry'], makeDefault: true });
    Items.registerSheet('daggerheart', DaggerheartDomainCardSheet, { types: ['domainCard'], makeDefault: true });
    Items.registerSheet('daggerheart', DaggerheartClassSheet, { types: ['class'], makeDefault: true });

    Actors.unregisterSheet('core', ActorSheet);
    Actors.registerSheet('daggerheart', DaggerheartCharacterSheet, { types: ['character'], makeDefault: true });

    preloadHandlebarsTemplates();
});

Hooks.once('ready', function () {
    Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));
});

Handlebars.registerHelper('le', function (a, b) {
    var next = arguments[arguments.length - 1];
    return a <= b ? next.fn(this) : next.inverse(this);
});

Handlebars.registerHelper('filterByType', function (items, type) {
    return items.filter(item => item.type === type);
});

Handlebars.registerHelper('eqg', (a, b) => a >= b);

Handlebars.registerHelper('checkboxesByQuantity', function (n, block) {
    let accum = '';
    for (let i = 0; i < n; ++i) {
        accum += block.fn(i);
    }
    return accum;
});
