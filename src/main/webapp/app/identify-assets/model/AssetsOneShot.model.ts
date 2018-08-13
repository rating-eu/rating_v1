import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { DirectAssetMgm } from '../../entities/direct-asset-mgm';
import { IndirectAssetMgm } from '../../entities/indirect-asset-mgm';
import { AttackCostMgm } from '../../entities/attack-cost-mgm';

export class AssetsOneShot {
    myAssets: MyAssetMgm[];
    directAssets: DirectAssetMgm[];
    indirectAssets: IndirectAssetMgm[];
    attackCosts: AttackCostMgm[];
}
