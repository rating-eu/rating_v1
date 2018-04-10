import { BaseEntity } from './../../shared';

export class QuestionMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public created?: any,
        public modified?: any,
        public answers?: BaseEntity[],
        public questionnaire?: BaseEntity,
    ) {
    }
}
