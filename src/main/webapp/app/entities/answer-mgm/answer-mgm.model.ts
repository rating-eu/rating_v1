import { BaseEntity } from './../../shared';

export class AnswerMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public created?: any,
        public modified?: any,
        public threatAgents?: BaseEntity[],
        public attacks?: BaseEntity[],
        public myanswer?: BaseEntity,
        public question?: BaseEntity,
    ) {
    }
}
