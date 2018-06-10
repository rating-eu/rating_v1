import {BaseEntity} from './../../shared';
import {QuestionType} from '../enumerations/QuestionType.enum';
import {Likelihood} from '../enumerations/Likelihood.enum';

export class AnswerWeightMgm implements BaseEntity {
    constructor(public id?: number,
                public likelihood?: Likelihood,
                public questionType?: QuestionType,
                public weight?: number) {
    }
}
