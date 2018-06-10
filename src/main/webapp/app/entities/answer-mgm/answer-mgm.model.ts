import {BaseEntity} from './../../shared';
import {Likelihood} from '../enumerations/Likelihood.enum';

export class AnswerMgm implements BaseEntity {
    constructor(public id?: number,
                public name?: string,
                public created?: any,
                public modified?: any,
                public order?: number,
                public likelihood?: Likelihood,
                public questions?: BaseEntity[]) {
    }
}
