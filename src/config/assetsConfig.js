export const ASSETS_CONFIG = {
    background: { key: 'bg-cave', path: 'assets/New Assets/bg.png' },
    tiles: {
        key: 'tiles-castle',
        path: 'assets/New Assets/platform.png',
        scale: 1
    },
    player: {
        scale: 0.55,
        origin: { x: 0.5, y: 1 },
        idle: { key: 'player-idle', path: 'assets/New Assets/p_stand.png' },
        jump: { key: 'player-jump', path: 'assets/New Assets/p_jump.png' },
        hurt: { key: 'player-hurt', path: 'assets/New Assets/p_hurt.png' },
        run: {
            key: 'player-run',
            texturePath: 'assets/New Assets/p_walkcycle.png',
            // aca seria cmabiar el json!
            atlasPath: 'assets/Base pack/Player/p1_walk/p1_walk.json'
        }
    },
    enemies: {
        slime: {
            scale: 0.55,
            walkFrames: [
                { key: 'slime-walk-1', path: 'assets/New Assets/g_walk1.png' },
                { key: 'slime-walk-2', path: 'assets/New Assets/g_walk2.png' }
            ],
            dead: { key: 'slime-dead', path: 'assets/New Assets/g_dead.png' }
        }
    },
    breakableBlock: {
        key: 'breakable-block',
        path: 'assets/New Assets/breakable.png',
        scale: 0.65
    },
    projectile: {
        key: 'projectile-hammer',
        path: 'assets/New Assets/projectile.png',
        scale: 0.45,
        bounce: 0.82
    },
    items: [
        { key: 'coin', path: 'assets/New Assets/coin.png', score: 25 },
        { key: 'gem-blue', path: 'assets/New Assets/gemheart.png', score: 75 },
        { key: 'gem-red', path: 'assets/New Assets/gemheart.png', score: 125 }
    ],
    powerups: {
        tripleShot: {
            key: 'powerup-triple',
            path: 'assets/New Assets/projectile.png',
            iconKey: 'icon-triple',
            duration: 10000,
            popup: 'TRIPLE SHOT!'
        },
        shield: {
            key: 'powerup-shield',
            path: 'assets/Request pack/Tiles/shieldSilver.png',
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
        panel: { key: 'hud-panel', path: 'assets/Base pack/HUD/hud_1.png' },
        smallPanel: { key: 'hud-small-panel', path: 'assets/Base pack/HUD/hud_2.png' }
    },
    loot: {
        powerupDrop: { enemy: 0.35, block: 0.22 },
        itemDrop: { enemy: 0.65, block: 0.8 }
    }
};
