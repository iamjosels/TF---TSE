import { ASSETS_CONFIG } from '../config/assetsConfig.js';
import { POWERUP_BEHAVIOR, POWERUP_TYPES } from '../config/powerupsConfig.js';

const PLAYER_CONSTANTS = {
    MOVE_SPEED: 320,
    JUMP_VELOCITY: -560,
    SHOOT_COOLDOWN: 340,
    MAX_ACTIVE_PROJECTILES: 9,
    SCALE: ASSETS_CONFIG.player.scale || 0.55,
    BODY_WIDTH_FACTOR: 0.45,
    BODY_HEIGHT_FACTOR: 0.88,
    THROW_OFFSET_X: 20,
    THROW_OFFSET_Y: 18
};

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, ASSETS_CONFIG.player.idle.key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Bottom-centered origin and tuned hitbox keep jumps/landings fair and visually aligned.
        this.setOrigin(ASSETS_CONFIG.player.origin.x, ASSETS_CONFIG.player.origin.y);
        this.setScale(PLAYER_CONSTANTS.SCALE);
        this.setCollideWorldBounds(true);
        this.setBounce(0.05);

        const bodyWidth = this.width * PLAYER_CONSTANTS.BODY_WIDTH_FACTOR;
        const bodyHeight = this.height * PLAYER_CONSTANTS.BODY_HEIGHT_FACTOR;
        this.body.setSize(bodyWidth, bodyHeight);
        this.body.setOffset((this.width - bodyWidth) / 2, this.height - bodyHeight);

        this.facing = 1;
        this.lastShot = 0;
        this.powerups = {
            [POWERUP_TYPES.TRIPLE_SHOT]: { active: false, timer: null },
            [POWERUP_TYPES.SHIELD]: { active: false },
            [POWERUP_TYPES.FREEZE_ZONE]: { active: false }
        };
        this.shieldAura = null;

        this.keys = scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            D: Phaser.Input.Keyboard.KeyCodes.D,
            W: Phaser.Input.Keyboard.KeyCodes.W,
            SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
            J: Phaser.Input.Keyboard.KeyCodes.J
        });
    }

    reset(x, y) {
        this.enableBody(true, x, y, true, true);
        this.setVelocity(0, 0);
        this.play('player-idle', true);
        this.facing = 1;
        this.setFlipX(false);
        this.clearPowerups();
    }

    clearPowerups() {
        Object.keys(this.powerups).forEach((key) => {
            this.powerups[key].active = false;
            if (this.powerups[key].timer) {
                this.powerups[key].timer.remove(false);
                this.powerups[key].timer = null;
            }
            this.scene.hud?.clearPowerup(key);
        });
        this.disableShieldAura();
    }

    disableShieldAura() {
        if (this.shieldAura) {
            this.shieldAura.destroy();
            this.shieldAura = null;
        }
        this.powerups[POWERUP_TYPES.SHIELD].active = false;
    }

    applyPowerup(type, behavior) {
        if (type === POWERUP_TYPES.TRIPLE_SHOT) {
            this.activateTripleShot(behavior.duration);
        } else if (type === POWERUP_TYPES.SHIELD) {
            this.activateShield();
        } else if (type === POWERUP_TYPES.FREEZE_ZONE) {
            this.activateFreezeZone(behavior);
        }
    }

    activateTripleShot(duration) {
        const triple = this.powerups[POWERUP_TYPES.TRIPLE_SHOT];
        triple.active = true;
        if (triple.timer) triple.timer.remove(false);
        this.setTintFill(0xfff2a8);
        this.scene.time.delayedCall(200, () => this.clearTint());

        if (duration > 0) {
            triple.timer = this.scene.time.delayedCall(duration, () => {
                triple.active = false;
                triple.timer = null;
                this.scene.hud?.clearPowerup(POWERUP_TYPES.TRIPLE_SHOT);
            });
        }
    }

    activateShield() {
        const shield = this.powerups[POWERUP_TYPES.SHIELD];
        shield.active = true;
        if (this.shieldAura) {
            this.shieldAura.destroy();
        }
        this.shieldAura = this.scene.add.sprite(this.x, this.y - 6, ASSETS_CONFIG.effects.shieldAura.key)
            .setDepth(5)
            .setScale(1.1);
        this.shieldAura.setAlpha(0.9);
        this.scene.tweens.add({
            targets: this.shieldAura,
            alpha: { from: 0.9, to: 0.6 },
            duration: 450,
            yoyo: true,
            repeat: -1
        });
    }

    activateFreezeZone(behavior) {
        const radius = behavior.radius || 220;
        const duration = behavior.duration || 7000;
        this.scene.spawnFreezeRing(this.x, this.y, radius);
        this.scene.freezeEnemiesAround(this.x, this.y, radius, duration);
        const freeze = this.powerups[POWERUP_TYPES.FREEZE_ZONE];
        freeze.active = true;

        if (freeze.timer) freeze.timer.remove(false);
        freeze.timer = this.scene.time.delayedCall(duration, () => {
            freeze.active = false;
            this.scene.hud?.clearPowerup(POWERUP_TYPES.FREEZE_ZONE);
        });
    }

    consumeShield() {
        if (this.powerups[POWERUP_TYPES.SHIELD].active) {
            this.scene.playPowerupSound?.('shield-break');
            this.powerups[POWERUP_TYPES.SHIELD].active = false;
            this.scene.tweens.add({
                targets: this.shieldAura,
                scale: { from: 1.1, to: 1.5 },
                alpha: { from: 0.9, to: 0 },
                duration: 260,
                onComplete: () => this.disableShieldAura()
            });
            return true;
        }
        return false;
    }

    update(time, projectiles) {
        if (!this.active || !this.body) return;

        if (this.shieldAura) {
            this.shieldAura.setPosition(this.x, this.y - 6);
        }

        const left = this.keys.left.isDown || this.keys.A.isDown;
        const right = this.keys.right.isDown || this.keys.D.isDown;
        const jumpHeld = this.keys.up.isDown || this.keys.W.isDown;
        const firePressed =
            Phaser.Input.Keyboard.JustDown(this.keys.SPACE) ||
            Phaser.Input.Keyboard.JustDown(this.keys.J);

        const onGround = this.body.blocked.down;

        if (left) {
            this.setVelocityX(-PLAYER_CONSTANTS.MOVE_SPEED);
            this.facing = -1;
            this.setFlipX(true);
        } else if (right) {
            this.setVelocityX(PLAYER_CONSTANTS.MOVE_SPEED);
            this.facing = 1;
            this.setFlipX(false);
        } else {
            this.setVelocityX(0);
        }

        if (jumpHeld && onGround) {
            this.setVelocityY(PLAYER_CONSTANTS.JUMP_VELOCITY);
        }

        if (!onGround) {
            this.play('player-jump', true);
        } else if (left || right) {
            this.play('player-run', true);
        } else {
            this.play('player-idle', true);
        }

        if (
            firePressed &&
            time > this.lastShot + PLAYER_CONSTANTS.SHOOT_COOLDOWN &&
            projectiles.countActive(true) < PLAYER_CONSTANTS.MAX_ACTIVE_PROJECTILES
        ) {
            this.fireProjectileSpread(projectiles);
            this.lastShot = time;
        }
    }

    fireProjectileSpread(projectiles) {
        const spawnX = this.x + this.facing * PLAYER_CONSTANTS.THROW_OFFSET_X;
        const spawnY = this.y - PLAYER_CONSTANTS.THROW_OFFSET_Y;
        const triple = this.powerups[POWERUP_TYPES.TRIPLE_SHOT].active;
        const angles = triple ? POWERUP_BEHAVIOR[POWERUP_TYPES.TRIPLE_SHOT].angles : [0];

        angles.forEach((angle) => {
            const projectile = projectiles.get(spawnX, spawnY, ASSETS_CONFIG.projectile.key);
            if (projectile) {
                projectile.fire(spawnX, spawnY, this.facing, angle);
            }
        });
    }
}
