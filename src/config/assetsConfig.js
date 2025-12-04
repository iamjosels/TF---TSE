export const ASSETS_CONFIG = {
    background: { key: 'bg-cave', path: 'assets/super_pixel_cave/style_A/PNG/bg1.png' },
    tiles: {
        key: 'tiles-platform',
        path: 'assets/super_pixel_cave/style_A/PNG/terrain_platform_center.png'
    },
    player: {
        origin: { x: 0.5, y: 1 },
        idle: { key: 'player-idle', path: 'assets/New Assets/p_stand.png' },
        jump: { key: 'player-jump', path: 'assets/New Assets/p_jump.png' },
        hurt: { key: 'player-hurt', path: 'assets/New Assets/p_hurt.png' },
        walk: { key: 'player-walk', path: 'assets/New Assets/p_walkcycle.png', frames: 2 }
    },
    enemies: {
        slime: {
            idle: { key: 'slime-idle', path: 'assets/Extra animations and enemies/Enemy sprites/slimeGreen.png' },
            walk: { key: 'slime-walk', path: 'assets/Extra animations and enemies/Enemy sprites/slimeGreen_walk.png' },
            dead: { key: 'slime-dead', path: 'assets/Extra animations and enemies/Enemy sprites/slimeGreen_dead.png' },
            hit: { key: 'slime-hit', path: 'assets/Extra animations and enemies/Enemy sprites/slimeGreen_hit.png' },
            speed: 90,
            height: 38
        },
        slimeBlue: {
            idle: { key: 'slimeBlue-idle', path: 'assets/Extra animations and enemies/Enemy sprites/slimeBlue.png' },
            walk: { key: 'slimeBlue-walk', path: 'assets/Extra animations and enemies/Enemy sprites/slimeBlue_blue.png' },
            dead: { key: 'slimeBlue-dead', path: 'assets/Extra animations and enemies/Enemy sprites/slimeBlue_dead.png' },
            hit: { key: 'slimeBlue-hit', path: 'assets/Extra animations and enemies/Enemy sprites/slimeBlue_hit.png' },
            speed: 60,
            height: 40
        },
        spider: {
            idle: { key: 'spider-idle', path: 'assets/Extra animations and enemies/Enemy sprites/spider.png' },
            walk: { key: 'spider-walk', path: 'assets/Extra animations and enemies/Enemy sprites/spider_walk1.png' },
            dead: { key: 'spider-dead', path: 'assets/Extra animations and enemies/Enemy sprites/spider_dead.png' },
            hit: { key: 'spider-hit', path: 'assets/Extra animations and enemies/Enemy sprites/spider_hit.png' },
            speed: 130,
            height: 35
        }
    },
    breakableBlock: {
        key: 'breakable-block',
        path: 'assets/Base pack/Tiles/box.png'
    },
    projectile: {
        key: 'projectile-hammer',
        path: 'assets/New Assets/projectile.png',
        bounce: 0.82
    },
    items: [
        { key: 'coin', path: 'assets/Base pack/Items/coinGold.png', score: 25 },
        { key: 'gem-heart', path: 'assets/Base pack/Items/gemRed.png', score: 125 }
    ],
    powerups: {
        tripleShot: {
            key: 'powerup-triple',
            path: 'assets/Base pack/Items/star.png',
            iconKey: 'icon-triple',
            duration: 10000,
            popup: 'TRIPLE SHOT!'
        },
        shield: {
            key: 'powerup-shield',
            path: 'assets/Request pack/Tiles/shieldGold.png',
            iconKey: 'icon-shield',
            duration: 0,
            popup: 'SHIELD!'
        },
        freezeZone: {
            key: 'powerup-freeze',
            path: 'assets/Ice expansion/Tiles/snowBall.png',
            iconKey: 'icon-freeze',
            duration: 7000,
            popup: 'FREEZE ZONE!'
        }
    },
    effects: {
        shieldAura: { key: 'fx-shield-aura' },
        freezeRing: { key: 'fx-freeze-ring' },
        popup: { key: 'fx-popup' }
    },
    hud: {
        panel: { key: 'hud-panel' },
        smallPanel: { key: 'hud-small-panel' }
    },
    loot: {
        powerupDrop: { enemy: 0.35, block: 0.22 },
        itemDrop: { enemy: 0.65, block: 0.8 }
    },
    targets: {
        playerHeight: 46,
        enemyHeight: 38,
        projectileHeight: 18,
        breakableHeight: 42,
        platformHeight: 48,
        itemHeight: 32,
        iconHeight: 28
    }
};
