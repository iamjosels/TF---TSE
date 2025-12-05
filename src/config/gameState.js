export const GAME_DEFAULTS = {
    LIVES: 3,
    SCORE: 0,
    EXTRA_LIFE_THRESHOLD: 500,
    COMBO_TIMEOUT: 3000,
    COMBO_MULTIPLIERS: [1, 2, 3, 4, 5],
    ENDLESS_RECORD: 0
};

export function ensureState(scene) {
    if (scene.registry.get('score') === undefined) {
        scene.registry.set('score', GAME_DEFAULTS.SCORE);
    }
    if (scene.registry.get('lives') === undefined) {
        scene.registry.set('lives', GAME_DEFAULTS.LIVES);
    }
    if (scene.registry.get('lastExtraLifeScore') === undefined) {
        scene.registry.set('lastExtraLifeScore', 0);
    }
    if (scene.registry.get('comboCount') === undefined) {
        scene.registry.set('comboCount', 0);
    }
    if (scene.registry.get('comboTimer') === undefined) {
        scene.registry.set('comboTimer', null);
    }
    if (scene.registry.get('endlessRecord') === undefined) {
        scene.registry.set('endlessRecord', GAME_DEFAULTS.ENDLESS_RECORD);
    }
}

export function resetGameState(scene) {
    scene.registry.set('score', GAME_DEFAULTS.SCORE);
    scene.registry.set('lives', GAME_DEFAULTS.LIVES);
    scene.registry.set('lastExtraLifeScore', 0);
    scene.registry.set('comboCount', 0);
    const timer = scene.registry.get('comboTimer');
    if (timer) timer.remove(false);
    scene.registry.set('comboTimer', null);
}

export function resetCombo(scene) {
    scene.registry.set('comboCount', 0);
    const timer = scene.registry.get('comboTimer');
    if (timer) timer.remove(false);
    scene.registry.set('comboTimer', null);
    if (scene.hud && scene.hud.updateCombo) {
        scene.hud.updateCombo(0, 1);
    }
}

export function incrementCombo(scene) {
    const current = (scene.registry.get('comboCount') || 0) + 1;
    scene.registry.set('comboCount', current);
    
    // Clear existing timer
    const oldTimer = scene.registry.get('comboTimer');
    if (oldTimer) oldTimer.remove(false);
    
    // Set new timer
    const timer = scene.time.delayedCall(GAME_DEFAULTS.COMBO_TIMEOUT, () => resetCombo(scene));
    scene.registry.set('comboTimer', timer);
    
    const multiplier = getComboMultiplier(current);
    if (scene.hud && scene.hud.updateCombo) {
        scene.hud.updateCombo(current, multiplier);
    }
    
    return current;
}

export function getComboMultiplier(comboCount) {
    const index = Math.min(comboCount - 1, GAME_DEFAULTS.COMBO_MULTIPLIERS.length - 1);
    return GAME_DEFAULTS.COMBO_MULTIPLIERS[Math.max(0, index)];
}

export function addScore(scene, amount, useCombo = false) {
    let finalAmount = amount;
    
    if (useCombo) {
        const comboCount = scene.registry.get('comboCount') || 0;
        const multiplier = getComboMultiplier(comboCount);
        finalAmount = Math.floor(amount * multiplier);
    }
    
    const prev = scene.registry.get('score') || 0;
    const next = prev + finalAmount;
    scene.registry.set('score', next);
    
    // Check for extra life
    const lastMilestone = scene.registry.get('lastExtraLifeScore') || 0;
    const newMilestone = Math.floor(next / GAME_DEFAULTS.EXTRA_LIFE_THRESHOLD);
    const oldMilestone = Math.floor(lastMilestone / GAME_DEFAULTS.EXTRA_LIFE_THRESHOLD);
    
    if (newMilestone > oldMilestone) {
        const currentLives = scene.registry.get('lives') || GAME_DEFAULTS.LIVES;
        scene.registry.set('lives', currentLives + 1);
        scene.registry.set('lastExtraLifeScore', newMilestone * GAME_DEFAULTS.EXTRA_LIFE_THRESHOLD);
        
        // Show notification
        if (scene.hud && scene.hud.showMessage) {
            scene.hud.showMessage('EXTRA LIFE!', 2000);
        }
        if (scene.hud && scene.hud.setLives) {
            scene.hud.setLives(currentLives + 1);
        }
    }
    
    return { score: next, actualAmount: finalAmount };
}

export function loseLife(scene) {
    const next = Math.max(0, (scene.registry.get('lives') || GAME_DEFAULTS.LIVES) - 1);
    scene.registry.set('lives', next);
    return next;
}
