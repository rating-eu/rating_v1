import { BaseEntity } from './../../shared';
import {AssetMgm} from '../asset-mgm';
import {SelfAssessmentMgm} from '../self-assessment-mgm';
import {QuestionnaireMgm} from '../questionnaire-mgm';

export class MyAssetMgm implements BaseEntity {
    constructor(
        public id?: number,
        public magnitude?: string,
        public ranking?: number,
        public estimated?: boolean,
        public asset?: AssetMgm,
        public selfAssessment?: SelfAssessmentMgm,
        public questionnaire?: QuestionnaireMgm,
        public economicValue?: number,
        public impact?: number,
    ) {
    }
}
