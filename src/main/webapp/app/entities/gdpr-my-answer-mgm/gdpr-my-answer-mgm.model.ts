import { BaseEntity } from './../../shared';

export class GDPRMyAnswerMgm implements BaseEntity {
    constructor(
        public id?: number,
        public questionnaireStatus?: BaseEntity,
        public question?: BaseEntity,
        public answer?: BaseEntity,
    ) {
    }
}
