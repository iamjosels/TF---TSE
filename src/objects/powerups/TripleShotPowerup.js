import { POWERUP_TYPES } from '../../config/powerupsConfig.js';
import { PowerupPickup } from './PowerupPickup.js';

export class TripleShotPowerup extends PowerupPickup {
    constructor(scene, x, y) {
        super(scene, x, y, POWERUP_TYPES.TRIPLE_SHOT);
    }
}
