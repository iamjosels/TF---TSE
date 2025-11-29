import { resetGameState } from '../config/gameState.js';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        // Reset shared game state whenever we land on the menu.
        resetGameState(this);

        this.cameras.main.setBackgroundColor('#040218');

        this.add.text(640, 140, 'Cavernas', {
            fontSize: '52px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(640, 210, 'Kenney art, HammerFest mechanics', {
            fontSize: '22px',
            color: '#bbbbff'
        }).setOrigin(0.5);

        const playText = this.add.text(640, 320, 'Play', {
            fontSize: '32px',
            color: '#ffe28a',
            backgroundColor: '#222'
        }).setOrigin(0.5).setPadding(10, 6, 10, 6).setInteractive({ useHandCursor: true });

        this.add.text(640, 390, 'Move: WASD / Arrows  |  Jump: W / UP  |  Throw hammer: SPACE / J', {
            fontSize: '18px',
            color: '#dddddd'
        }).setOrigin(0.5);

        this.add.text(640, 430, 'Powerups drop from foes & blocks: Triple Shot, Shield, Freeze Zone', {
            fontSize: '17px',
            color: '#aee6ff'
        }).setOrigin(0.5);

        this.add.text(640, 470, 'Descend to the bottom exit to clear each cavern. Hammer everything!', {
            fontSize: '16px',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        playText.on('pointerdown', () => this.scene.start('Level1'));
        this.input.keyboard.once('keydown-SPACE', () => this.scene.start('Level1'));
    }
}
