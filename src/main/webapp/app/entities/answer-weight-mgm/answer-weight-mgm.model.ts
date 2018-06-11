import {BaseEntity} from './../../shared';
import {QuestionType} from '../enumerations/QuestionType.enum';
import {AnswerLikelihood} from '../enumerations/AnswerLikelihood.enum';

export class AnswerWeightMgm implements BaseEntity {
    constructor(public id?: number,
                public likelihood?: AnswerLikelihood,
                public questionType?: QuestionType,
                public weight?: number) {
    }
}
