import {BaseEntity} from './../../shared';
import {GDPRQuestionnairePurpose} from '../enumerations/GDPRQuestionnairePurpose.enum';

export class GDPRQuestionnaireMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public purpose?: GDPRQuestionnairePurpose,
    ) {
    }
}
