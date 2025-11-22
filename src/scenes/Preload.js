import { ASSETS_CONFIG } from '../config/assetsConfig.js';
import { createAnimations } from '../config/animations.js';

export class Preload extends Phaser.Scene {
    constructor() {
        super({ key: 'Preload' });
    }

    preload() {
        this.add.text(640, 360, 'Loading...', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.load.image(ASSETS_CONFIG.background.key, ASSETS_CONFIG.background.path);
        this.load.image(ASSETS_CONFIG.tiles.key, ASSETS_CONFIG.tiles.path);

        this.load.image(ASSETS_CONFIG.player.idle.key, ASSETS_CONFIG.player.idle.path);
        this.load.image(ASSETS_CONFIG.player.jump.key, ASSETS_CONFIG.player.jump.path);
        this.load.image(ASSETS_CONFIG.player.hurt.key, ASSETS_CONFIG.player.hurt.path);
        this.load.atlas(
            ASSETS_CONFIG.player.run.key,
            ASSETS_CONFIG.player.run.texturePath,
            ASSETS_CONFIG.player.run.atlasPath
        );

        const slime = ASSETS_CONFIG.enemies.slime;
        slime.walkFrames.forEach((frame) => this.load.image(frame.key, frame.path));
        this.load.image(slime.dead.key, slime.dead.path);

        this.load.image(ASSETS_CONFIG.breakableBlock.key, ASSETS_CONFIG.breakableBlock.path);
        this.load.image(ASSETS_CONFIG.projectile.key, ASSETS_CONFIG.projectile.path);
        ASSETS_CONFIG.items.forEach((item) => this.load.image(item.key, item.path));
    }

    create() {
        createAnimations(this);
        this.scene.start('MainMenu');
    }
}
