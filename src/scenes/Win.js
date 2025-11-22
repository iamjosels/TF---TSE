export class Win extends Phaser.Scene {
    constructor() {
        super({ key: 'Win' });
    }

    create() {
        this.cameras.main.setBackgroundColor('#0a0a1a');

        const score = this.registry.get('score') || 0;
        const lives = this.registry.get('lives') || 0;

        this.add.text(640, 220, 'You cleared the caverns!', {
            fontSize: '48px',
            color: '#ffe28a'
        }).setOrigin(0.5);

        this.add.text(640, 300, `Final Score: ${score}`, {
            fontSize: '28px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(640, 340, `Lives remaining: ${lives}`, {
            fontSize: '24px',
            color: '#bbbbff'
        }).setOrigin(0.5);

        const back = this.add.text(640, 420, 'Return to Menu', {
            fontSize: '24px',
            color: '#ffe28a',
            backgroundColor: '#222'
        }).setOrigin(0.5).setPadding(10, 6, 10, 6).setInteractive({ useHandCursor: true });

        back.on('pointerdown', () => this.scene.start('MainMenu'));
        this.input.keyboard.once('keydown-SPACE', () => this.scene.start('MainMenu'));

        this.time.delayedCall(4000, () => {
            if (this.scene.isActive()) this.scene.start('MainMenu');
        });
    }
}
