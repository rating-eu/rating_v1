import {BaseEntity} from './../../shared';
import {AnswerLikelihood} from '../enumerations/AnswerLikelihood.enum';
import {AssetMgm} from '../asset-mgm';

export class AnswerMgm implements BaseEntity {
    constructor(public id?: number,
                public name?: string,
                public created?: any,
                public modified?: any,
                public order?: number,
                public likelihood?: AnswerLikelihood,
                public asset?: AssetMgm,
                public questions?: BaseEntity[]) {
    }
}
