import { BaseEntity } from './../../shared';

export class AssetMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public created?: any,
        public modified?: any,
        public containers?: BaseEntity[],
        public domainsOfInfluences?: BaseEntity[],
        public assetcategory?: BaseEntity,
    ) {
    }
}
