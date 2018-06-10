import {BaseEntity} from './../../shared';
import {Likelihood} from '../enumerations/Likelihood.enum';

export class LikelihoodPositionMgm implements BaseEntity {
    constructor(public id?: number,
                public likelihood?: Likelihood,
                public position?: number) {
    }
}
