import { ASSETS_CONFIG } from '../config/assetsConfig.js';

const BASE_CRATE_COLOR = 0xb0703c; // Marrón base de la caja
const POWERUP_ACCENTS = {
    freezeZone: 0x9cdcff,
    shield: 0xf2d27c,
    tripleShot: 0xfff3a1
};

function mixTintWithBase(powerupType) {
    const accent = POWERUP_ACCENTS[powerupType];
    if (!accent || typeof Phaser === 'undefined') return null;
    const baseColor = Phaser.Display.Color.ValueToColor(BASE_CRATE_COLOR);
    const accentColor = Phaser.Display.Color.ValueToColor(accent);
    const step = 65; // 0-100: cuánto del color acento se mezcla; mantiene el marrón visible
    const mixed = Phaser.Display.Color.Interpolate.ColorWithColor(baseColor, accentColor, 100, step);
    return Phaser.Display.Color.GetColor(mixed.r, mixed.g, mixed.b);
}

export class BreakableBlock extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, powerupType = null) {
        super(scene, x, y, ASSETS_CONFIG.breakableBlock.key);
        scene.add.existing(this);
        scene.physics.add.existing(this, true);
        const metrics = scene.registry.get('assetMetrics') || {};
        const blockMetrics = metrics.block || {};
        this.powerupType = powerupType;
        this.setOrigin(0.5, 1.5);
        this.setScale(blockMetrics.scale || 1);
        const tint = mixTintWithBase(powerupType);
        if (tint) {
            this.setTint(tint);
        }
        const src = scene.textures.get(this.texture.key).getSourceImage();
        const scale = blockMetrics.scale || 1;
        const displayW = src.width * scale;
        const displayH = src.height * scale;
        this.body.setSize(displayW, displayH);
        this.body.setOffset(0, 0);
        this.body.immovable = true;
        if (this.body.updateFromGameObject) {
            this.body.updateFromGameObject();
        }
    }

    shatter() {
        this.disableBody(true, true);
    }
}
