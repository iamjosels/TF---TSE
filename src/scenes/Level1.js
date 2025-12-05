import { CavernBase } from './CavernBase.js';

const LEVEL1_LAYOUT = {
    title: 'Level 1 - Cavern Entry',
    nextScene: 'Level2',
    enemyScore: 60,
    playerSpawn: { x: 640, y: 140 },
    exitY: 700,
    hazardY: 760,
    exitLabel: 'Exit v',
    boss: { x: 1100, y: 420 },
    aidDropInterval: 10000,
    platforms: [
        // Floor
        { x: 160, y: 680, scaleX: 2.3 },
        { x: 400, y: 680, scaleX: 2.3 },
        { x: 640, y: 680, scaleX: 2.3 },
        { x: 880, y: 680, scaleX: 2.3 },
        { x: 1120, y: 680, scaleX: 2.3 },
        // Mid ledges
        { x: 220, y: 560, scaleX: 2.4 },
        { x: 1060, y: 560, scaleX: 2.4 },
        { x: 640, y: 520, scaleX: 3.0 },
        { x: 360, y: 430, scaleX: 2.2 },
        { x: 920, y: 430, scaleX: 2.2},
        { x: 640, y: 350, scaleX: 2.1 },
        { x: 320, y: 260, scaleX: 1.8 },
        { x: 960, y: 260, scaleX: 1.8 },
        { x: 640, y: 180, scaleX: 1.6 }
    ],
    breakables: [
        { x: 520, y: 640 },
        { x: 760, y: 640 },
        { x: 640, y: 590 },
        { x: 360, y: 410 },
        { x: 920, y: 410 },
        { x: 640, y: 320 },
        { x: 320, y: 240 },
        { x: 960, y: 240 }
    ],
    enemies: [
        { x: 1040, y: 540, patrol: { left: 880, right: 1180 }, type: 'slime', speed: 90 },
        { x: 240, y: 540, patrol: { left: 120, right: 420 }, type: 'slimeBlue', speed: 60 },
        { x: 800, y: 320, patrol: { left: 520, right: 780 }, type: 'spider', speed: 130 }
    ]
};

export class Level1 extends CavernBase {
    constructor() {
        super('Level1', LEVEL1_LAYOUT);
    }
}
