import { BaseEntity } from './../../shared';

export class QuestionRelevanceMgm implements BaseEntity {
    constructor(
        public id?: number,
        public relevance?: number,
        public question?: BaseEntity,
        public status?: BaseEntity,
    ) {
    }
}
