import { BaseEntity } from './../../shared';

export class MyAssetMgm implements BaseEntity {
    constructor(
        public id?: number,
        public magnitude?: string,
        public ranking?: number,
        public estimated?: boolean,
        public economicValue?: number,
        public asset?: BaseEntity,
        public selfAssessment?: BaseEntity,
        public questionnaire?: BaseEntity,
    ) {
        this.estimated = false;
    }
}
