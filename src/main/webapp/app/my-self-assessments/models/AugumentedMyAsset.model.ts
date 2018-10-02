import { MyAssetMgm } from '../../entities/my-asset-mgm';
import { AugmentedAttackStrategy } from '../../evaluate-weakness/models/augmented-attack-strategy.model';
import { ThreatAgentMgm } from '../../entities/threat-agent-mgm/threat-agent-mgm.model';

export class AugumentedMyAsset extends MyAssetMgm {
    augmentedAttackStrategy: AugmentedAttackStrategy;
    threatAgent: ThreatAgentMgm;
}
