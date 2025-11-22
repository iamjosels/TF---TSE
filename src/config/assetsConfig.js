export const ASSETS_CONFIG = {
    background: { key: 'bg', path: 'assets/Base pack/bg.png' },
    tiles: { key: 'tiles', path: 'assets/Base pack/Tiles/snow.png' },
    player: {
        scale: 1.05,
        idle: { key: 'player-idle', path: 'assets/Base pack/Player/p1_stand.png' },
        jump: { key: 'player-jump', path: 'assets/Base pack/Player/p1_jump.png' },
        hurt: { key: 'player-hurt', path: 'assets/Base pack/Player/p1_hurt.png' },
        run: {
            key: 'player-run',
            texturePath: 'assets/Base pack/Player/p1_walk/p1_walk.png',
            atlasPath: 'assets/Base pack/Player/p1_walk/p1_walk.json'
        }
    },
    enemies: {
        slime: {
            scale: 1.0,
            key: 'slime',
            walkFrames: [
                { key: 'slime-walk-1', path: 'assets/Base pack/Enemies/slimeWalk1.png' },
                { key: 'slime-walk-2', path: 'assets/Base pack/Enemies/slimeWalk2.png' }
            ],
            dead: { key: 'slime-dead', path: 'assets/Base pack/Enemies/slimeDead.png' }
        }
    },
    breakableBlock: { key: 'breakable-block', path: 'assets/Base pack/Tiles/dirt.png' },
    projectile: { key: 'projectile', path: 'assets/Base pack/Items/coinGold.png', scale: 0.9 },
    items: [
        { key: 'coin', path: 'assets/Base pack/Items/coinGold.png', score: 10 },
        { key: 'gem', path: 'assets/Base pack/Items/gemBlue.png', score: 50 }
    ]
};
