import { ASSETS_CONFIG } from '../config/assetsConfig.js';

const PROJECTILE_CONSTANTS = {
    SPEED: 540,
    LIFETIME: 3400,
    ARC_Y: -260,
    BOUNCE: ASSETS_CONFIG.projectile.bounce || 0.82,
    MAX_BOUNCES: 4,
    MAX_HITS: 3
};

export class Projectile extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, ASSETS_CONFIG.projectile.key);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        const metrics = scene.registry.get('assetMetrics') || {};
        const projMetrics = metrics.projectile || {};
        this.setOrigin(0.5, 0.5);
        const scale = projMetrics.scale || 1;
        this.setScale(scale);
        this.setActive(false);
        this.setVisible(false);
        this.body.setAllowGravity(true);
        const src = scene.textures.get(this.texture.key).getSourceImage();
        const w = src.width * 0.8;
        const h = src.height * 0.8;
        this.body.setSize(w, h);
        this.body.setOffset((src.width - w) / 2, (src.height - h) / 2);

        this.bounceCount = 0;
        this.hitCount = 0;
        this.isMarkedDestroy = false;

        this.onWorldBoundsHandler = (body) => {
            if (body.gameObject === this) {
                this.countBounce();
            }
        };
        this.scene.physics.world.on('worldbounds', this.onWorldBoundsHandler);
    }

    fire(x, y, direction, angle = 0) {
        this.body.reset(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.body.enable = true;
        this.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.setBounce(PROJECTILE_CONSTANTS.BOUNCE);
        this.body.setAllowGravity(true);
        this.body.setDrag(0, 0);
        this.bounceCount = 0;
        this.hitCount = 0;
        this.isMarkedDestroy = false;

        const baseVector = new Phaser.Math.Vector2(
            PROJECTILE_CONSTANTS.SPEED * direction,
            PROJECTILE_CONSTANTS.ARC_Y
        );
        const rotated = baseVector.rotate(Phaser.Math.DegToRad(angle * direction));
        this.setVelocity(rotated.x, rotated.y);

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
