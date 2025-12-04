import { ASSETS_CONFIG } from './assetsConfig.js';

export function createAnimations(scene, metrics = {}) {
    const { anims } = scene;
    const ensureAnim = (key, config) => {
        if (!anims.exists(key)) {
            anims.create(config);
        }
    };

    ensureAnim('player-idle', {
        key: 'player-idle',
        frames: [{ key: ASSETS_CONFIG.player.idle.key }],
        frameRate: 1,
        repeat: -1
    });

    ensureAnim('player-jump', {
        key: 'player-jump',
        frames: [{ key: ASSETS_CONFIG.player.jump.key }],
        frameRate: 1,
        repeat: -1
    });

    ensureAnim('player-hurt', {
        key: 'player-hurt',
        frames: [{ key: ASSETS_CONFIG.player.hurt.key }],
        frameRate: 1,
        repeat: -1
    });

    const walkSheetKey = metrics.walkSheet || `${ASSETS_CONFIG.player.walk.key}-sheet`;
    if (scene.textures.exists(walkSheetKey)) {
        const walkFrames = anims.generateFrameNumbers(walkSheetKey, { start: 0, end: ASSETS_CONFIG.player.walk.frames - 1 });
        ensureAnim('player-run', {
            key: 'player-run',
            frames: walkFrames,
            frameRate: 8,
            repeat: -1
        });
    } else {
        ensureAnim('player-run', {
            key: 'player-run',
            frames: [{ key: ASSETS_CONFIG.player.idle.key }],
            frameRate: 6,
            repeat: -1
        });
    }

    const slime = ASSETS_CONFIG.enemies.slime;
    
    if (scene.textures.exists(slime.walk.key)) {
        ensureAnim('slime-walk', {
            key: 'slime-walk',
            frames: [{ key: slime.walk.key }],
            frameRate: 6,
            repeat: -1
        });
    }

    if (scene.textures.exists(slime.idle.key)) {
        ensureAnim('slime-idle', {
            key: 'slime-idle',
            frames: [{ key: slime.idle.key }],
            frameRate: 1,
            repeat: -1
        });
    }

    if (scene.textures.exists(slime.dead.key)) {
        ensureAnim('slime-dead', {
            key: 'slime-dead',
            frames: [{ key: slime.dead.key }],
            frameRate: 1,
            repeat: 0
        });
    }
}
