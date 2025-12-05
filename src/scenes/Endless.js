import { CavernBase } from './CavernBase.js';
import { loseLife } from '../config/gameState.js';

const MAP_TEMPLATES = [
    {
        playerSpawn: { x: 200, y: 140 },
        platforms: [
            { x: 160, y: 680, scaleX: 2.1 },
            { x: 400, y: 680, scaleX: 2.1 },
            { x: 640, y: 680, scaleX: 2.1 },
            { x: 880, y: 680, scaleX: 2.1 },
            { x: 1120, y: 680, scaleX: 2.1 },
            { x: 220, y: 560, scaleX: 1.9 },
            { x: 1060, y: 560, scaleX: 1.9 },
            { x: 640, y: 520, scaleX: 2.4 },
            { x: 360, y: 430, scaleX: 1.8 },
            { x: 920, y: 430, scaleX: 1.8 },
            { x: 640, y: 340, scaleX: 2.0 },
            { x: 320, y: 250, scaleX: 1.6 },
            { x: 960, y: 250, scaleX: 1.6 }
        ],
        breakables: [
            { x: 520, y: 640 },
            { x: 760, y: 640 },
            { x: 640, y: 590 },
            { x: 360, y: 410 },
            { x: 920, y: 410 },
            { x: 640, y: 320 },
            { x: 320, y: 240 },
            { x: 960, y: 240 }
        ]
    },
    {
        playerSpawn: { x: 220, y: 150 },
        platforms: [
            { x: 160, y: 680, scaleX: 2.3 },
            { x: 400, y: 680, scaleX: 2.3 },
            { x: 640, y: 680, scaleX: 2.3 },
            { x: 880, y: 680, scaleX: 2.3 },
            { x: 1120, y: 680, scaleX: 2.3 },
            { x: 200, y: 620, scaleX: 2.0 },
            { x: 1080, y: 620, scaleX: 2.0 },
            { x: 640, y: 580, scaleX: 3.2 },
            { x: 340, y: 500, scaleX: 2.3 },
            { x: 940, y: 500, scaleX: 2.3 },
            { x: 640, y: 420, scaleX: 3.0 },
            { x: 260, y: 340, scaleX: 2.0 },
            { x: 1020, y: 340, scaleX: 2.0 },
            { x: 640, y: 260, scaleX: 2.2 },
            { x: 360, y: 200, scaleX: 1.6 },
            { x: 920, y: 200, scaleX: 1.6 },
            { x: 640, y: 140, scaleX: 1.4 }
        ],
        breakables: [
            { x: 640, y: 640 },
            { x: 520, y: 640 },
            { x: 760, y: 640 },
            { x: 420, y: 580 },
            { x: 860, y: 580 },
            { x: 260, y: 600 },
            { x: 1020, y: 600 },
            { x: 340, y: 480 },
            { x: 940, y: 480 },
            { x: 640, y: 460 },
            { x: 260, y: 320 },
            { x: 1020, y: 320 },
            { x: 540, y: 400 },
            { x: 740, y: 400 }
        ]
    },
    {
        playerSpawn: { x: 240, y: 180 },
        platforms: [
            { x: 140, y: 680, scaleX: 2.2 },
            { x: 380, y: 680, scaleX: 2.2 },
            { x: 620, y: 680, scaleX: 2.2 },
            { x: 860, y: 680, scaleX: 2.2 },
            { x: 1100, y: 680, scaleX: 2.2 },
            { x: 260, y: 600, scaleX: 1.9 },
            { x: 1020, y: 600, scaleX: 1.9 },
            { x: 640, y: 560, scaleX: 2.8 },
            { x: 320, y: 500, scaleX: 1.8 },
            { x: 960, y: 500, scaleX: 1.8 },
            { x: 640, y: 450, scaleX: 2.1 },
            { x: 460, y: 400, scaleX: 1.5 },
            { x: 820, y: 400, scaleX: 1.5 },
            { x: 300, y: 320, scaleX: 1.4 },
            { x: 980, y: 320, scaleX: 1.4 },
            { x: 640, y: 280, scaleX: 1.8 },
            { x: 480, y: 220, scaleX: 1.2 },
            { x: 800, y: 220, scaleX: 1.2 }
        ],
        breakables: [
            { x: 260, y: 580 },
            { x: 1020, y: 580 },
            { x: 640, y: 540 },
            { x: 320, y: 480 },
            { x: 960, y: 480 },
            { x: 640, y: 430 },
            { x: 460, y: 380 },
            { x: 820, y: 380 },
            { x: 300, y: 300 },
            { x: 980, y: 300 },
            { x: 640, y: 260 },
            { x: 480, y: 200 },
            { x: 800, y: 200 }
        ]
    }
];

export class Endless extends CavernBase {
    constructor() {
        super('Endless', {
            title: 'Modo Infinito',
            nextScene: 'Endless',
            enemyScore: 80,
            playerSpawn: { x: 220, y: 140 },
            exitY: 700,
            hazardY: 760,
            exitLabel: 'Ronda >',
            platforms: [],
            breakables: [],
            enemies: []
        });
    }

    create() {
        const round = this.registry.get('endlessRound') || 1;
        this.registry.set('endlessRound', round);
        const settings = this.buildRound(round);
        this.levelSettings = settings;
        super.create();
        this.currentRound = round;
        this.exitUnlocked = false;
        this.hud.setTitle(`Ronda ${round} - Record ${this.registry.get('endlessRecord') || 0}`);
        this.roundPaused = false;
        if (round > 1 && round % 3 === 1) {
            this.pauseForMessage(`Dificultad aumentada (Ronda ${round})`);
        }
    }

    buildRound(round) {
        const template = Phaser.Utils.Array.GetRandom(MAP_TEMPLATES);
        // Enemigos base mantienen su cantidad fija para que la progresión dependa de jefes.
        const enemyCount = 6;
        const enemies = [];
        for (let i = 0; i < enemyCount; i++) {
            enemies.push({
                x: Phaser.Math.Between(140, 1120),
                y: Phaser.Math.Between(180, 560),
                patrol: { left: 80, right: 1200 },
                speed: 120 + Math.floor(round * 5)
            });
        }
        const tier = Math.max(0, Math.floor((round - 1) / 3));
        const reaperCount = Math.min(1 + Math.floor(round / 3), 4);
        // BossTurret: 0 en ronda 1-2, 1 en 3-5, 2 en 6-8, 3 en 9-11, 4 en 12+ (tope 4)
        const turretCount = Math.min(Math.max(Math.floor(round / 3), 0), 4);
        const bosses = [];
        for (let i = 0; i < reaperCount; i++) {
            bosses.push({
                kind: 'reaper',
                x: Phaser.Math.Between(200, 1080),
                y: Phaser.Math.Between(200, 520),
                health: 16 + round * 2,
                moveSpeed: 200 + round * 6,
                dashSpeed: 380 + round * 5
            });
        }
        for (let i = 0; i < turretCount; i++) {
            const statsBoost = 1 + tier * 0.15;
            bosses.push({
                kind: 'turret',
                x: Phaser.Math.Between(220, 1060),
                y: Phaser.Math.Between(220, 420),
                health: Math.round(18 * statsBoost + round * 1.5),
                fireInterval: Math.max(620, 1000 - round * 25 - tier * 35),
                projectileSpeed: 430 + tier * 25,
                moveSpeed: 140 + tier * 14
            });
        }
        // Ghost boss buffed after round 3
        bosses.push({
            kind: 'ghost',
            x: Phaser.Math.Between(600, 1000),
            y: Phaser.Math.Between(240, 480),
            health: 20 + round * 2,
            fireInterval: Math.max(600, 900 - round * 20)
        });

        return {
            title: `Ronda ${round}`,
            nextScene: 'Endless',
            enemyScore: 80 + round * 2,
            playerSpawn: template.playerSpawn,
            exitY: 700,
            hazardY: 760,
            exitLabel: `Ronda ${round} >`,
            platforms: template.platforms,
            breakables: template.breakables,
            enemies,
            boss: bosses,
            aidDropInterval: Math.max(6000, 10000 - round * 150)
        };
    }

    breakFloorAndAdvance() {
        this.levelFinished = true;
        const nextRound = (this.registry.get('endlessRound') || this.currentRound || 1) + 1;
        this.registry.set('endlessRound', nextRound);
        this.time.delayedCall(600, () => this.scene.start('Endless'));
    }

    advanceRound() {
        this.levelFinished = true;
        const nextRound = (this.registry.get('endlessRound') || this.currentRound || 1) + 1;
        this.registry.set('endlessRound', nextRound);
        this.time.delayedCall(400, () => this.scene.start('Endless'));
    }

    update(time) {
        super.update(time);
        if (this.levelFinished || this.roundPaused) return;
        const hazardY = this.levelSettings.hazardY || 760;

        // Limpia enemigos que cayeron fuera del mapa para no bloquear el avance de ronda.
        this.enemies.children.iterate((enemy) => {
            if (enemy && enemy.active && enemy.y > hazardY + 40) {
                enemy.disableBody(true, true);
            }
        });

        const remaining = this.enemies.countActive(true);
        if (remaining === 0 && !this.levelFinished && !this.exitUnlocked) {
            this.exitUnlocked = true;
            this.hud.showPopup('Dirígete a la salida para la próxima ronda', this.player.x, this.player.y - 60, '#ffe28a');
        }
    }

    skipLevelCheat() {
        // En modo infinito, el cheat debe limpiar todo y avanzar de inmediato.
        this.enemies.children.iterate((enemy) => {
            if (enemy?.disableBody) {
                enemy.disableBody(true, true);
            }
        });
        this.levelFinished = true;
        this.advanceRound();
    }

    handlePlayerDeath() {
        const currentRound = this.registry.get('endlessRound') || 1;
        if (this.respawning || this.levelFinished) return;
        this.respawning = true;
        this.lives = loseLife(this);
        this.hud.setLives(this.lives);
        this.player.disableBody(true, true);

        if (this.lives <= 0) {
            const record = this.registry.get('endlessRecord') || 0;
            if (currentRound > record) {
                this.registry.set('endlessRecord', currentRound);
            }
            this.hud.showPopup(`Ronda ${currentRound} - Fin`, this.player.x, this.player.y - 40, '#ff7777');
            this.time.delayedCall(1200, () => {
                this.registry.set('endlessRound', 1);
                this.sound.stopByKey('music-game');
                this.scene.start('MainMenu');
            });
            return;
        }

        this.hud.showPopup('Respawning...', this.player.x, this.player.y - 40, '#ffe28a');
        this.time.delayedCall(900, () => {
            this.player.reset(this.levelSettings.playerSpawn.x, this.levelSettings.playerSpawn.y);
            this.respawning = false;
        });
    }

    pauseForMessage(text) {
        this.roundPaused = true;
        this.physics.world.pause();
        if (this.player?.body) this.player.setVelocity(0, 0);
        const msg = this.add.text(this.scale.width / 2, this.scale.height / 2, text, {
            fontSize: '28px',
            color: '#ffe28a',
            backgroundColor: 'rgba(0,0,0,0.55)',
            padding: { x: 18, y: 14 }
        }).setOrigin(0.5).setDepth(30);
        const hint = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Pulsa Enter para continuar', {
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: 'rgba(0,0,0,0.45)',
            padding: { x: 14, y: 10 }
        }).setOrigin(0.5).setDepth(30);

        this.time.delayedCall(400, () => {
            const resume = () => {
                this.roundPaused = false;
                this.physics.world.resume();
                msg.destroy();
                hint.destroy();
                this.input.keyboard.off('keydown-ENTER', resume);
            };
            this.input.keyboard.once('keydown-ENTER', resume);
        });
    }
}
