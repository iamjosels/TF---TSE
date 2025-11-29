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
        const bodyWidth = src.width * 0.6;
        const bodyHeight = src.height * 0.6;
        this.body.setSize(bodyWidth, bodyHeight);
        this.body.setOffset((src.width - bodyWidth) / 2, src.height - bodyHeight);
    }
}
