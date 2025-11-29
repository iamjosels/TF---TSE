export const ASSETS_CONFIG = {
    background: { key: 'bg-cave', path: 'assets/New Assets/bg.png' },
    tiles: {
        key: 'tiles-platform',
        path: 'assets/New Assets/platform.png'
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
            walkFrames: [
                { key: 'slime-walk-1', path: 'assets/New Assets/g_walk1.png' },
                { key: 'slime-walk-2', path: 'assets/New Assets/g_walk2.png' }
            ],
            dead: { key: 'slime-dead', path: 'assets/New Assets/g_dead.png' }
        }
    },
    breakableBlock: {
        key: 'breakable-block',
        path: 'assets/New Assets/breakable.png'
    },
    projectile: {
        key: 'projectile-hammer',
        path: 'assets/New Assets/projectile.png',
        bounce: 0.82
    },
    items: [
        { key: 'coin', path: 'assets/New Assets/coin.png', score: 25 },
        { key: 'gem-heart', path: 'assets/New Assets/gemheart.png', score: 125 }
    ],
    powerups: {
        tripleShot: {
            key: 'powerup-triple',
            path: 'assets/New Assets/coin.png',
            iconKey: 'icon-triple',
            duration: 10000,
            popup: 'TRIPLE SHOT!'
        },
        shield: {
            key: 'powerup-shield',
            path: 'assets/New Assets/gemheart.png',
            iconKey: 'icon-shield',
            duration: 0,
            popup: 'SHIELD!'
        },
        freezeZone: {
            key: 'powerup-freeze',
            path: 'assets/New Assets/projectile.png',
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
        enemyHeight: 42,
        projectileHeight: 18,
        breakableHeight: 52,
        platformHeight: 48,
        itemHeight: 28,
        iconHeight: 28
    }
};
