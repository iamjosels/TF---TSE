export class Item extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key, scoreValue = 10) {
        super(scene, x, y, key);
        this.scoreValue = scoreValue;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 1);
        this.setScale(0.95);
        this.setBounce(0.25);
        this.setCollideWorldBounds(true);
        const bodyWidth = this.width * 0.7;
        const bodyHeight = this.height * 0.7;
        this.body.setSize(bodyWidth, bodyHeight);
        this.body.setOffset((this.width - bodyWidth) / 2, this.height - bodyHeight);
    }
}
