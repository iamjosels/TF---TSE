import { ASSETS_CONFIG } from '../config/assetsConfig.js';

const PROJECTILE_CONSTANTS = {
    SPEED: 540,
    LIFETIME: 3200,
    ARC_Y: -240,
    BOUNCE: 0.82,
    MAX_BOUNCES: 4,
    MAX_HITS: 3
};

export class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, ASSETS_CONFIG.projectile.key);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0.5, 0.5);
        this.setScale(ASSETS_CONFIG.projectile.scale || 1);
        this.setActive(false);
        this.setVisible(false);
        this.body.setAllowGravity(true);
        // Slightly smaller hitbox to match the sprite size.
        const w = this.width * 0.65;
        const h = this.height * 0.65;
        this.body.setSize(w, h);
        this.body.setOffset((this.width - w) / 2, (this.height - h) / 2);

        this.bounceCount = 0;
        this.hitCount = 0;
        this.isMarkedDestroy = false;

        // Global world-bounds listener to track ricochets.
        this.onWorldBoundsHandler = (body) => {
            if (body.gameObject === this) {
                this.countBounce();
            }
        };
        this.scene.physics.world.on('worldbounds', this.onWorldBoundsHandler);
    }

    fire(x, y, direction) {
        // HammerFest-like toss: slight upward arc, bouncy, limited ricochets.
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.body.enable = true;
        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.setBounce(PROJECTILE_CONSTANTS.BOUNCE);
        this.body.setAllowGravity(true);
        this.bounceCount = 0;
        this.hitCount = 0;
        this.isMarkedDestroy = false;
        this.setVelocity(direction * PROJECTILE_CONSTANTS.SPEED, PROJECTILE_CONSTANTS.ARC_Y);

        this.scene.time.delayedCall(PROJECTILE_CONSTANTS.LIFETIME, () => {
            if (this.active) {
                this.destroyProjectile();
            }
        });
    }

    registerHit() {
        if (this.isMarkedDestroy) return;
        this.hitCount += 1;
        if (this.hitCount >= PROJECTILE_CONSTANTS.MAX_HITS) {
            this.destroyProjectile();
        }
    }

    countBounce() {
        if (this.isMarkedDestroy) return;
        this.bounceCount += 1;
        if (this.bounceCount > PROJECTILE_CONSTANTS.MAX_BOUNCES) {
            this.destroyProjectile();
        }
    }

    destroyProjectile() {
        if (this.isMarkedDestroy) return;
        this.isMarkedDestroy = true;
        this.disableBody(true, true);
        this.scene.physics.world.off('worldbounds', this.onWorldBoundsHandler);
        this.destroy();
    }
}
