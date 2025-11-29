import { POWERUP_TYPES } from '../../config/powerupsConfig.js';
import { PowerupPickup } from './PowerupPickup.js';

export class FreezeZonePowerup extends PowerupPickup {
    constructor(scene, x, y) {
        super(scene, x, y, POWERUP_TYPES.FREEZE_ZONE);
    }
}
