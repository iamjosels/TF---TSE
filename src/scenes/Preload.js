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
    if (!texture || typeof texture.getSourceImage !== 'function' || !targetHeight) return 1;
    const src = texture.getSourceImage();
    return src.height > 0 ? targetHeight / src.height : 1;
}

function buildSpriteMetrics(scene, key, targetHeight, frames = 1) {
    const texture = scene.textures.get(key);
    const src = texture?.getSourceImage?.();
    const srcWidth = src?.width || 0;
    const srcHeight = src?.height || 0;
    const scale = computeScaleForTarget(texture, targetHeight);
    const frameWidth = frames > 1 && srcWidth ? srcWidth / frames : srcWidth;
    const frameHeight = srcHeight;
    return {
        scale,
        src: { width: srcWidth, height: srcHeight },
        displayWidth: srcWidth * scale,
        displayHeight: srcHeight * scale,
        frameWidth,
        frameHeight,
        frameDisplayWidth: frameWidth * scale,
        frameDisplayHeight: frameHeight * scale
    };
}

function buildMetrics(scene) {
    const targets = ASSETS_CONFIG.targets;

    const playerMetrics = buildSpriteMetrics(scene, ASSETS_CONFIG.player.idle.key, targets.playerHeight);
    const walkMetrics = buildSpriteMetrics(
        scene,
        ASSETS_CONFIG.player.walk.key,
        targets.playerHeight,
        ASSETS_CONFIG.player.walk.frames
    );

    const enemyMetrics = {};
    Object.entries(ASSETS_CONFIG.enemies).forEach(([type, enemy]) => {
        const key = enemy.walk?.key || enemy.idle?.key;
        enemyMetrics[type] = buildSpriteMetrics(scene, key, enemy.height || targets.enemyHeight);
    });

    const projMetrics = buildSpriteMetrics(scene, ASSETS_CONFIG.projectile.key, targets.projectileHeight);
    const blockMetrics = buildSpriteMetrics(scene, ASSETS_CONFIG.breakableBlock.key, targets.breakableHeight);
    const platformMetrics = buildSpriteMetrics(scene, ASSETS_CONFIG.tiles.key, targets.platformHeight);
    const itemMetrics = buildSpriteMetrics(scene, ASSETS_CONFIG.items[0].key, targets.itemHeight);

    const iconSourceKey = ASSETS_CONFIG.powerups.shield.iconKey || ASSETS_CONFIG.powerups.shield.key;
    const iconTex = scene.textures.get(iconSourceKey) || scene.textures.get(ASSETS_CONFIG.items[0].key);
    const iconScale = computeScaleForTarget(iconTex, targets.iconHeight);

    return {
        player: {
            ...playerMetrics,
            walk: walkMetrics
        },
        enemies: enemyMetrics,
        projectile: projMetrics,
        block: blockMetrics,
        platform: platformMetrics,
        item: itemMetrics,
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
        this.load.image('menu-bg', 'assets/MainMenu.png');
        this.load.image('instructions-bg', 'assets/Instrucciones.png');
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
        this.load.image(ASSETS_CONFIG.boss.idle.key, ASSETS_CONFIG.boss.idle.path);
        this.load.image(ASSETS_CONFIG.boss.move.key, ASSETS_CONFIG.boss.move.path);
        this.load.image(ASSETS_CONFIG.boss.hit.key, ASSETS_CONFIG.boss.hit.path);
        this.load.image(ASSETS_CONFIG.boss.dead.key, ASSETS_CONFIG.boss.dead.path);
        this.load.spritesheet(ASSETS_CONFIG.bossReaper.run.key, ASSETS_CONFIG.bossReaper.run.path, {
            frameWidth: ASSETS_CONFIG.bossReaper.run.frameWidth,
            frameHeight: ASSETS_CONFIG.bossReaper.run.frameHeight
        });
        this.load.spritesheet(ASSETS_CONFIG.bossReaper.idle.key, ASSETS_CONFIG.bossReaper.idle.path, {
            frameWidth: ASSETS_CONFIG.bossReaper.idle.frameWidth,
            frameHeight: ASSETS_CONFIG.bossReaper.idle.frameHeight
        });
        this.load.spritesheet(ASSETS_CONFIG.bossReaper.hit.key, ASSETS_CONFIG.bossReaper.hit.path, {
            frameWidth: ASSETS_CONFIG.bossReaper.run.frameWidth,
            frameHeight: ASSETS_CONFIG.bossReaper.run.frameHeight
        });
        this.load.spritesheet(ASSETS_CONFIG.bossReaper.dead.key, ASSETS_CONFIG.bossReaper.dead.path, {
            frameWidth: ASSETS_CONFIG.bossReaper.run.frameWidth,
            frameHeight: ASSETS_CONFIG.bossReaper.run.frameHeight
        });

        // Audio
        this.load.audio('music-menu', 'assets/musica/Prehistorik 2 - Monster.mp3');
        this.load.audio('music-game', 'assets/musica/Soul Knight Prequel OST _ Dungeon 04.mp3');
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
