import {IndirectAssetMgm} from "../../entities/indirect-asset-mgm";
import {AttackCostMgm} from "../../entities/attack-cost-mgm";

export class MyAssetDto {
    constructor(
        public myAssetID: number,
        public myAssetName: String,
        public indirectAssets: IndirectAssetMgm[],
        public attackCosts: AttackCostMgm[],
        public likelihood: number,
        public vulnerability: number,
        public criticality: number,
        public priority: number
    ) {
    }
}
