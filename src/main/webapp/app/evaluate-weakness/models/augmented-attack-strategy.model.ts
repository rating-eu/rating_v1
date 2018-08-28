import {AttackStrategyMgm} from '../../entities/attack-strategy-mgm';

export class AugmentedAttackStrategy extends AttackStrategyMgm {
    public enabled: boolean;
    public initialLikelihood: number;
    public contextualVulnerability: number;
    public contextualLikelihood: number;
    public refinedVulnerability: number;
    public refinedLikelihood: number;

    constructor(private attackStrategy: AttackStrategyMgm) {
        super(
            attackStrategy.id,
            attackStrategy.name,
            attackStrategy.description,
            attackStrategy.frequency,
            attackStrategy.skill,
            attackStrategy.resources,
            attackStrategy.likelihood,
            attackStrategy.created,
            attackStrategy.modified,
            attackStrategy.mitigations,
            attackStrategy.levels,
            attackStrategy.phases
        );
    }
}
