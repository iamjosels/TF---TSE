import { ASSETS_CONFIG } from '../config/assetsConfig.js';
import { addScore, ensureState, loseLife } from '../config/gameState.js';
import { Player } from '../objects/Player.js';
import { Enemy } from '../objects/Enemy.js';
import { Projectile } from '../objects/Projectile.js';
import { BreakableBlock } from '../objects/BreakableBlock.js';
import { Item } from '../objects/Item.js';

const LEVEL_CONSTANTS = {
    WORLD_WIDTH: 1280,
    WORLD_HEIGHT: 720,
    PLAYER_SPAWN: { x: 640, y: 440 },
    EXIT_Y: 700,
    HAZARD_Y: 760
};

// Layout approximates HammerFest Cavern 1: stacked ledges and bottom exit.
export class Level1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Level1' });
        this.levelFinished = false;
        this.respawning = false;
    }

    create() {
        ensureState(this);
        this.levelFinished = false;
        this.respawning = false;
        this.score = this.registry.get('score');
        this.lives = this.registry.get('lives');

        this.physics.world.setBounds(0, 0, LEVEL_CONSTANTS.WORLD_WIDTH, LEVEL_CONSTANTS.WORLD_HEIGHT);
        // Keep sides and ceiling solid, let the bottom be open so falling triggers the hazard/exit logic.
        this.physics.world.setBoundsCollision(true, true, true, false);

        this.addBackground();
        this.platforms = this.buildPlatforms();
        this.breakables = this.physics.add.staticGroup();
        this.items = this.physics.add.group({ classType: Item, runChildUpdate: false });
        this.projectiles = this.physics.add.group({ classType: Projectile, maxSize: 4, runChildUpdate: false });

        this.createBreakables();
        this.player = new Player(this, LEVEL_CONSTANTS.PLAYER_SPAWN.x, LEVEL_CONSTANTS.PLAYER_SPAWN.y);
        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        this.createEnemies();

        this.registerCollisions();
        this.createExitZone();
        this.createHUD('Level 1 - Cavern Entry');
    }

    addBackground() {
        const bg = this.add.image(0, 0, ASSETS_CONFIG.background.key).setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);
    }

    buildPlatforms() {
        const platforms = this.physics.add.staticGroup();
        const key = ASSETS_CONFIG.tiles.key;

        // Floor row built from multiple evenly scaled tiles to avoid distortion.
        [160, 400, 640, 880, 1120].forEach((x) => {
            platforms.create(x, 690, key).setScale(2.4, 1).refreshBody();
        });

        platforms.create(300, 560, key).setScale(2.2, 1).refreshBody();
        platforms.create(980, 560, key).setScale(2.2, 1).refreshBody();
        platforms.create(640, 470, key).setScale(2.6, 1).refreshBody();
        platforms.create(360, 370, key).setScale(2.0, 1).refreshBody();
        platforms.create(920, 370, key).setScale(2.0, 1).refreshBody();
        platforms.create(640, 280, key).setScale(1.8, 1).refreshBody();
        platforms.create(640, 180, key).setScale(1.4, 1).refreshBody();

        return platforms;
    }

    createBreakables() {
        // Breakable blocks in key traversal spots, as in Cavern 1.
        const positions = [
            { x: 520, y: 640 },
            { x: 760, y: 640 },
            { x: 640, y: 520 },
            { x: 360, y: 340 },
            { x: 920, y: 340 },
            { x: 640, y: 250 }
        ];

        positions.forEach((pos) => {
            const block = new BreakableBlock(this, pos.x, pos.y);
            this.breakables.add(block);
            block.refreshBody();
        });
    }

    createEnemies() {
        const enemyConfigs = [
            { x: 980, y: 530, patrol: { left: 820, right: 1150 } },
            { x: 300, y: 530, patrol: { left: 180, right: 460 } }
        ];

        enemyConfigs.forEach((config) => {
            const enemy = new Enemy(this, config.x, config.y, config.patrol);
            this.enemies.add(enemy);
        });
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

        this.physics.add.collider(this.projectiles, this.platforms, (projectile) => projectile.countBounce && projectile.countBounce());
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleProjectileHitEnemy, null, this);
        this.physics.add.overlap(this.projectiles, this.breakables, this.handleProjectileHitBlock, null, this);

        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);
        this.physics.add.overlap(this.player, this.items, this.handleItemPickup, null, this);
    }

    createExitZone() {
        // Invisible exit at the bottom; overlap to progress to Level 2 (mirrors HammerFest drop-down exits).
        this.exitZone = this.add.zone(LEVEL_CONSTANTS.WORLD_WIDTH / 2, LEVEL_CONSTANTS.EXIT_Y, LEVEL_CONSTANTS.WORLD_WIDTH, 60);
        this.physics.add.existing(this.exitZone, true);
        this.physics.add.overlap(this.player, this.exitZone, this.handleExit, null, this);

        this.add.text(640, LEVEL_CONSTANTS.EXIT_Y - 20, 'Exit v', {
            fontSize: '18px',
            color: '#ffe28a'
        }).setOrigin(0.5);
    }

    createHUD(titleText) {
        this.scoreText = this.add.text(20, 20, `Score: ${this.score}`, {
            fontSize: '20px',
            color: '#ffffff'
        }).setScrollFactor(0);

        this.livesText = this.add.text(20, 50, `Lives: ${this.lives}`, {
            fontSize: '20px',
            color: '#ffffff'
        }).setScrollFactor(0);

        this.bannerText = this.add.text(640, 80, titleText || '', {
            fontSize: '26px',
            color: '#ffe28a',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0);
    }

    handleProjectileHitEnemy = (projectile, enemy) => {
        if (!enemy.active) return;
        enemy.takeHit();
        this.score = addScore(this, 50);
        this.updateHUD();
        this.spawnItem(enemy.x, enemy.y - 10);
        projectile.registerHit();
    };

    handleProjectileHitBlock = (projectile, block) => {
        if (!block.active) return;
        block.shatter();
        this.spawnItem(block.x, block.y - 15);
        projectile.registerHit();
    };

    handlePlayerEnemyCollision = () => {
        if (!this.respawning && this.player.active) {
            this.handlePlayerDeath();
        }
    };

    handleItemPickup = (player, item) => {
        if (!item.active) return;
        this.score = addScore(this, item.scoreValue || 0);
        item.destroy();
        this.updateHUD();
    };

    handlePlayerDeath() {
        if (this.respawning || this.levelFinished) return;
        // Lives/respawn loop using shared registry state.
        this.respawning = true;
        this.lives = loseLife(this);
        this.updateHUD();
        this.player.disableBody(true, true);

        if (this.lives <= 0) {
            this.bannerText.setText('Out of lives! Returning to menu...');
            this.time.delayedCall(1200, () => this.scene.start('MainMenu'));
            return;
        }

        this.bannerText.setText('Ouch! Respawning...');
        this.time.delayedCall(900, () => {
            this.player.reset(LEVEL_CONSTANTS.PLAYER_SPAWN.x, LEVEL_CONSTANTS.PLAYER_SPAWN.y);
            this.respawning = false;
            this.bannerText.setText('');
        });
    }

    handleExit = () => {
        if (this.levelFinished) return;
        this.levelFinished = true;
        this.bannerText.setText('Level 1 clear! Descending...');
        this.time.delayedCall(900, () => {
            this.scene.start('Level2');
        });
    };

    spawnItem(x, y) {
        // Random drop uses config for easy art swaps.
        const drop = Phaser.Utils.Array.GetRandom(ASSETS_CONFIG.items);
        const item = new Item(this, x, y, drop.key, drop.score);
        this.items.add(item);
        this.physics.add.collider(item, this.platforms);
        this.physics.add.collider(item, this.breakables);
    }

    update(time) {
        if (this.levelFinished) return;

        this.player.update(time, this.projectiles);
        this.enemies.children.iterate((enemy) => {
            if (enemy && enemy.active) {
                enemy.update();
            }
        });

        if (this.player.active && this.player.y > LEVEL_CONSTANTS.HAZARD_Y) {
            this.handlePlayerDeath();
        }
    }

    updateHUD() {
        this.scoreText.setText(`Score: ${this.score}`);
        this.livesText.setText(`Lives: ${this.lives}`);
    }
}
