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

    // SlimeBlue animations
    const slimeBlue = ASSETS_CONFIG.enemies.slimeBlue;
    if (scene.textures.exists(slimeBlue.walk.key)) {
        ensureAnim('slimeBlue-walk', {
            key: 'slimeBlue-walk',
            frames: [{ key: slimeBlue.walk.key }],
            frameRate: 5,
            repeat: -1
        });
        ensureAnim('slimeBlue-idle', {
            key: 'slimeBlue-idle',
            frames: [{ key: slimeBlue.idle.key }],
            frameRate: 1,
            repeat: -1
        });
        ensureAnim('slimeBlue-dead', {
            key: 'slimeBlue-dead',
            frames: [{ key: slimeBlue.dead.key }],
            frameRate: 1,
            repeat: 0
        });
    }

    // Spider animations
    const spider = ASSETS_CONFIG.enemies.spider;
    if (scene.textures.exists(spider.walk.key)) {
        ensureAnim('spider-walk', {
            key: 'spider-walk',
            frames: [{ key: spider.walk.key }],
            frameRate: 8,
            repeat: -1
        });
        ensureAnim('spider-idle', {
            key: 'spider-idle',
            frames: [{ key: spider.idle.key }],
            frameRate: 1,
            repeat: -1
        });
        ensureAnim('spider-dead', {
            key: 'spider-dead',
            frames: [{ key: spider.dead.key }],
            frameRate: 1,
            repeat: 0
        });
    }
}
