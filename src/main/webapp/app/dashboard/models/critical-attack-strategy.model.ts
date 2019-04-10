import {AttackStrategyMgm} from "../../entities/attack-strategy-mgm";

export class CriticalAttackStrategy {
    public attackStrategy: AttackStrategyMgm;
    public targetAssets: number;
    public likelihood: number;
    public vulnerability: number;
    public criticality: number;
    public awarenessCriticality: number;
    public socCriticality: number;
}
