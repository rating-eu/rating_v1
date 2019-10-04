import { BaseEntity } from './../../shared';

export class GDPRMyAnswerMgm implements BaseEntity {
    constructor(
        public id?: number,
        public gDPRQuestionnaireStatus?: BaseEntity,
        public question?: BaseEntity,
        public answer?: BaseEntity,
    ) {
    }
}
