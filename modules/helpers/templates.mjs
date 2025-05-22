export const preloadHandlebarsTemplates = async function () {
    return loadTemplates([
        'systems/daggerheart/templates/actors/character/sidebar.hbs',
        'systems/daggerheart/templates/actors/character/tab-navigation.hbs',
        'systems/daggerheart/templates/actors/character/summary.hbs',
        'systems/daggerheart/templates/actors/character/domain-cards.hbs',
        'systems/daggerheart/templates/items/global/partials/tab-navigation.hbs',
        'systems/daggerheart/templates/actors/character/equipment.hbs',
        'systems/daggerheart/templates/items/global/partials/feature-section-item.hbs'
    ]);
};
