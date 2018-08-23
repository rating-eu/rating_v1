import { BaseEntity, User } from './../../shared';

export const enum Status {
    'EMPTY',
    'PENDING',
    'FULL'
}

export const enum Role {
    'ROLE_ADMIN',
    'ROLE_USER',
    'ROLE_EXTERNAL_AUDIT',
    'ROLE_CISO'
}

export class QuestionnaireStatusMgm implements BaseEntity {
    constructor(
        public id?: number,
        public status?: Status,
        public created?: any,
        public modified?: any,
        public role?: Role,
        public selfAssessment?: BaseEntity,
        public questionnaire?: BaseEntity,
        public user?: User,
        public answers?: BaseEntity[],
    ) {
    }
}
