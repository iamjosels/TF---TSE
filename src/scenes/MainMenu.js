import { resetGameState } from '../config/gameState.js';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        // Reset shared game state whenever we land on the menu.
        resetGameState(this);

        const bg = this.add.image(0, 0, 'menu-bg').setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);

        this.playMenuMusic();

        // Áreas clickeables invisibles (mantienen padding y posición)
        const playArea = this.add.rectangle(610, 300, 340, 80, 0xffffff, 0.001)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        this.add.text(610, 300, 'JUGAR', {
            fontSize: '36px',
            color: '#ffffff',
            padding: { x: 170, y: 20 }
        }).setOrigin(0.5).setAlpha(0);

        const instrArea = this.add.rectangle(610, 415, 260, 80, 0xffffff, 0.001)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        this.add.text(610, 415, 'INSTRUCCIONES', {
            fontSize: '28px',
            color: '#ffffff',
            padding: { x: 115, y: 24 }
        }).setOrigin(0.5).setAlpha(0);

        playArea.on('pointerdown', () => this.startGame());
        instrArea.on('pointerdown', () => this.scene.start('Instructions'));
        this.input.keyboard.once('keydown-SPACE', () => this.startGame());
    }

    playMenuMusic() {
        const existing = this.sound.get('music-menu');
        if (existing) {
            if (!existing.isPlaying) existing.play({ loop: true, volume: 0.5 });
            return;
        }
        const music = this.sound.add('music-menu', { loop: true, volume: 0.5 });
        music.play();
    }

    startGame() {
        this.sound.stopByKey('music-menu');
        const gameMusic = this.sound.get('music-game') || this.sound.add('music-game', { loop: true, volume: 0.6 });
        if (!gameMusic.isPlaying) gameMusic.play();
        this.scene.start('Level1');
    }
}
