import {BaseEntity} from './../../shared';
import {MyAssetMgm} from '../my-asset-mgm';
import {DirectAssetMgm} from '../direct-asset-mgm';

export class IndirectAssetMgm implements BaseEntity {
    constructor(
        public id?: number,
        public directAsset?: DirectAssetMgm,
        public myAsset?: MyAssetMgm,
    ) {
    }
}
