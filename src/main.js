import { Boot } from './scenes/Boot.js';
import { Preload } from './scenes/Preload.js';
import { MainMenu } from './scenes/MainMenu.js';
import { Level1 } from './scenes/Level1.js';
import { Level2 } from './scenes/Level2.js';
import { Level3 } from './scenes/Level3.js';
import { Win } from './scenes/Win.js';
import { Instructions } from './scenes/Instructions.js';
import { Endless } from './scenes/Endless.js';

const config = {
    type: Phaser.AUTO,
    title: 'Cavernas (HammerFest Tribute)',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: true,
    scene: [Boot, Preload, MainMenu, Instructions, Endless, Level1, Level2, Level3, Win],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 900 },
            debug: false
        }
    }
};

new Phaser.Game(config);
