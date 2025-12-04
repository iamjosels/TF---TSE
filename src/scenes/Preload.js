import { ASSETS_CONFIG } from '../config/assetsConfig.js';
import { createAnimations } from '../config/animations.js';

function generateEffectTextures(scene) {
    const { shieldAura, freezeRing } = ASSETS_CONFIG.effects;

    if (shieldAura && !scene.textures.exists(shieldAura.key)) {
        const g = scene.add.graphics();
        g.fillStyle(0x4bb7ff, 0.28);
        g.lineStyle(2, 0x9ed6ff, 0.9);
        g.fillCircle(28, 28, 24);
        g.strokeCircle(28, 28, 24);
        g.generateTexture(shieldAura.key, 56, 56);
        g.destroy();
    }

    if (freezeRing && !scene.textures.exists(freezeRing.key)) {
        const g = scene.add.graphics();
        const radius = 32;
        g.lineStyle(3, 0x8ae1ff, 0.85);
        g.strokeCircle(radius, radius, radius - 2);
        g.generateTexture(freezeRing.key, radius * 2, radius * 2);
        g.destroy();
    }
}

function computeScaleForTarget(texture, targetHeight) {
    if (!texture || !targetHeight) return 1;
    const src = texture.getSourceImage();
    return src.height > 0 ? targetHeight / src.height : 1;
}

function buildMetrics(scene) {
    const textures = scene.textures;
    const targets = ASSETS_CONFIG.targets;

    const playerTex = textures.get(ASSETS_CONFIG.player.idle.key);
    const playerScale = computeScaleForTarget(playerTex, targets.playerHeight);
    const playerSrc = playerTex.getSourceImage();
    const walkSrc = textures.get(ASSETS_CONFIG.player.walk.key).getSourceImage();
    const walkFrameWidth = walkSrc.width / ASSETS_CONFIG.player.walk.frames;
    const walkFrameHeight = walkSrc.height;

    const enemyKey = ASSETS_CONFIG.enemies.slime.idle.key;
    const enemyTex = textures.get(enemyKey);
    const enemyScale = computeScaleForTarget(enemyTex, targets.enemyHeight);
    const enemySrc = enemyTex.getSourceImage();

    const projTex = textures.get(ASSETS_CONFIG.projectile.key);
    const projScale = computeScaleForTarget(projTex, targets.projectileHeight);
    const projSrc = projTex.getSourceImage();

    const blockTex = textures.get(ASSETS_CONFIG.breakableBlock.key);
    const blockScale = computeScaleForTarget(blockTex, targets.breakableHeight);
    const blockSrc = blockTex.getSourceImage();

    const platformTex = textures.get(ASSETS_CONFIG.tiles.key);
    const platformScale = computeScaleForTarget(platformTex, targets.platformHeight);
    const platformSrc = platformTex.getSourceImage();

    const itemTex = textures.get(ASSETS_CONFIG.items[0].key);
    const itemScale = computeScaleForTarget(itemTex, targets.itemHeight);
    const itemSrc = itemTex.getSourceImage();

    const iconScale = computeScaleForTarget(itemTex, targets.iconHeight);

    return {
        player: {
            scale: playerScale,
            src: { width: playerSrc.width, height: playerSrc.height },
            walkFrameWidth,
            walkFrameHeight
        },
        enemy: {
            scale: enemyScale,
            src: { width: enemySrc.width, height: enemySrc.height }
        },
        projectile: {
            scale: projScale,
            src: { width: projSrc.width, height: projSrc.height }
        },
        block: {
            scale: blockScale,
            src: { width: blockSrc.width, height: blockSrc.height }
        },
        platform: {
            scale: platformScale,
            src: { width: platformSrc.width, height: platformSrc.height }
        },
        item: {
            scale: itemScale,
            src: { width: itemSrc.width, height: itemSrc.height }
        },
        iconScale
    };
}

function registerWalkSpritesheet(scene) {
    const textures = scene.textures;
    const walkCfg = ASSETS_CONFIG.player.walk;
    const baseTex = textures.get(walkCfg.key);
    if (!baseTex) return { sheetKey: walkCfg.key, frameWidth: 0, frameHeight: 0 };
    const src = baseTex.getSourceImage();
    const frameWidth = src.width / walkCfg.frames;
    const frameHeight = src.height;
    const sheetKey = `${walkCfg.key}-sheet`;
    if (!textures.exists(sheetKey)) {
        textures.addSpriteSheet(sheetKey, src, { frameWidth, frameHeight, endFrame: walkCfg.frames - 1 });
    }
    return { sheetKey, frameWidth, frameHeight };
}

export class Preload extends Phaser.Scene {
    constructor() {
        super({ key: 'Preload' });
    }

    preload() {
        this.add.text(640, 360, 'Loading...', {
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.load.image(ASSETS_CONFIG.background.key, ASSETS_CONFIG.background.path);
        this.load.image(ASSETS_CONFIG.tiles.key, ASSETS_CONFIG.tiles.path);

        const player = ASSETS_CONFIG.player;
        this.load.image(player.idle.key, player.idle.path);
        this.load.image(player.jump.key, player.jump.path);
        this.load.image(player.hurt.key, player.hurt.path);
        this.load.image(player.walk.key, player.walk.path);

        Object.values(ASSETS_CONFIG.enemies).forEach((enemy) => {
            if (enemy.idle) this.load.image(enemy.idle.key, enemy.idle.path);
            if (enemy.walk) this.load.image(enemy.walk.key, enemy.walk.path);
            if (enemy.dead) this.load.image(enemy.dead.key, enemy.dead.path);
            if (enemy.hit) this.load.image(enemy.hit.key, enemy.hit.path);
        });

        this.load.image(ASSETS_CONFIG.breakableBlock.key, ASSETS_CONFIG.breakableBlock.path);
        this.load.image(ASSETS_CONFIG.projectile.key, ASSETS_CONFIG.projectile.path);
        ASSETS_CONFIG.items.forEach((item) => this.load.image(item.key, item.path));

        Object.values(ASSETS_CONFIG.powerups).forEach((powerup) => {
            this.load.image(powerup.key, powerup.path);
            if (powerup.iconKey) {
                this.load.image(powerup.iconKey, powerup.iconPath || powerup.path);
            }
        });
    }

    create() {
        generateEffectTextures(this);
        const walkInfo = registerWalkSpritesheet(this);
        const metrics = buildMetrics(this);
        const assetMetrics = { ...metrics, walkSheet: walkInfo.sheetKey, walkFrameWidth: walkInfo.frameWidth, walkFrameHeight: walkInfo.frameHeight };
        this.registry.set('assetMetrics', assetMetrics);
        createAnimations(this, assetMetrics);
        this.scene.start('MainMenu');
    }
}
