import { CavernBase } from './CavernBase.js';

const LEVEL2_LAYOUT = {
    title: 'Level 2 - Deeper Cavern',
    nextScene: 'Level3',
    enemyScore: 70,
    playerSpawn: { x: 220, y: 150 },
    exitY: 700,
    hazardY: 760,
    exitLabel: 'Exit to Cavern 3 v',
    platforms: [
        { x: 160, y: 680, scaleX: 2.3 },
        { x: 400, y: 680, scaleX: 2.3 },
        { x: 640, y: 680, scaleX: 2.3 },
        { x: 880, y: 680, scaleX: 2.3 },
        { x: 1120, y: 680, scaleX: 2.3 },
        { x: 200, y: 620, scaleX: 2.0 },
        { x: 1080, y: 620, scaleX: 2.0 },
        { x: 640, y: 580, scaleX: 3.2 },
        { x: 340, y: 500, scaleX: 2.3 },
        { x: 940, y: 500, scaleX: 2.3 },
        { x: 640, y: 420, scaleX: 3.0 },
        { x: 260, y: 340, scaleX: 2.0 },
        { x: 1020, y: 340, scaleX: 2.0 },
        { x: 640, y: 260, scaleX: 2.2 },
        { x: 360, y: 200, scaleX: 1.6 },
        { x: 920, y: 200, scaleX: 1.6 },
        { x: 640, y: 140, scaleX: 1.4 }
    ],
    breakables: [
        { x: 640, y: 640 },
        { x: 520, y: 640 },
        { x: 760, y: 640 },
        { x: 420, y: 580 },
        { x: 860, y: 580 },
        { x: 260, y: 600 },
        { x: 1020, y: 600 },
        { x: 340, y: 480 },
        { x: 940, y: 480 },
        { x: 640, y: 460 },
        { x: 260, y: 320 },
        { x: 1020, y: 320 },
        { x: 540, y: 400 },
        { x: 740, y: 400 },
        { x: 640, y: 280 },
        { x: 360, y: 180 },
        { x: 920, y: 180 }
    ],
    enemies: [
        { x: 1080, y: 600, patrol: { left: 920, right: 1180 }, speed: 120 },
        { x: 200, y: 600, patrol: { left: 100, right: 360 }, speed: 120 },
        { x: 640, y: 560, patrol: { left: 500, right: 780 }, speed: 125 },
        { x: 340, y: 480, patrol: { left: 220, right: 480 }, speed: 130 },
        { x: 940, y: 480, patrol: { left: 820, right: 1080 }, speed: 130 },
        { x: 640, y: 260, patrol: { left: 520, right: 760 }, speed: 140 }
    ]
};

export class Level2 extends CavernBase {
    constructor() {
        super('Level2', LEVEL2_LAYOUT);
    }
}
