import { ASSETS_CONFIG } from '../../config/assetsConfig.js';
import { POWERUP_BEHAVIOR } from '../../config/powerupsConfig.js';

export class PowerupPickup extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, typeKey) {
        const config = ASSETS_CONFIG.powerups[typeKey];
        super(scene, x, y, config.key);
        this.typeKey = typeKey;
        this.config = config;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        const metrics = scene.registry.get('assetMetrics') || {};
        const itemMetrics = metrics.item || {};
        this.setOrigin(0.5, 1);
        const scale = itemMetrics.scale || 0.85;
        this.setScale(scale);
        this.setBounce(0.25);
        this.setCollideWorldBounds(true);

        const src = scene.textures.get(this.texture.key).getSourceImage();
        const bodyWidth = src.width * 0.6;
        const bodyHeight = src.height * 0.6;
        this.body.setSize(bodyWidth, bodyHeight);
        this.body.setOffset((src.width - bodyWidth) / 2, src.height - bodyHeight);
    }

    apply(player) {
        const behavior = POWERUP_BEHAVIOR[this.typeKey];
        if (behavior) {
            player.applyPowerup(this.typeKey, behavior);
        }
        this.scene.hud?.activatePowerup(
            this.typeKey,
            this.config.iconKey || this.config.key,
            behavior?.duration || 0,
            this.config.popup
        );
        this.scene.playPowerupSound?.(this.typeKey);

        if (this.config.popup) {
            this.scene.hud?.showPopup(this.config.popup, player.x, player.y - 40);
        }
        this.destroy();
    }
}
