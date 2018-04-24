import { BaseEntity } from './../../shared';

export const enum Q_Scope {
    'ID_THREAT_AGENT',
    'SELFASSESSMENT'
}

export class QuestionnaireMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public purpose?: Q_Scope,
        public created?: any,
        public modified?: any,
        public questions?: BaseEntity[],
        public myanswer?: BaseEntity,
        public selfassessments?: BaseEntity[],
    ) {
    }
}
