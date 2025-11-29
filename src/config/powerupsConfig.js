import { ASSETS_CONFIG } from './assetsConfig.js';

export const POWERUP_TYPES = {
    TRIPLE_SHOT: 'tripleShot',
    SHIELD: 'shield',
    FREEZE_ZONE: 'freezeZone'
};

export const POWERUP_BEHAVIOR = {
    [POWERUP_TYPES.TRIPLE_SHOT]: {
        duration: ASSETS_CONFIG.powerups.tripleShot.duration,
        angles: [0, 15, -15]
    },
    [POWERUP_TYPES.SHIELD]: {
        // Shield lasts until the next damaging collision.
        duration: 0
    },
    [POWERUP_TYPES.FREEZE_ZONE]: {
        duration: ASSETS_CONFIG.powerups.freezeZone.duration,
        radius: 230
    }
};

export const LOOT_ODDS = ASSETS_CONFIG.loot;
