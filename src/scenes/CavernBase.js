import { ASSETS_CONFIG } from '../config/assetsConfig.js';
import { addScore, ensureState, loseLife } from '../config/gameState.js';
import { LOOT_ODDS, POWERUP_TYPES } from '../config/powerupsConfig.js';
import { Player } from '../objects/Player.js';
import { Enemy } from '../objects/Enemy.js';
import { Projectile } from '../objects/Projectile.js';
import { BreakableBlock } from '../objects/BreakableBlock.js';
import { Item } from '../objects/Item.js';
import { HUD } from '../objects/HUD.js';
import { PowerupPickup } from '../objects/powerups/PowerupPickup.js';

const WORLD = {
    WIDTH: 1280,
    HEIGHT: 720
};

export class CavernBase extends Phaser.Scene {
    constructor(key, levelSettings) {
        super({ key });
        this.levelSettings = levelSettings;
        this.levelFinished = false;
        this.respawning = false;
    }

    create() {
        ensureState(this);
        this.levelFinished = false;
        this.respawning = false;
        this.score = this.registry.get('score');
        this.lives = this.registry.get('lives');

        this.physics.world.setBounds(0, 0, WORLD.WIDTH, WORLD.HEIGHT);
        this.physics.world.setBoundsCollision(true, true, true, false);

        this.addBackground();
        this.platforms = this.buildPlatforms(this.levelSettings.platforms);
        this.breakables = this.physics.add.staticGroup();
        this.items = this.physics.add.group({ classType: Item, runChildUpdate: false });
        this.powerups = this.physics.add.group({ classType: PowerupPickup, runChildUpdate: false });
        this.projectiles = this.physics.add.group({ classType: Projectile, maxSize: 12, runChildUpdate: false });

        this.createBreakables(this.levelSettings.breakables);
        this.player = new Player(this, this.levelSettings.playerSpawn.x, this.levelSettings.playerSpawn.y);
        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        this.createEnemies(this.levelSettings.enemies);
        this.player.play('player-idle', true);
        this.hud = new HUD(this, this.levelSettings.title || '');
        this.hud.setScore(this.score);
        this.hud.setLives(this.lives);

        this.registerCollisions();
        this.createExitZone();
    }

    addBackground() {
        const bg = this.add.image(0, 0, ASSETS_CONFIG.background.key).setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);
    }

    buildPlatforms(layout) {
        const platforms = this.physics.add.staticGroup();
        const key = ASSETS_CONFIG.tiles.key;
        layout.forEach((entry) => {
            platforms.create(entry.x, entry.y, key)
                .setScale(entry.scaleX || ASSETS_CONFIG.tiles.scale || 1, entry.scaleY || 1)
                .refreshBody();
        });
        return platforms;
    }

    createBreakables(positions) {
        if (!positions) return;
        positions.forEach((pos) => {
            const block = new BreakableBlock(this, pos.x, pos.y);
            this.breakables.add(block);
            block.refreshBody();
        });
    }

    createEnemies(enemyConfigs) {
        if (!enemyConfigs) return;
        enemyConfigs.forEach((config) => {
            const enemy = new Enemy(this, config.x, config.y, config.patrol, config.speed);
            this.enemies.add(enemy);
        });
    }

    createExitZone() {
        const exitY = this.levelSettings.exitY || WORLD.HEIGHT - 20;
        this.exitZone = this.add.zone(WORLD.WIDTH / 2, exitY, WORLD.WIDTH, 60);
        this.physics.add.existing(this.exitZone, true);
        this.physics.add.overlap(this.player, this.exitZone, this.handleExit, null, this);

        this.add.text(WORLD.WIDTH / 2, exitY - 20, this.levelSettings.exitLabel || 'Exit v', {
            fontSize: '18px',
            color: '#ffe28a'
        }).setOrigin(0.5);
    }

    registerCollisions() {
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.breakables);

        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.enemies, this.breakables, (enemy) => enemy.turnAround());
        this.physics.add.collider(this.enemies, this.enemies, (a, b) => {
            a.turnAround();
            b.turnAround();
        });

        this.physics.add.collider(this.items, this.platforms);
        this.physics.add.collider(this.items, this.breakables);
        this.physics.add.collider(this.powerups, this.platforms);
        this.physics.add.collider(this.powerups, this.breakables);

        this.physics.add.collider(this.projectiles, this.platforms, (projectile) => projectile.countBounce && projectile.countBounce());
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileHitEnemy, null, this);
        this.physics.add.overlap(this.projectiles, this.breakables, this.handleProjectileHitBlock, null, this);

        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);
        this.physics.add.overlap(this.player, this.items, this.handleItemPickup, null, this);
        this.physics.add.overlap(this.player, this.powerups, this.handlePowerupPickup, null, this);
    }

    handleProjectileHitEnemy = (projectile, enemy) => {
        if (!enemy.active) return;
        enemy.takeHit();
        this.score = addScore(this, this.levelSettings.enemyScore || 50);
        this.hud.setScore(this.score);
        this.spawnLoot('enemy', enemy.x, enemy.y - 10);
        projectile.registerHit();
    };

    handleProjectileHitBlock = (projectile, block) => {
        if (!block.active) return;
        block.shatter();
        this.spawnLoot('block', block.x, block.y - 15);
        projectile.registerHit();
    };

    handlePlayerEnemyCollision = () => {
        if (!this.respawning && this.player.active) {
            const shielded = this.player.consumeShield();
            if (shielded) {
                this.hud.clearPowerup(POWERUP_TYPES.SHIELD);
                return;
            }
            this.handlePlayerDeath();
        }
    };

    handleItemPickup = (player, item) => {
        if (!item.active) return;
        this.score = addScore(this, item.scoreValue || 0);
        item.destroy();
        this.hud.setScore(this.score);
    };

    handlePowerupPickup = (player, powerup) => {
        if (!powerup.active) return;
        powerup.apply(player);
    };

    handlePlayerDeath() {
        if (this.respawning || this.levelFinished) return;
        this.respawning = true;
        this.lives = loseLife(this);
        this.hud.setLives(this.lives);
        this.player.disableBody(true, true);

        if (this.lives <= 0) {
            this.hud.showPopup('Out of lives!', this.player.x, this.player.y - 40, '#ff7777');
            this.time.delayedCall(1200, () => this.scene.start('MainMenu'));
            return;
        }

        this.hud.showPopup('Respawning...', this.player.x, this.player.y - 40, '#ffe28a');
        this.time.delayedCall(900, () => {
            this.player.reset(this.levelSettings.playerSpawn.x, this.levelSettings.playerSpawn.y);
            this.respawning = false;
        });
    }

    handleExit = () => {
        if (this.levelFinished) return;
        this.levelFinished = true;
        const message = this.levelSettings.exitMessage || 'Descending...';
        this.hud.showPopup(message, this.player.x, this.player.y - 40, '#ffe28a');
        this.time.delayedCall(800, () => this.scene.start(this.levelSettings.nextScene));
    };

    spawnItem(x, y) {
        const drop = Phaser.Utils.Array.GetRandom(ASSETS_CONFIG.items);
        const item = new Item(this, x, y, drop.key, drop.score);
        this.items.add(item);
    }

    spawnPowerup(x, y) {
        const keys = Object.keys(ASSETS_CONFIG.powerups);
        const typeKey = Phaser.Utils.Array.GetRandom(keys);
        const powerup = new PowerupPickup(this, x, y, typeKey);
        this.powerups.add(powerup);
    }

    spawnLoot(origin, x, y) {
        const powerupChance = LOOT_ODDS.powerupDrop[origin === 'enemy' ? 'enemy' : 'block'] || 0;
        const itemChance = LOOT_ODDS.itemDrop[origin === 'enemy' ? 'enemy' : 'block'] || 0.5;

        if (Math.random() < powerupChance) {
            this.spawnPowerup(x, y);
            return;
        }

        if (Math.random() < itemChance) {
            this.spawnItem(x, y);
        }
    }

    spawnFreezeRing(x, y, radius) {
        const ring = this.add.sprite(x, y, ASSETS_CONFIG.effects.freezeRing.key).setDepth(25).setAlpha(0.8);
        const targetScale = radius / (ring.width / 2);
        this.tweens.add({
            targets: ring,
            scale: targetScale,
            alpha: 0,
            duration: 650,
            ease: 'Cubic.easeOut',
            onComplete: () => ring.destroy()
        });
    }

    freezeEnemiesAround(x, y, radius, duration) {
        this.enemies.children.iterate((enemy) => {
            if (!enemy || !enemy.active) return;
            const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
            if (distance <= radius) {
                enemy.freeze(duration);
            }
        });
    }

    playPowerupSound(type) {
        try {
            const ctx = this.sound?.context;
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const base =
                type === POWERUP_TYPES.SHIELD || type === 'shield-break'
                    ? 420
                    : type === POWERUP_TYPES.FREEZE_ZONE
                        ? 520
                        : 680;
            osc.type = 'square';
            osc.frequency.setValueAtTime(base, ctx.currentTime);
            gain.gain.setValueAtTime(0.14, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.25);
        } catch (e) {
            // Audio not available or blocked; silently ignore.
        }
    }

    update(time) {
        if (this.levelFinished) return;

        this.player.update(time, this.projectiles);
        this.enemies.children.iterate((enemy) => {
            if (enemy && enemy.active) {
                enemy.update();
            }
        });

        const hazardY = this.levelSettings.hazardY || WORLD.HEIGHT + 40;
        if (this.player.active && this.player.y > hazardY) {
            this.handlePlayerDeath();
        }
    }
}
