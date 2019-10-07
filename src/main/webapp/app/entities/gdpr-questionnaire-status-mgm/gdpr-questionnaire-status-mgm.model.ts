import {BaseEntity, User} from './../../shared';
import {Status} from '../enumerations/Status.enum';
import {Role} from '../enumerations/Role.enum';
import {GDPRMyAnswerMgm} from '../gdpr-my-answer-mgm';
import {DataOperationMgm} from '../data-operation-mgm';
import {GDPRQuestionnaireMgm} from '../gdpr-questionnaire-mgm';

export class GDPRQuestionnaireStatusMgm implements BaseEntity {
    constructor(
        public id?: number,
        public status?: Status,
        public role?: Role,
        public answers?: GDPRMyAnswerMgm[],
        public operation?: DataOperationMgm,
        public questionnaire?: GDPRQuestionnaireMgm,
        public user?: User,
    ) {
    }
}
