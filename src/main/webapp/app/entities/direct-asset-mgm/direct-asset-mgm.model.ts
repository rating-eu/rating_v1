import { BaseEntity } from './../../shared';
import {MyAssetMgm} from '../my-asset-mgm';
import {AttackCostMgm} from '../attack-cost-mgm';
import {IndirectAssetMgm} from '../indirect-asset-mgm';

export class DirectAssetMgm implements BaseEntity {
    constructor(
        public id?: number,
        public myAsset?: MyAssetMgm,
        public costs?: AttackCostMgm[],
        public effects?: IndirectAssetMgm[],
    ) {
    }
}
