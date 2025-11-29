import { ASSETS_CONFIG } from '../config/assetsConfig.js';
import { createAnimations } from '../config/animations.js';

function generateEffectTextures(scene) {
    const { shieldAura, freezeRing } = ASSETS_CONFIG.effects;

    if (shieldAura && !scene.textures.exists(shieldAura.key)) {
        const g = scene.add.graphics();
        g.fillStyle(0x4bb7ff, 0.28);
        g.lineStyle(2, 0x9ed6ff, 0.9);
        g.fillCircle(28, 28, 24);
        g.strokeCircle(28, 28, 24);
        g.generateTexture(shieldAura.key, 56, 56);
        g.destroy();
    }

    if (freezeRing && !scene.textures.exists(freezeRing.key)) {
        const g = scene.add.graphics();
        const radius = 32;
        g.lineStyle(3, 0x8ae1ff, 0.85);
        g.strokeCircle(radius, radius, radius - 2);
        g.generateTexture(freezeRing.key, radius * 2, radius * 2);
        g.destroy();
    }
}

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

        const player = ASSETS_CONFIG.player;
        this.load.image(player.idle.key, player.idle.path);
        this.load.image(player.jump.key, player.jump.path);
        this.load.image(player.hurt.key, player.hurt.path);
        this.load.atlas(player.run.key, player.run.texturePath, player.run.atlasPath);

        Object.values(ASSETS_CONFIG.enemies).forEach((enemy) => {
            enemy.walkFrames.forEach((frame) => this.load.image(frame.key, frame.path));
            if (enemy.dead) this.load.image(enemy.dead.key, enemy.dead.path);
        });

        this.load.image(ASSETS_CONFIG.breakableBlock.key, ASSETS_CONFIG.breakableBlock.path);
        this.load.image(ASSETS_CONFIG.projectile.key, ASSETS_CONFIG.projectile.path);
        ASSETS_CONFIG.items.forEach((item) => this.load.image(item.key, item.path));

        Object.values(ASSETS_CONFIG.powerups).forEach((powerup) => {
            this.load.image(powerup.key, powerup.path);
            if (powerup.iconKey) {
                this.load.image(powerup.iconKey, powerup.iconPath || powerup.path);
            }
        });

        Object.values(ASSETS_CONFIG.hud).forEach((entry) => {
            if (entry.path) {
                this.load.image(entry.key, entry.path);
            }
        });
    }

    create() {
        generateEffectTextures(this);
        createAnimations(this);
        this.scene.start('MainMenu');
    }
}
