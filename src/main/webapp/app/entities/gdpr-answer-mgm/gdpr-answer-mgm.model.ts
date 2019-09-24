import { BaseEntity } from './../../shared';

export const enum AnswerValue {
    'YES',
    'NO'
}

export class GDPRAnswerMgm implements BaseEntity {
    constructor(
        public id?: number,
        public text?: string,
        public answerValue?: AnswerValue,
        public order?: number,
        public questions?: BaseEntity[],
    ) {
    }
}
