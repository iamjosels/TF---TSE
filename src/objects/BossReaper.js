import { ASSETS_CONFIG } from '../config/assetsConfig.js';

const REAPER_CONSTANTS = {
    HEALTH: 14,
    MOVE_SPEED: 180,
    DASH_SPEED: 380,
    FIRE_INTERVAL: 1600,
    PROJECTILE_SPEED: 260,
    LOW_HEALTH_THRESHOLD: 5,
    JUMP_INTERVAL: 1400,
    JUMP_VELOCITY: -520
};

export class BossReaper extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, cfg = {}) {
        super(scene, x, y, ASSETS_CONFIG.bossReaper.idle.key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5, 1);
        this.setCollideWorldBounds(true);
        this.setBounce(0.1);
        this.health = cfg.health || REAPER_CONSTANTS.HEALTH;
        this.lowHealth = false;
        this.frozen = false;
        this.dashing = false;
        this.spawnPoint = { x, y };
        const targetH = ASSETS_CONFIG.bossReaper.targetHeight || 80;
        const src = scene.textures.get(this.texture.key).getSourceImage();
        const scale = src?.height ? targetH / src.height : 1.3;
        this.setScale(scale);
        const frameW = ASSETS_CONFIG.bossReaper.run.frameWidth || src?.width || 64;
        const frameH = ASSETS_CONFIG.bossReaper.run.frameHeight || src?.height || 64;
        const displayW = frameW * scale;
        const displayH = frameH * scale;
        const bodyW = displayW * 0.5;
        const bodyH = displayH * 0.7;
        this.body.setSize(bodyW, bodyH);
        this.body.setOffset((displayW - bodyW) / 2, displayH - bodyH);
        this.play('reaper-run');

        this.fireTimer = scene.time.addEvent({
            delay: cfg.fireInterval || REAPER_CONSTANTS.FIRE_INTERVAL,
            loop: true,
            callback: () => this.throwShadowBolt()
        });

        this.dashTimer = scene.time.addEvent({
            delay: 2200,
            loop: true,
            callback: () => this.dashTowardPlayer()
        });

        this.jumpTimer = scene.time.addEvent({
            delay: REAPER_CONSTANTS.JUMP_INTERVAL,
            loop: true,
            callback: () => this.tryJump()
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.frozen || !this.scene.player) {
            this.setVelocityX(0);
            return;
        }
        const boundsY = this.scene.physics.world.bounds.height;
        if (this.y > boundsY + 40) {
            this.resetToSpawn();
            return;
        }
        if (!this.dashing) {
            const dir = Math.sign(this.scene.player.x - this.x) || 1;
            const speed = this.lowHealth ? REAPER_CONSTANTS.MOVE_SPEED * 1.2 : REAPER_CONSTANTS.MOVE_SPEED;
            this.setVelocityX(dir * speed);
            this.setFlipX(dir > 0);
        }
        if (this.body?.blocked.down && this.body?.blocked.right || this.body?.blocked.left) {
            this.tryJump();
        }
    }

    throwShadowBolt() {
        if (!this.scene || !this.scene.player || !this.active) return;
        const target = this.scene.player;
        const proj = this.scene.enemyProjectiles.get(this.x, this.y - this.displayHeight * 0.5, ASSETS_CONFIG.projectile.key);
        if (!proj) return;
        proj.setActive(true).setVisible(true);
        proj.body.enable = true;
        proj.body.setAllowGravity(false);
        proj.setCollideWorldBounds(false);
        proj.body.onWorldBounds = false;
        proj.setScale(1.05);
        const dir = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y).normalize();
        proj.setVelocity(dir.x * REAPER_CONSTANTS.PROJECTILE_SPEED, dir.y * REAPER_CONSTANTS.PROJECTILE_SPEED);
        this.scene.time.delayedCall(3000, () => {
            if (proj.active) proj.disableBody(true, true);
        });
    }

    dashTowardPlayer() {
        if (!this.active || this.frozen || !this.scene.player) return;
        this.dashing = true;
        const dir = Math.sign(this.scene.player.x - this.x) || 1;
        this.setVelocityX(dir * REAPER_CONSTANTS.DASH_SPEED);
        this.scene.time.delayedCall(400, () => {
            this.dashing = false;
        });
    }

    tryJump() {
        if (!this.active || this.frozen || !this.body?.blocked?.down) return;
        this.setVelocityY(REAPER_CONSTANTS.JUMP_VELOCITY);
    }

    takeHit() {
        if (!this.active) return;
        this.health -= 1;
        this.play('reaper-hit');
        this.setTintFill(0xffaaaa);
        this.scene.time.delayedCall(120, () => {
            this.clearTint();
        if (this.active) this.play(this.lowHealth ? 'reaper-hit' : 'reaper-run');
        });
        this.evaluateHealthState();
        if (this.health <= 0) {
            this.destroyBoss();
        }
    }

    freeze(duration = 0) {
        if (!this.active) return;
        this.frozen = true;
        this.setTint(0x8ae1ff);
        this.setVelocity(0, 0);
        if (this.freezeTimer) this.freezeTimer.remove(false);
        this.freezeTimer = this.scene.time.delayedCall(duration || 700, () => this.unfreeze());
    }

    unfreeze() {
        this.frozen = false;
        this.clearTint();
        if (this.freezeTimer) {
            this.freezeTimer.remove(false);
            this.freezeTimer = null;
        }
    }

    destroyBoss() {
        if (!this.active) return;
        if (this.fireTimer) this.fireTimer.remove(false);
        if (this.dashTimer) this.dashTimer.remove(false);
        if (this.jumpTimer) this.jumpTimer.remove(false);
        if (this.anims) {
            this.play('reaper-dead');
        }
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            y: this.y + 30,
            duration: 300,
            onComplete: () => this.disableBody(true, true)
        });
    }

    turnAround() {
        // handled by velocity flip
    }

    evaluateHealthState() {
        if (this.lowHealth) return;
        if (this.health <= REAPER_CONSTANTS.LOW_HEALTH_THRESHOLD) {
            this.lowHealth = true;
            this.setTint(0xff5555);
        }
    }

    resetToSpawn() {
        this.setPosition(this.spawnPoint.x, this.spawnPoint.y);
        this.setVelocity(0, 0);
        this.dashing = false;
        this.clearTint();
        this.frozen = false;
        this.play(this.lowHealth ? 'reaper-run' : 'reaper-run');
    }
}
