import { BaseEntity } from './../../shared';

export enum QuestionnairePurpose {
    ID_THREAT_AGENT = <any>'ID_THREAT_AGENT',
    SELFASSESSMENT = <any>'SELFASSESSMENT'
}

export class QuestionnaireMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public purpose?: QuestionnairePurpose,
        public created?: any,
        public modified?: any,
        public questions?: BaseEntity[],
        public myanswer?: BaseEntity,
        public selfassessments?: BaseEntity[],
    ) {
    }
}
