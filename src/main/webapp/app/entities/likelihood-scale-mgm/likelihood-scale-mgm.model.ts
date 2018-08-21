import { BaseEntity } from './../../shared';

export class LikelihoodScaleMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public likelihood?: number,
        public frequency?: number,
        public selfAssessment?: BaseEntity,
    ) {
    }
}
