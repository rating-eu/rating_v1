import { BaseEntity } from './../../shared';

export const enum AnswerType {
    'YESNO',
    'RANGE5',
    'PERC5',
    'CUSTOM'
}

export class AnswerMgm implements BaseEntity {
    constructor(
        public id?: number,
        public type?: AnswerType,
        public name?: string,
        public created?: any,
        public modified?: any,
        public threatAgents?: BaseEntity[],
        public attacks?: BaseEntity[],
        public question?: BaseEntity,
    ) {
    }
}
