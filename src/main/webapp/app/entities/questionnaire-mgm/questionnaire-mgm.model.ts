import {BaseEntity} from './../../shared';
import {QuestionnairePurpose} from '../enumerations/QuestionnairePurpose.enum';

export class QuestionnaireMgm implements BaseEntity {
    constructor(public id?: number,
                public name?: string,
                public purpose?: QuestionnairePurpose,
                public created?: any,
                public modified?: any,
                public questions?: BaseEntity[],
                public myanswer?: BaseEntity,
                public selfassessments?: BaseEntity[]) {
    }
}
