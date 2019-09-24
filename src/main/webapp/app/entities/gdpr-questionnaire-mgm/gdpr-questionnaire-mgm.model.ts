import { BaseEntity } from './../../shared';

export const enum GDPRQuestionnairePurpose {
    'OPERATION_CONTEXT',
    'IMPACT_EVALUATION',
    'THREAT_LIKELIHOOD'
}

export class GDPRQuestionnaireMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public purpose?: GDPRQuestionnairePurpose,
    ) {
    }
}
