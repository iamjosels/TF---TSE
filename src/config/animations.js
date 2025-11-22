import { ASSETS_CONFIG } from './assetsConfig.js';

export function createAnimations(scene) {
    const { anims, textures } = scene;

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

    const runAtlasKey = ASSETS_CONFIG.player.run.key;
    const runFrames = textures.get(runAtlasKey).getFrameNames()
        .filter((name) => name !== '__BASE')
        .sort();

    ensureAnim('player-run', {
        key: 'player-run',
        frames: runFrames.map((frame) => ({ key: runAtlasKey, frame })),
        frameRate: 12,
        repeat: -1
    });

    const slime = ASSETS_CONFIG.enemies.slime;
    ensureAnim('slime-walk', {
        key: 'slime-walk',
        frames: slime.walkFrames.map((frame) => ({ key: frame.key })),
        frameRate: 4,
        repeat: -1
    });

    ensureAnim('slime-idle', {
        key: 'slime-idle',
        frames: [{ key: slime.walkFrames[0].key }],
        frameRate: 1,
        repeat: -1
    });
}
