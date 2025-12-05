import { CavernBase } from './CavernBase.js';

const LEVEL3_LAYOUT = {
    title: 'Level 3 - Hidden Cavern',
    nextScene: 'Win',
    enemyScore: 80,
    playerSpawn: { x: 220, y: 140 },
    exitY: 700,
    hazardY: 760,
    exitLabel: 'Surface exit v',
    exitMessage: 'Caverns cleared!',
    boss: [
        { kind: 'ghost', x: 1040, y: 460, health: 24, fireInterval: 700 },
        { kind: 'reaper', x: 280, y: 520, health: 24, moveSpeed: 240, dashSpeed: 420 }
    ],
    aidDropInterval: 9000,
    boss: [
        { kind: 'ghost', x: 1040, y: 460 },
        { kind: 'reaper', x: 280, y: 520 },
        { kind: 'fly', x: 640, y: 360 }
    ],
    aidDropInterval: 9000,
    platforms: [
        { x: 160, y: 680, scaleX: 2.1 },
        { x: 400, y: 680, scaleX: 2.1 },
        { x: 640, y: 680, scaleX: 2.1 },
        { x: 880, y: 680, scaleX: 2.1 },
        { x: 1120, y: 680, scaleX: 2.1 },
        { x: 220, y: 620, scaleX: 1.8 },
        { x: 1060, y: 620, scaleX: 1.8 },
        { x: 640, y: 600, scaleX: 2.4 },
        { x: 360, y: 540, scaleX: 2.0 },
        { x: 920, y: 540, scaleX: 2.0 },
        { x: 640, y: 480, scaleX: 2.4 },
        { x: 280, y: 420, scaleX: 1.8 },
        { x: 1000, y: 420, scaleX: 1.8 },
        { x: 640, y: 360, scaleX: 2.0 },
        { x: 360, y: 300, scaleX: 1.6 },
        { x: 920, y: 300, scaleX: 1.6 },
        { x: 640, y: 240, scaleX: 1.9 },
        { x: 480, y: 180, scaleX: 1.4 },
        { x: 800, y: 180, scaleX: 1.4 },
        { x: 640, y: 120, scaleX: 1.2 }
    ],
    breakables: [
        { x: 640, y: 640 },
        { x: 520, y: 640 },
        { x: 760, y: 640 },
        { x: 420, y: 600 },
        { x: 860, y: 600 },
        { x: 260, y: 620 },
        { x: 1020, y: 620 },
        { x: 360, y: 520 },
        { x: 920, y: 520 },
        { x: 640, y: 520 },
        { x: 280, y: 400 },
        { x: 1000, y: 400 },
        { x: 640, y: 440 },
        { x: 480, y: 360 },
        { x: 800, y: 360 },
        { x: 360, y: 280 },
        { x: 920, y: 280 },
        { x: 640, y: 220 },
        { x: 480, y: 160 },
        { x: 800, y: 160 }
    ],
    enemies: [
        { x: 1080, y: 600, patrol: { left: 920, right: 1180 }, speed: 140 },
        { x: 200, y: 600, patrol: { left: 100, right: 360 }, speed: 140 },
        { x: 640, y: 580, patrol: { left: 520, right: 760 }, speed: 145 },
        { x: 360, y: 520, patrol: { left: 240, right: 480 }, speed: 150 },
        { x: 920, y: 520, patrol: { left: 800, right: 1040 }, speed: 150 },
        { x: 280, y: 400, patrol: { left: 160, right: 420 }, speed: 155 },
        { x: 1000, y: 400, patrol: { left: 880, right: 1120 }, speed: 155 },
        { x: 640, y: 220, patrol: { left: 520, right: 760 }, speed: 165 }
    ]
};

export class Level3 extends CavernBase {
    constructor() {
        super('Level3', LEVEL3_LAYOUT);
    }
}
