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
        goblin: {
            spritesheet: {
                key: 'goblin-sheet',
                path: 'assets/goblin scout/goblin scout - silhouette all animations-walk.png',
                jsonPath: 'assets/goblin scout/goblin scout - silhouette all animations-walk.json'
            },
            idle: {
                key: 'goblin-idle-sheet',
                path: 'assets/goblin scout/goblin scout - silhouette all animations-idle.png',
                jsonPath: 'assets/goblin scout/goblin scout - silhouette all animations-idle.json'
            },
            dead: {
                key: 'goblin-dead-sheet',
                path: 'assets/goblin scout/goblin scout - silhouette all animations-death 1.png',
                jsonPath: 'assets/goblin scout/goblin scout - silhouette all animations-death 1.json'
            },
            hit: {
                key: 'goblin-hit-sheet',
                path: 'assets/goblin scout/goblin scout - silhouette all animations-hit.png',
                jsonPath: 'assets/goblin scout/goblin scout - silhouette all animations-hit.json'
            }
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
        { key: 'coin', path: 'assets/MegasFoodPack-v1/cookie.png', score: 25 },
        { key: 'gem-heart', path: 'assets/MegasFoodPack-v1/red-apple.png', score: 125 }
    ],
    powerups: {
        tripleShot: {
            key: 'powerup-triple',
            path: 'assets/MegasFoodPack-v1/orange.png',
            iconKey: 'icon-triple',
            duration: 10000,
            popup: 'TRIPLE SHOT!'
        },
        shield: {
            key: 'powerup-shield',
            path: 'assets/MegasFoodPack-v1/cooked-chicken-leg.png',
            iconKey: 'icon-shield',
            duration: 0,
            popup: 'SHIELD!'
        },
        freezeZone: {
            key: 'powerup-freeze',
            path: 'assets/MegasFoodPack-v1/corn.png',
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
        enemyHeight: 48,
        projectileHeight: 18,
        breakableHeight: 52,
        platformHeight: 16,
        itemHeight: 32,
        iconHeight: 28
    }
};
