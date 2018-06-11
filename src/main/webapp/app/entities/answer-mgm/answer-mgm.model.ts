import {BaseEntity} from './../../shared';
import {AnswerLikelihood} from '../enumerations/AnswerLikelihood.enum';

export class AnswerMgm implements BaseEntity {
    constructor(public id?: number,
                public name?: string,
                public created?: any,
                public modified?: any,
                public order?: number,
                public likelihood?: AnswerLikelihood,
                public questions?: BaseEntity[]) {
    }
}
