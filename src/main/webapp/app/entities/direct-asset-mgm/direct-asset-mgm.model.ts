import { BaseEntity } from './../../shared';

export class DirectAssetMgm implements BaseEntity {
    constructor(
        public id?: number,
        public myAsset?: BaseEntity,
        public costs?: BaseEntity[],
        public effects?: BaseEntity[],
    ) {
    }
}
