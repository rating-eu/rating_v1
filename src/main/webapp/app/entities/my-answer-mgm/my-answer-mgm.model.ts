import { BaseEntity, User } from './../../shared';

export class MyAnswerMgm implements BaseEntity {
    constructor(
        public id?: number,
        public mycheck?: string,
        public answer?: BaseEntity,
        public question?: BaseEntity,
        public questionnaire?: BaseEntity,
        public user?: User,
    ) {
    }
}
