import { ASSETS_CONFIG } from '../config/assetsConfig.js';

const ENEMY_CONSTANTS = {
    SPEED: 90
};

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, patrolRange = { left: x - 120, right: x + 120 }, speed = ENEMY_CONSTANTS.SPEED, type = 'slime') {
        const enemyConfig = ASSETS_CONFIG.enemies[type] || ASSETS_CONFIG.enemies.slime;
        const textureKey = enemyConfig.idle.key;
        super(scene, x, y, textureKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.enemyType = type;
        const metrics = scene.registry.get('assetMetrics') || {};
        const targetHeight = enemyConfig.height || 38;
        const src = scene.textures.get(textureKey).getSourceImage();
        const scale = src.height > 0 ? targetHeight / src.height : 1;

        this.setOrigin(0.5, 1);
        this.setScale(scale);
        this.setCollideWorldBounds(true);
        this.setBounce(1, 0);
        const bodyWidth = src.width * 0.7;
        const bodyHeight = src.height * 0.9;
        this.body.setSize(bodyWidth, bodyHeight);
        this.body.setOffset((src.width - bodyWidth) / 2, src.height - bodyHeight);

        this.direction = -1;
        this.patrolLeft = patrolRange.left;
        this.patrolRight = patrolRange.right;
        this.speed = speed || enemyConfig.speed || ENEMY_CONSTANTS.SPEED;
        this.frozen = false;
        this.freezeTimer = null;

        this.play(`${type}-walk`);
    }

    update() {
        if (!this.body || !this.active) return;
        if (this.frozen) {
            this.setVelocityX(0);
            return;
        }

        if (this.body.blocked.right || this.x >= this.patrolRight) {
            this.direction = -1;
        } else if (this.body.blocked.left || this.x <= this.patrolLeft) {
            this.direction = 1;
        }

        this.setVelocityX(this.direction * this.speed);
        this.setFlipX(this.direction > 0);

        const walkAnim = `${this.enemyType}-walk`;
        if (!this.anims.isPlaying || this.anims.currentAnim.key !== walkAnim) {
            this.play(walkAnim, true);
        }
    }

    turnAround() {
        if (this.frozen) return;
        this.direction *= -1;
        this.setVelocityX(this.direction * this.speed);
    }

    takeHit() {
        if (this.freezeTimer) {
            this.freezeTimer.remove(false);
            this.freezeTimer = null;
        }
        this.setVelocity(0, 0);
        this.play(`${this.enemyType}-dead`);
        this.scene.time.delayedCall(120, () => this.disableBody(true, true));
    }

    freeze(duration = 7000) {
        if (!this.active) return;
        if (this.freezeTimer) {
            this.freezeTimer.remove(false);
            this.freezeTimer = null;
        }
        this.frozen = true;
        this.setVelocity(0, 0);
        this.body.moves = false;
        this.setTint(0xa8e7ff);
        if (this.anims.currentAnim) {
            this.anims.pause();
        }

        this.freezeTimer = this.scene.time.delayedCall(duration, () => this.unfreeze());
    }

    unfreeze() {
        if (!this.active) return;
        this.frozen = false;
        this.body.moves = true;
        this.clearTint();
        if (this.anims.currentAnim) {
            this.anims.resume();
        }
        this.freezeTimer = null;
    }

    isAlive() {
        return this.active;
    }
}
