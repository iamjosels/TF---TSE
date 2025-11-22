export class Start extends Phaser.Scene {
    constructor() {
        super({ key: 'Start' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#040218');

        this.add.text(640, 200, 'Cavernas Prototype', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(640, 320, 'Press SPACE or CLICK to begin', {
            fontSize: '24px',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        this.add.text(640, 380, 'Move: WASD / Arrows | Jump: W or UP', {
            fontSize: '18px',
            color: '#8888ff'
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('Level1');
        });

        this.input.once('pointerdown', () => {
            this.scene.start('Level1');
        });
    }
}
