import { resetGameState } from '../config/gameState.js';
import { ASSETS_CONFIG } from '../config/assetsConfig.js';

export class Instructions extends Phaser.Scene {
    constructor() {
        super({ key: 'Instructions' });
    }

    create() {
        // Keep state intact; do not reset score/lives here.
        const bg = this.add.image(0, 0, 'instructions-bg').setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);

        const backArea = this.add.rectangle(this.scale.width - 675, 620, 200, 70, 0xffffff, 0.01)
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setDepth(10)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.goBack());
        this.add.text(this.scale.width - 823, 590, 'VOLVER', {
            fontSize: '22px',
            color: '#ffe28a',
            padding: { x: 90, y: 20 }
        }).setOrigin(0.5).setDepth(11).setAlpha(0.01).disableInteractive();

        this.input.keyboard.once('keydown-ESC', () => this.goBack());
    }

    goBack() {
        this.scene.start('MainMenu');
    }
}
