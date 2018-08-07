import { BaseEntity } from './../../shared';
import {QuestionMgm} from '../question-mgm';
import {QuestionnairePurpose} from '../enumerations/QuestionnairePurpose.enum';

export class QuestionnaireMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public purpose?: QuestionnairePurpose,
        public created?: any,
        public modified?: any,
        public questions?: QuestionMgm[],
    ) {
    }
}
