import {BaseEntity} from './../../shared';
import {AnswerLikelihood} from '../enumerations/AnswerLikelihood.enum';

export class LikelihoodPositionMgm implements BaseEntity {
    constructor(public id?: number,
                public likelihood?: AnswerLikelihood,
                public position?: number) {
    }
}
