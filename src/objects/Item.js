export class Item extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key, scoreValue = 10) {
        super(scene, x, y, key);
        this.scoreValue = scoreValue;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 1);
        const metrics = scene.registry.get('assetMetrics') || {};
        const itemMetrics = metrics.item || {};
        const scale = itemMetrics.scale || 0.85;
        this.setScale(scale);
        this.setBounce(0.25);
        this.setCollideWorldBounds(true);
        const src = scene.textures.get(this.texture.key).getSourceImage();
        const displayW = itemMetrics.displayWidth || src.width * scale;
        const displayH = itemMetrics.displayHeight || src.height * scale;
        const bodyWidth = displayW * 0.62;
        const bodyHeight = displayH * 0.62;
        this.body.setSize(bodyWidth, bodyHeight);
        this.body.setOffset((displayW - bodyWidth) / 2, displayH - bodyHeight);
    }
}
