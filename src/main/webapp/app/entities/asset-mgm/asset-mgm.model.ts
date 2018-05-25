import { BaseEntity } from './../../shared';
import {AssetCategoryMgm} from '../asset-category-mgm';
import {DomainOfInfluenceMgm} from '../domain-of-influence-mgm';
import {ContainerMgm} from '../container-mgm';
import {SelfAssessmentMgm} from '../self-assessment-mgm';

export class AssetMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public created?: any,
        public modified?: any,
        public containers?: ContainerMgm[],
        public domains?: DomainOfInfluenceMgm[],
        public assetcategory?: AssetCategoryMgm,
        public selfassessments?: SelfAssessmentMgm[],
    ) {
    }
}
