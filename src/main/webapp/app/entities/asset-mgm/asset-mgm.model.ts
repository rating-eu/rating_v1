import { BaseEntity } from './../../shared';
import {ContainerMgm} from '../container-mgm';
import {DomainOfInfluenceMgm} from '../domain-of-influence-mgm';
import {AssetCategoryMgm} from '../asset-category-mgm';

export class AssetMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public created?: any,
        public modified?: any,
        public containers?: ContainerMgm[],
        public domainsOfInfluences?: DomainOfInfluenceMgm[],
        public assetcategory?: AssetCategoryMgm,
    ) {
    }
}
