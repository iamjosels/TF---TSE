import { resetGameState } from '../config/gameState.js';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    create() {
        // Reset shared game state whenever we land on the menu.
        resetGameState(this);

        // Asegura que la m·sica del juego no contin˙e sonando al volver al men˙.
        this.sound.stopByKey('music-game');
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

        const endlessArea = this.add.rectangle(610, 530, 320, 70, 0xffffff, 0.001)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });
        this.add.text(610, 530, 'MODO INFINITO', {
            fontSize: '28px',
            color: '#ffffff',
            padding: { x: 140, y: 20 }
        }).setOrigin(0.5).setAlpha(0);

        playArea.on('pointerdown', () => this.startGame());
        instrArea.on('pointerdown', () => this.scene.start('Instructions'));
        endlessArea.on('pointerdown', () => this.startEndless());
        this.input.keyboard.once('keydown-SPACE', () => this.startGame());

        // Mostrar record infinito
        const record = this.registry.get('endlessRecord') || 0;
        this.add.text(70, 40, `🏆 Record Infinito: Ronda ${record}`, {
            fontSize: '20px',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 3
        }).setDepth(12);
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

    startEndless() {
        this.sound.stopByKey('music-menu');
        this.sound.stopByKey('music-game');
        const gameMusic = this.sound.add('music-game', { loop: true, volume: 0.6 });
        gameMusic.play();
        this.registry.set('endlessRound', 1);
        this.scene.start('Endless');
    }
}
