import { ASSETS_CONFIG } from '../config/assetsConfig.js';

export class BreakableBlock extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, ASSETS_CONFIG.breakableBlock.key);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
        const metrics = scene.registry.get('assetMetrics') || {};
        const blockMetrics = metrics.block || {};
        this.setOrigin(0.5, 1.5);
        this.setScale(blockMetrics.scale || 1);
        const src = scene.textures.get(this.texture.key).getSourceImage();
        const scale = blockMetrics.scale || 1;
        const displayW = src.width * scale;
        const displayH = src.height * scale;
        this.body.setSize(displayW, displayH);
        this.body.setOffset(0, 0);
        this.body.immovable = true;
        if (this.body.updateFromGameObject) {
            this.body.updateFromGameObject();
        }
    }

    shatter() {
        this.disableBody(true, true);
    }
}
