import { BaseEntity } from './../../shared';

export const enum AnswerType {
    'YESNO',
    'RANGE5',
    'PERC5',
    'CUSTOM',
    'RANGE3',
    'PERC3'
}

export class QuestionMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public created?: any,
        public modified?: any,
        public type?: AnswerType,
        public answers?: BaseEntity[],
        public myanswer?: BaseEntity,
        public questionnaire?: BaseEntity,
    ) {
    }
}
