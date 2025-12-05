import { ASSETS_CONFIG } from '../config/assetsConfig.js';

const BOSS_CONSTANTS = {
    HEALTH: 18,
    FIRE_INTERVAL: 900,
    PROJECTILE_SPEED: 430,
    MOVE_SPEED: 140,
    LOW_HEALTH_THRESHOLD: 5,
    ENRAGED_SPEED_MULT: 1.25
};

export class BossTurret extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, cfg = {}) {
        super(scene, x, y, ASSETS_CONFIG.boss.idle.key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 1);
        this.setImmovable(true);
        this.body.setAllowGravity(false);
        this.health = cfg.health || BOSS_CONSTANTS.HEALTH;
        this.firing = true;
        this.lowHealth = false;
        this.frozen = false;
        const targetH = ASSETS_CONFIG.boss.targetHeight || 70;
        const src = scene.textures.get(this.texture.key).getSourceImage();
        const scale = src?.height ? targetH / src.height : 1.4;
        this.setScale(scale);
        this.play('boss-move');
        this.spawn = { x, y };

        const fireDelay = cfg.fireInterval || BOSS_CONSTANTS.FIRE_INTERVAL;
        this.fireTimer = scene.time.addEvent({
            delay: fireDelay,
            loop: true,
            callback: () => this.fireAtPlayer()
        });
        this.healthText = scene.add.text(this.x, this.y - this.displayHeight - 8, `BOSS ${this.health}`, {
            fontSize: '16px',
            color: '#ffae00',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(20);
        this.startFloating();
    }

    update() {
        if (this.healthText && this.healthText.active) {
            this.healthText.setPosition(this.x, this.y - this.displayHeight - 8);
        }
        if (this.y > this.scene.physics.world.bounds.height + 60) {
            this.resetToSpawn();
        }
    }

    startFloating() {
        const radiusX = 180;
        const radiusY = 120;
        const origin = { x: this.x, y: this.y };
        const points = [
            { x: origin.x - radiusX, y: origin.y - radiusY },
            { x: origin.x + radiusX, y: origin.y - radiusY },
            { x: origin.x + radiusX, y: origin.y + radiusY },
            { x: origin.x - radiusX, y: origin.y + radiusY }
        ];
        let idx = 0;
        const moveNext = () => {
            if (!this.active || this.frozen) return;
            const next = points[idx % points.length];
            const dist = Phaser.Math.Distance.Between(this.x, this.y, next.x, next.y);
            const speed = this.lowHealth ? BOSS_CONSTANTS.MOVE_SPEED * BOSS_CONSTANTS.ENRAGED_SPEED_MULT : BOSS_CONSTANTS.MOVE_SPEED;
            const duration = (dist / speed) * 1000;
            this.scene.tweens.add({
                targets: this,
                x: next.x,
                y: next.y,
                duration: Math.max(300, duration),
                ease: 'Sine.easeInOut',
                onComplete: () => {
                    idx += 1;
                    moveNext();
                }
            });
        };
        moveNext();
    }

    fireAtPlayer() {
        if (!this.scene || !this.scene.player || !this.scene.enemyProjectiles || !this.active) return;
        const target = this.scene.player;
        const proj = this.scene.enemyProjectiles.get(this.x, this.y - 20, ASSETS_CONFIG.projectile.key);
        if (!proj) return;
        proj.setActive(true).setVisible(true);
        proj.body.enable = true;
        proj.body.setAllowGravity(false);
        proj.setCollideWorldBounds(false);
        proj.body.onWorldBounds = false;
        const dir = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y - 10).normalize();
        proj.setVelocity(dir.x * BOSS_CONSTANTS.PROJECTILE_SPEED, dir.y * BOSS_CONSTANTS.PROJECTILE_SPEED);
        proj.setScale(1.1);
        this.scene.time.delayedCall(3500, () => {
            if (proj.active) {
                proj.disableBody(true, true);
            }
        });
    }

    takeHit() {
        if (!this.active) return;
        this.health -= 1;
        this.play('boss-hit');
        this.scene.playBossSound?.('hit');
        this.setTintFill(0xffaaaa);
        this.scene.time.delayedCall(140, () => {
            this.clearTint();
            this.play(this.lowHealth ? 'boss-idle' : 'boss-move');
        });
        if (this.healthText) {
            this.healthText.setText(`BOSS ${Math.max(0, this.health)}`);
        }
        this.evaluateHealthState();
        if (this.health <= 0) {
            this.destroyBoss();
        }
    }

    turnAround() {
        // Boss is static; no movement flip needed.
    }

    freeze(duration = 0) {
        if (!this.active) return;
        this.frozen = true;
        this.setTint(0x8ae1ff);
        if (this.freezeTimer) this.freezeTimer.remove(false);
        this.scene.tweens.killTweensOf(this);
        this.freezeTimer = this.scene.time.delayedCall(duration || 700, () => this.unfreeze());
    }

    unfreeze() {
        this.clearTint();
        this.frozen = false;
        if (this.freezeTimer) {
            this.freezeTimer.remove(false);
            this.freezeTimer = null;
        }
        this.startFloating();
    }

    destroyBoss() {
        if (!this.active) return;
        this.firing = false;
        if (this.fireTimer) {
            this.fireTimer.remove(false);
            this.fireTimer = null;
        }
        if (this.anims) {
            this.play('boss-dead');
        }
        this.scene.playBossSound?.('death');
        this.scene.tweens.add({
            targets: [this, this.healthText],
            alpha: 0,
            y: '+=20',
            duration: 320,
            onComplete: () => {
                if (this.healthText) this.healthText.destroy();
                this.disableBody(true, true);
            }
        });
    }

    evaluateHealthState() {
        if (this.lowHealth) return;
        if (this.health <= BOSS_CONSTANTS.LOW_HEALTH_THRESHOLD) {
            this.lowHealth = true;
            this.setTint(0xff4444);
            this.play('boss-idle');
            this.startFloating();
        }
    }

    resetToSpawn() {
        this.setPosition(this.spawn?.x || this.x, this.spawn?.y || this.y);
        this.setVelocity(0, 0);
        this.frozen = false;
        this.clearTint();
        this.play(this.lowHealth ? 'boss-idle' : 'boss-move');
        if (this.healthText) {
            this.healthText.setPosition(this.x, this.y - this.displayHeight - 8);
        }
    }
}
