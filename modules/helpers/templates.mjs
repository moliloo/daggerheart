export const preloadHandlebarsTemplates = async function () {
    return loadTemplates([
        'systems/daggerheart/templates/actors/character/sidebar.hbs',
        'systems/daggerheart/templates/actors/character/tab-navigation.hbs',
        'systems/daggerheart/templates/actors/character/summary.hbs',
        'systems/daggerheart/templates/actors/character/domain-cards.hbs',

        'systems/daggerheart/templates/items/feature/description.hbs',
        'systems/daggerheart/templates/items/feature/settings.hbs',
        'systems/daggerheart/templates/items/feature/details.hbs'
    ]);
};
