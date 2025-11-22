export class Boot extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }

    preload() {
        // Placeholder for future boot assets (logos, bitmap fonts, etc.).
    }

    create() {
        this.scene.start('Preload');
    }
}
