import { BaseEntity, User } from './../../shared';

export const enum Status {
    'EMPTY',
    'PENDING',
    'FULL'
}

export class QuestionnaireStatusMgm implements BaseEntity {
    constructor(
        public id?: number,
        public status?: Status,
        public selfAssessment?: BaseEntity,
        public questionnaire?: BaseEntity,
        public user?: User,
        public answers?: BaseEntity[],
    ) {
    }
}
