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

    const goblin = ASSETS_CONFIG.enemies.goblin;
    
    if (scene.textures.exists(goblin.spritesheet.key)) {
        ensureAnim('goblin-walk', {
            key: 'goblin-walk',
            frames: anims.generateFrameNames(goblin.spritesheet.key),
            frameRate: 8,
            repeat: -1
        });
    }

    if (scene.textures.exists(goblin.idle.key)) {
        ensureAnim('goblin-idle', {
            key: 'goblin-idle',
            frames: anims.generateFrameNames(goblin.idle.key),
            frameRate: 6,
            repeat: -1
        });
    }

    if (scene.textures.exists(goblin.dead.key)) {
        ensureAnim('goblin-dead', {
            key: 'goblin-dead',
            frames: anims.generateFrameNames(goblin.dead.key),
            frameRate: 10,
            repeat: 0
        });
    }

    if (scene.textures.exists(goblin.hit.key)) {
        ensureAnim('goblin-hit', {
            key: 'goblin-hit',
            frames: anims.generateFrameNames(goblin.hit.key),
            frameRate: 12,
            repeat: 0
        });
    }
}
