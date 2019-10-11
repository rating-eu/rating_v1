import {BaseEntity} from './../../shared';
import {Language} from '../enumerations/gdpr/Language.enum';
import {DataImpactDescriptionMgm} from '../data-impact-description-mgm';
import {GDPRQuestionMgm} from '../gdpr-question-mgm';
import {GDPRAnswerMgm} from '../gdpr-answer-mgm';

export class TranslationMgm implements BaseEntity {
    constructor(
        public id?: number,
        public text?: string,
        public language?: Language,
        public dataImpactDescription?: DataImpactDescriptionMgm,
        public gDPRQuestion?: GDPRQuestionMgm,
        public gDPRAnswer?: GDPRAnswerMgm,
    ) {
    }
}
