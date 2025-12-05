import { ASSETS_CONFIG } from '../config/assetsConfig.js';
import { addScore, ensureState, loseLife, resetCombo } from '../config/gameState.js';
import { LOOT_ODDS, POWERUP_TYPES } from '../config/powerupsConfig.js';
import { Player } from '../objects/Player.js';
import { Enemy } from '../objects/Enemy.js';
import { BossTurret } from '../objects/BossTurret.js';
import { BossReaper } from '../objects/BossReaper.js';
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
        this.bosses = [];
        this.fallingPlatformData = [];
        this.debugEndKey = null;
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
        this.fallingPlatforms = this.physics.add.group({ allowGravity: false, immovable: true });
        this.platforms = this.buildPlatforms(this.levelSettings.platforms);
        this.breakables = this.physics.add.staticGroup();
        this.items = this.physics.add.group({ classType: Item, runChildUpdate: false });
        this.powerups = this.physics.add.group({ classType: PowerupPickup, runChildUpdate: false });
        this.projectiles = this.physics.add.group({ classType: Projectile, maxSize: 12, runChildUpdate: false });
        this.enemyProjectiles = this.physics.add.group({ classType: Phaser.Physics.Arcade.Image, runChildUpdate: false });

        this.createBreakables(this.levelSettings.breakables);
        this.player = new Player(this, this.levelSettings.playerSpawn.x, this.levelSettings.playerSpawn.y);
        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        this.createEnemies(this.levelSettings.enemies);
        this.createBoss(this.levelSettings.boss);
        this.player.play('player-idle', true);
        this.hud = new HUD(this, this.levelSettings.title || '');
        this.hud.setScore(this.score);
        this.hud.setLives(this.lives);
        this.debugEndKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        this.registerCollisions();
        this.createExitZone();
        this.setupAidDrops();
        this.scheduleFallingPlatforms();
    }

    addBackground() {
        const bg = this.add.image(0, 0, ASSETS_CONFIG.background.key).setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);
    }

    createParticles(x, y, color, count = 8) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 100 + Math.random() * 100;
            const particle = this.add.rectangle(x, y, 4, 4, color);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 50;
            
            this.tweens.add({
                targets: particle,
                x: x + vx * 0.5,
                y: y + vy * 0.5,
                alpha: 0,
                scale: 0.5,
                duration: 500 + Math.random() * 300,
                ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    buildPlatforms(layout) {
        const platforms = this.physics.add.staticGroup();
        const key = ASSETS_CONFIG.tiles.key;
        const metrics = this.registry.get('assetMetrics') || {};
        const baseScale = metrics.platform?.scale || 1;
        const src = this.textures.get(key).getSourceImage();
        layout.forEach((entry) => {
            if (entry.falling) {
                const scaleX = (entry.scaleX || 1) * baseScale;
                const scaleY = (entry.scaleY || 1) * baseScale;
                const platform = this.fallingPlatforms.create(entry.x, entry.y, key);
                platform.setOrigin(0.5, 1).setScale(scaleX, scaleY);
                const displayW = src.width * scaleX;
                const displayH = src.height * scaleY;
                platform.body.setSize(displayW, displayH * 0.35);
                platform.body.setOffset(0, displayH * 0.65);
                platform.body.allowGravity = false;
                platform.body.immovable = true;
                this.fallingPlatformData.push({ platform, delay: entry.fallDelay || 1400 });
                return;
            }
            const scaleX = (entry.scaleX || 1) * baseScale;
            const scaleY = (entry.scaleY || 1) * baseScale;
            const platform = platforms.create(entry.x, entry.y, key);
            platform.setOrigin(0.5, 1).setScale(scaleX, scaleY);
            const displayW = src.width * scaleX;
            const displayH = src.height * scaleY;
            platform.body.setSize(displayW, displayH * 0.35);
            platform.body.setOffset(0, displayH * 0.65);
            platform.refreshBody();
        });
        return platforms;
    }

    createBreakables(positions) {
        if (!positions) return;
        const powerupChance = LOOT_ODDS.powerupDrop.block || 0;
        positions.forEach((pos) => {
            let assignedPowerup = null;
            if (Math.random() < powerupChance) {
                const keys = Object.keys(ASSETS_CONFIG.powerups);
                assignedPowerup = Phaser.Utils.Array.GetRandom(keys);
            }
            const block = new BreakableBlock(this, pos.x, pos.y, assignedPowerup);
            this.breakables.add(block);
            block.refreshBody();
        });
    }

    createEnemies(enemyConfigs) {
        if (!enemyConfigs) return;
        enemyConfigs.forEach((config) => {
            const enemy = new Enemy(this, config.x, config.y, config.patrol, config.speed, config.type || 'slime');
            this.enemies.add(enemy);
        });
    }

    createBoss(bossConfig) {
        if (!bossConfig) return;
        const configs = Array.isArray(bossConfig) ? bossConfig : [bossConfig];
        configs.forEach((cfg) => {
            if (!cfg) return;
            let boss = null;
            if (cfg.kind === 'reaper') {
                boss = new BossReaper(this, cfg.x, cfg.y, cfg);
            } else {
                boss = new BossTurret(this, cfg.x, cfg.y, cfg);
                boss.body.setAllowGravity(false);
                boss.body.setImmovable(true);
            }
            this.enemies.add(boss);
            this.bosses.push(boss);
        });
    }

    createExitZone() {
        const exitHeight = 50;
        const exitBase = this.levelSettings.exitY || WORLD.HEIGHT;
        const exitY = exitBase - exitHeight / 2;
        this.exitZone = this.add.zone(WORLD.WIDTH / 2, exitY, WORLD.WIDTH, exitHeight);
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
        this.physics.add.collider(this.items, this.fallingPlatforms);
        this.physics.add.collider(this.items, this.breakables);
        this.physics.add.collider(this.powerups, this.platforms);
        this.physics.add.collider(this.powerups, this.fallingPlatforms);
        this.physics.add.collider(this.powerups, this.breakables);
        // Boss bullets pierce everything; no colliders to stop them

        this.physics.add.collider(this.projectiles, this.platforms, (projectile) => projectile.countBounce && projectile.countBounce());
        this.physics.add.overlap(this.projectiles, this.fallingPlatforms, (projectile) => projectile.countBounce && projectile.countBounce());
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileHitEnemy, null, this);
        this.physics.add.overlap(this.projectiles, this.breakables, this.handleProjectileHitBlock, null, this);

        this.physics.add.collider(this.player, this.fallingPlatforms);
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);
        this.physics.add.overlap(this.player, this.items, this.handleItemPickup, null, this);
        this.physics.add.overlap(this.player, this.powerups, this.handlePowerupPickup, null, this);
        this.physics.add.overlap(this.player, this.enemyProjectiles, this.handleEnemyProjectileHitPlayer, null, this);
        this.physics.add.collider(this.enemies, this.fallingPlatforms);
    }

    handleProjectileHitEnemy = (projectile, enemy) => {
        if (!enemy.active) return;
        enemy.takeHit();
        const result = addScore(this, this.levelSettings.enemyScore || 50);
        this.score = result.score;
        this.hud.setScore(this.score);
        this.spawnLoot('enemy', enemy.x, enemy.y - 10);
        
        // Particle effect on enemy death
        this.createParticles(enemy.x, enemy.y - 20, 0x90EE90, 10);
        this.cameras.main.shake(100, 0.005);
        
        projectile.registerHit();
    };

    handleProjectileHitBlock = (projectile, block) => {
        if (!block.active) return;
        block.shatter();
        this.playPowerupBlockEffect(block.powerupType, block.x, block.y);
        this.spawnLoot('block', block.x, block.y - 15, block.powerupType);
        
        // Show floating text
        this.hud.showFloatingScore(10, block.x, block.y - 15, 1);
        
        // Particle effect on block break
        this.createParticles(block.x, block.y, 0xD2691E, 12);
        
        projectile.registerHit();
    };

    handlePlayerEnemyCollision = (player, enemy) => {
        if (!this.respawning && this.player.active) {
            if (this.player.isShieldRebounding && this.player.isShieldRebounding()) return;
            const shielded = this.player.consumeShield(enemy);
            if (shielded) {
                this.hud.clearPowerup(POWERUP_TYPES.SHIELD);
                this.cameras.main.shake(120, 0.006);
                if (enemy && enemy.active) {
                    enemy.turnAround();
                }
                return;
            }
            
            // Reset combo on damage
            resetCombo(this);
            
            // Visual feedback
            this.player.takeDamage();
            this.cameras.main.shake(200, 0.01);
            
            this.handlePlayerDeath();
        }
    };

    handleItemPickup = (player, item) => {
        if (!item.active) return;
        const result = addScore(this, item.scoreValue || 0);
        this.score = result.score;
        
        // Particle effect on item pickup
        const color = item.scoreValue > 100 ? 0xFF4444 : 0xFFD700;
        this.createParticles(item.x, item.y, color, 6);
        
        item.destroy();
        this.hud.setScore(this.score);
    };

    handlePowerupPickup = (player, powerup) => {
        if (!powerup.active) return;
        powerup.apply(player);
    };

    handleEnemyProjectileHitPlayer = (player, projectile) => {
        projectile.disableBody(true, true);
        if (!this.respawning && this.player.active) {
            const shielded = this.player.consumeShield();
            if (shielded) {
                this.hud.clearPowerup(POWERUP_TYPES.SHIELD);
                this.cameras.main.shake(120, 0.006);
                return;
            }
            resetCombo(this);
            this.player.takeDamage();
            this.cameras.main.shake(160, 0.01);
            this.handlePlayerDeath();
        }
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
        const aliveBoss = this.bosses?.some((b) => b.active);
        if (aliveBoss) {
            // Punish trying to skip the boss
            if (!this.respawning) {
                const lives = loseLife(this);
                this.lives = lives;
                this.hud.setLives(lives);
                this.hud.showPopup('Derrota al jefe primero!', this.player.x, this.player.y - 40, '#ff7777');
                this.cameras.main.shake(150, 0.01);
                this.player.disableBody(true, true);
                if (lives <= 0) {
                    this.time.delayedCall(900, () => this.scene.start('MainMenu'));
                    return;
                }
                this.time.delayedCall(800, () => {
                    this.player.reset(this.levelSettings.playerSpawn.x, this.levelSettings.playerSpawn.y);
                    this.respawning = false;
                });
            }
            return;
        }
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

    spawnPowerup(x, y, forcedType = null) {
        const keys = Object.keys(ASSETS_CONFIG.powerups);
        const typeKey = forcedType || Phaser.Utils.Array.GetRandom(keys);
        const powerup = new PowerupPickup(this, x, y, typeKey);
        this.powerups.add(powerup);
    }

    spawnLoot(origin, x, y, forcedPowerupType = null) {
        const powerupChance = LOOT_ODDS.powerupDrop[origin === 'enemy' ? 'enemy' : 'block'] || 0;
        const itemChance = LOOT_ODDS.itemDrop[origin === 'enemy' ? 'enemy' : 'block'] || 0.5;

        if (forcedPowerupType) {
            this.spawnPowerup(x, y, forcedPowerupType);
            return;
        }

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

    setupAidDrops() {
        const interval = this.levelSettings.aidDropInterval || 0;
        if (!interval) return;
        this.time.addEvent({
            delay: interval,
            loop: true,
            callback: () => {
                const x = Phaser.Math.Clamp(this.player.x + Phaser.Math.Between(-120, 120), 60, WORLD.WIDTH - 60);
                this.spawnPowerup(x, -30);
            }
        });
    }

    scheduleFallingPlatforms() {
        if (!this.fallingPlatformData.length) return;
        this.fallingPlatformData.forEach(({ platform, delay }) => {
            this.time.delayedCall(delay, () => {
                if (!platform.active) return;
                platform.body.allowGravity = true;
                platform.body.immovable = false;
                this.tweens.add({
                    targets: platform,
                    alpha: { from: 1, to: 0.7 },
                    duration: 150,
                    yoyo: true,
                    repeat: 1
                });
            });
        });
    }

    playPowerupBlockEffect(type, x, y) {
        if (!type) return;
        if (type === POWERUP_TYPES.FREEZE_ZONE) {
            this.spawnFreezeRing(x, y, 120);
            this.createParticles(x, y - 10, 0x9cdcff, 10);
            return;
        }
        if (type === POWERUP_TYPES.SHIELD) {
            const aura = this.add.sprite(x, y - 10, ASSETS_CONFIG.effects.shieldAura.key).setDepth(20).setAlpha(0.9);
            const target = aura.height ? (70 / aura.height) : 1.1;
            aura.setScale(target);
            this.tweens.add({
                targets: aura,
                alpha: 0,
                scale: target * 1.4,
                duration: 320,
                onComplete: () => aura.destroy()
            });
            this.createParticles(x, y - 8, 0xf2d27c, 8);
            return;
        }
        if (type === POWERUP_TYPES.TRIPLE_SHOT) {
            this.createParticles(x, y - 10, 0xffd93b, 12);
        }
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

    playBossSound(type) {
        try {
            const ctx = this.sound?.context;
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            if (type === 'fire') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, ctx.currentTime);
                gain.gain.setValueAtTime(0.12, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
            } else if (type === 'hit') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(160, ctx.currentTime);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
            } else if (type === 'death') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(100, ctx.currentTime);
                gain.gain.setValueAtTime(0.2, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
            } else {
                return;
            }
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.45);
        } catch (e) {
            // ignore audio issues
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

        if (this.debugEndKey && Phaser.Input.Keyboard.JustDown(this.debugEndKey)) {
            this.skipLevelCheat();
        }
    }

    skipLevelCheat() {
        // Cheat: kill all bosses and advance
        this.bosses.forEach((b) => {
            if (b?.destroyBoss) {
                b.health = 0;
                b.destroyBoss();
            } else if (b?.disableBody) {
                b.disableBody(true, true);
            }
        });
        this.levelFinished = true;
        this.time.delayedCall(300, () => this.scene.start(this.levelSettings.nextScene || 'MainMenu'));
    }
}
