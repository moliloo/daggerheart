import { DaggerheartActor } from './documents/actor.mjs';
import { DaggerheartItem } from './documents/item.mjs';

import { DaggerheartCharacterSheet } from './sheets/actors/character-sheet.mjs';

import { DaggerheartItemSheet } from './sheets/items/item-sheet.mjs';

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

    console.log(CONFIG);

    CONFIG.Actor.documentClass = DaggerheartActor;
    CONFIG.Item.documentClass = DaggerheartItem;
    CONFIG.Item.entityClass = DaggerheartItem;

    CONFIG.Actor.dataModels = {
        character: models.DaggerheartCharacter
    };
    // CONFIG.Item.dataModels = {
    //     equipment: models.DaggerheartEquipment,
    //     card: models.DaggerheartCard
    // };

    Items.unregisterSheet('core', ItemSheet);
    Items.registerSheet('daggerheart', DaggerheartItemSheet, { makeDefault: true });

    Actors.unregisterSheet('core', ActorSheet);
    Actors.registerSheet('daggerheart', DaggerheartCharacterSheet, { types: ['character'], makeDefault: true });

    preloadHandlebarsTemplates();
});

Hooks.once('ready', function () {
    Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));
    console.log(game);
});

Handlebars.registerHelper('le', function (a, b) {
    var next = arguments[arguments.length - 1];
    return a <= b ? next.fn(this) : next.inverse(this);
});
