import { ASSETS_CONFIG } from '../config/assetsConfig.js';

export class BreakableBlock extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, ASSETS_CONFIG.breakableBlock.key);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
        this.setOrigin(0.5, 1);
        // Slightly scale to better match the Kenney crate proportions.
        this.setScale(1);
        const bodyWidth = this.width * 0.95;
        const bodyHeight = this.height * 0.95;
        this.body.setSize(bodyWidth, bodyHeight);
        this.body.setOffset((this.width - bodyWidth) / 2, this.height - bodyHeight);
    }

    shatter() {
        this.disableBody(true, true);
    }
}
