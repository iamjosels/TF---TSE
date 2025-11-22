import { ASSETS_CONFIG } from '../config/assetsConfig.js';

const PLAYER_CONSTANTS = {
    MOVE_SPEED: 260,
    JUMP_VELOCITY: -540,
    SHOOT_COOLDOWN: 360,
    MAX_ACTIVE_PROJECTILES: 2,
    SCALE: ASSETS_CONFIG.player.scale || 1,
    BODY_WIDTH_FACTOR: 0.55,
    BODY_HEIGHT_FACTOR: 0.9
};

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, ASSETS_CONFIG.player.idle.key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Bottom-centered origin and tuned hitbox keep jumps/landings fair and visually aligned.
        this.setOrigin(0.5, 1);
        this.setScale(PLAYER_CONSTANTS.SCALE);
        this.setCollideWorldBounds(true);
        this.setBounce(0.05);

        // Tighten hitbox slightly for fair collisions.
        const bodyWidth = this.width * PLAYER_CONSTANTS.BODY_WIDTH_FACTOR;
        const bodyHeight = this.height * PLAYER_CONSTANTS.BODY_HEIGHT_FACTOR;
        this.body.setSize(bodyWidth, bodyHeight);
        this.body.setOffset((this.width - bodyWidth) / 2, this.height - bodyHeight);

        this.facing = 1;
        this.lastShot = 0;

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
    }

    update(time, projectiles) {
        if (!this.active || !this.body) return;

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
            const spawnX = this.x + this.facing * 28;
            const spawnY = this.y - this.height * 0.4;
            const projectile = projectiles.get(spawnX, spawnY, ASSETS_CONFIG.projectile.key);
            if (projectile) {
                projectile.fire(spawnX, spawnY, this.facing);
                this.lastShot = time;
            }
        }
    }
}
