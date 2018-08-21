import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { AttackStrategyMgm } from '../../entities/attack-strategy-mgm';

export class MyAssetAttackChance {
    myAsset: MyAssetMgm;
    attackStrategy: AttackStrategyMgm;
    likelihood: number;
    vulnerability: number;
    critical: number;
    impact: number;
}
