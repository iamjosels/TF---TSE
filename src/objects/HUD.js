import { ASSETS_CONFIG } from '../config/assetsConfig.js';

const TEXT_STYLE = {
    fontSize: '20px',
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 3
};

export class HUD {
    constructor(scene, title) {
        this.scene = scene;
        this.powerupIcons = new Map();

        this.scoreText = scene.add.text(18, 14, 'Score: 0', TEXT_STYLE).setScrollFactor(0).setDepth(1000);
        this.livesText = scene.add.text(18, 42, 'Lives: 3', TEXT_STYLE).setScrollFactor(0).setDepth(1000);
        this.titleText = scene.add.text(scene.scale.width / 2, 28, title || '', {
            fontSize: '26px',
            color: '#ffe28a',
            stroke: '#000000',
            strokeThickness: 4
        })
            .setOrigin(0.5, 0)
            .setScrollFactor(0)
            .setDepth(1000);

        this.popupLayer = scene.add.container(0, 0).setDepth(1100).setScrollFactor(0);
        this.powerupLayer = scene.add.container(scene.scale.width - 220, 10).setScrollFactor(0).setDepth(1050);
    }

    setScore(score) {
        this.scoreText.setText(`Score: ${score}`);
    }

    setLives(lives) {
        this.livesText.setText(`Lives: ${lives}`);
    }

    setTitle(title) {
        this.titleText.setText(title);
    }

    showPopup(text, x, y, color = '#ffe28a') {
        const popup = this.scene.add.text(x, y, text, {
            fontSize: '22px',
            color,
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.popupLayer.add(popup);
        this.scene.tweens.add({
            targets: popup,
            y: y - 24,
            alpha: 0,
            duration: 900,
            ease: 'Cubic.easeOut',
            onComplete: () => popup.destroy()
        });
    }

    activatePowerup(type, iconKey, durationMs, label) {
        // Reuse existing entry if present.
        if (this.powerupIcons.has(type)) {
            const entry = this.powerupIcons.get(type);
            entry.expiresAt = durationMs > 0 ? this.scene.time.now + durationMs : 0;
            entry.label = label;
            entry.timerText.setText(this._formatLabel(entry.expiresAt, label));
            return;
        }

        const bgKey = ASSETS_CONFIG.hud.smallPanel.key;
        const bg = this.scene.add.image(0, 0, bgKey).setOrigin(0, 0).setScale(0.7);
        const icon = this.scene.add.image(8, 8, iconKey).setOrigin(0, 0).setScale(0.75);
        const timerText = this.scene.add.text(40, 10, this._formatLabel(
            durationMs > 0 ? this.scene.time.now + durationMs : 0,
            label
        ), {
            fontSize: '16px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0, 0);

        const container = this.scene.add.container(0, 0, [bg, icon, timerText]).setScrollFactor(0);
        this.powerupLayer.add(container);

        const entry = {
            type,
            container,
            timerText,
            expiresAt: durationMs > 0 ? this.scene.time.now + durationMs : 0,
            label
        };
        this.powerupIcons.set(type, entry);
        this._layoutPowerups();

        // Keep timer updated.
        entry.timerEvent = this.scene.time.addEvent({
            delay: 200,
            loop: true,
            callback: () => {
                timerText.setText(this._formatLabel(entry.expiresAt, entry.label));
            }
        });
    }

    clearPowerup(type) {
        const entry = this.powerupIcons.get(type);
        if (!entry) return;
        if (entry.timerEvent) {
            entry.timerEvent.remove(false);
        }
        entry.container.destroy();
        this.powerupIcons.delete(type);
        this._layoutPowerups();
    }

    _formatLabel(expiresAt, label) {
        if (!expiresAt) return label || '1-hit';
        const remaining = Math.max(0, expiresAt - this.scene.time.now);
        return `${(remaining / 1000).toFixed(1)}s`;
    }

    _layoutPowerups() {
        let offsetX = 0;
        this.powerupIcons.forEach((entry) => {
            entry.container.x = offsetX;
            entry.container.y = 0;
            offsetX += 70;
        });
    }
}
