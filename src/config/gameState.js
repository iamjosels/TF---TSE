export const GAME_DEFAULTS = {
    LIVES: 3,
    SCORE: 0
};

export function ensureState(scene) {
    if (scene.registry.get('score') === undefined) {
        scene.registry.set('score', GAME_DEFAULTS.SCORE);
    }
    if (scene.registry.get('lives') === undefined) {
        scene.registry.set('lives', GAME_DEFAULTS.LIVES);
    }
}

export function resetGameState(scene) {
    scene.registry.set('score', GAME_DEFAULTS.SCORE);
    scene.registry.set('lives', GAME_DEFAULTS.LIVES);
}

export function addScore(scene, amount) {
    const next = (scene.registry.get('score') || 0) + amount;
    scene.registry.set('score', next);
    return next;
}

export function loseLife(scene) {
    const next = Math.max(0, (scene.registry.get('lives') || GAME_DEFAULTS.LIVES) - 1);
    scene.registry.set('lives', next);
    return next;
}
