import { BaseEntity } from './../../shared';

export const enum QuestionnairePurpose {
    'ID_THREAT_AGENT',
    'SELFASSESSMENT',
    'ID_ASSETS'
}

export class QuestionnaireMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public purpose?: QuestionnairePurpose,
        public created?: any,
        public modified?: any,
        public questions?: BaseEntity[],
    ) {
    }
}
