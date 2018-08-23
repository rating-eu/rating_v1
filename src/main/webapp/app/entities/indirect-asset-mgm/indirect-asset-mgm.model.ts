import { BaseEntity } from './../../shared';

export class IndirectAssetMgm implements BaseEntity {
    constructor(
        public id?: number,
        public directAsset?: BaseEntity,
        public myAsset?: BaseEntity,
        public costs?: BaseEntity[],
    ) {
    }
}
