import { BaseEntity } from './../../shared';

export const enum AssetType {
    'TANGIBLE',
    'INTANGIBLE'
}

export class AssetCategoryMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public type?: AssetType,
        public assets?: BaseEntity[],
    ) {
    }
}
