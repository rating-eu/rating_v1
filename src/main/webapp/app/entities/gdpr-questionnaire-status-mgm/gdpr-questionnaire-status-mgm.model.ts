import { BaseEntity, User } from './../../shared';

export const enum Status {
    'EMPTY',
    'PENDING',
    'FULL'
}

export class GDPRQuestionnaireStatusMgm implements BaseEntity {
    constructor(
        public id?: number,
        public status?: Status,
        public answers?: BaseEntity[],
        public operation?: BaseEntity,
        public questionnaire?: BaseEntity,
        public user?: User,
    ) {
    }
}
