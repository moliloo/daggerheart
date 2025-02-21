export function fearDiceRoll(level) {
    let die;
    switch (level) {
        case 1:
            die = 'd4';
            break;
        case 2:
            die = 'd6';
            break;
        case 3:
            die = 'd8';
            break;
        case 4:
            die = 'd10';
            break;
        case 5:
            die = 'd12';
            break;
        default:
            die = 'd4'; // Valor padrão caso o level seja inválido
            break;
    }
    return die;
}
