import {AttackStrategyMgm} from "../../entities/attack-strategy-mgm";

export class CriticalAttackStrategy {
    /**
     * The AttackStrategy.
     */
    public attackStrategy: AttackStrategyMgm;
    /**
     * The number of assets that could be compromised.
     */
    public targetAssets: number;
    /**
     * The exact likelihood value from 1 to 5
     */
    public likelihood: number;
    /**
     * The exact vulnerability value from 1 to 5
     */
    public vulnerability: number;
    /**
     * The exact criticality value from 1 to 25
     */
    public criticality: number;
    /**
     * The criticality value expressed as a percentage.
     */
    public criticalityPercentage: number;

    /**
     * The awareness criticality value expressed as a percentage.
     */
    public awarenessCriticalityPercentage: number;

    /**
     * The SOC criticality value expressed as a percentage.
     */
    public socCriticalityPercentage: number;

    /**
     * The alert percentage, representing a weighted average of the criticalities.
     */
    public alertPercentage: number;
}
