import { ASSETS_CONFIG } from '../config/assetsConfig.js';

const ENEMY_CONSTANTS = {
    SPEED: 90
};

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, patrolRange = { left: x - 120, right: x + 120 }, speed = ENEMY_CONSTANTS.SPEED) {
        super(scene, x, y, ASSETS_CONFIG.enemies.goblin.spritesheet.key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        const metrics = scene.registry.get('assetMetrics') || {};
        const enemyMetrics = metrics.enemy || {};

        this.setOrigin(0.5, 1);
        const scale = enemyMetrics.scale || 1;
        this.setScale(scale);
        this.setCollideWorldBounds(true);
        this.setBounce(1, 0);
        const bodyWidth = 40;
        const bodyHeight = 50;
        this.body.setSize(bodyWidth, bodyHeight);
        this.body.setOffset((64 - bodyWidth) / 2, 64 - bodyHeight);

        this.direction = -1;
        this.patrolLeft = patrolRange.left;
        this.patrolRight = patrolRange.right;
        this.speed = speed;
        this.frozen = false;
        this.freezeTimer = null;

        this.play('goblin-walk');
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

        if (!this.anims.isPlaying || this.anims.currentAnim.key !== 'goblin-walk') {
            this.play('goblin-walk', true);
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
        this.play('goblin-dead');
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
