import { ASSETS_CONFIG } from '../config/assetsConfig.js';

const ENEMY_CONSTANTS = {
    SPEED: 80,
    SCALE: ASSETS_CONFIG.enemies.slime.scale || 1,
    BODY_WIDTH_FACTOR: 0.8,
    BODY_HEIGHT_FACTOR: 0.7
};

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, patrolRange = { left: x - 120, right: x + 120 }, speed = ENEMY_CONSTANTS.SPEED) {
        super(scene, x, y, ASSETS_CONFIG.enemies.slime.walkFrames[0].key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 1);
        this.setScale(ENEMY_CONSTANTS.SCALE);
        this.setCollideWorldBounds(true);
        this.setBounce(1, 0);
        const bodyWidth = this.width * ENEMY_CONSTANTS.BODY_WIDTH_FACTOR;
        const bodyHeight = this.height * ENEMY_CONSTANTS.BODY_HEIGHT_FACTOR;
        this.body.setSize(bodyWidth, bodyHeight);
        this.body.setOffset((this.width - bodyWidth) / 2, this.height - bodyHeight);

        this.direction = -1;
        this.patrolLeft = patrolRange.left;
        this.patrolRight = patrolRange.right;
        this.speed = speed;

        this.play('slime-walk');
    }

    update() {
        if (!this.body) return;

        if (this.body.blocked.right || this.x >= this.patrolRight) {
            this.direction = -1;
        } else if (this.body.blocked.left || this.x <= this.patrolLeft) {
            this.direction = 1;
        }

        this.setVelocityX(this.direction * this.speed);
        this.setFlipX(this.direction > 0);

        if (!this.anims.isPlaying || this.anims.currentAnim.key !== 'slime-walk') {
            this.play('slime-walk', true);
        }
    }

    turnAround() {
        this.direction *= -1;
        this.setVelocityX(this.direction * this.speed);
    }

    takeHit() {
        this.disableBody(true, true);
    }

    isAlive() {
        return this.active;
    }
}
