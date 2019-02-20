import { MyAssetMgm } from './../../entities/my-asset-mgm/my-asset-mgm.model';
import { MitigationMgm } from './../../entities/mitigation-mgm/mitigation-mgm.model';

export class MyAssetRisk extends MyAssetMgm {
    critical: number;
    risk: number;
    mitigations: MitigationMgm[];
}
