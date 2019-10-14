import {BaseEntity} from './../../shared';
import {DataImpact} from '../enumerations/gdpr/DataImpact.enum';
import {AnswerValue} from '../enumerations/gdpr/AnswerValue.enum';
import {Language} from '../enumerations/gdpr/Language.enum';
import {TranslationMgm} from '../translation-mgm';
import {GDPRQuestionMgm} from '../gdpr-question-mgm';


export class GDPRAnswerMgm implements BaseEntity {
    constructor(
        public id?: number,
        public text?: string,
        public language?: Language,
        public answerValue?: AnswerValue,
        public dataImpact?: DataImpact,
        public order?: number,
        public translations?: TranslationMgm[],
        public questions?: GDPRQuestionMgm[],
    ) {
    }
}
