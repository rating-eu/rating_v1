import {BaseEntity} from './../../shared';
import {Language} from '../enumerations/gdpr/Language.enum';
import {SecurityPillar} from '../enumerations/gdpr/SecurityPillar.enum';
import {ThreatArea} from '../enumerations/gdpr/ThreatArea.enum';
import {DataOperationField} from '../enumerations/gdpr/DataOperationField.enum';
import {GDPRAnswerType} from '../enumerations/gdpr/GDPRAnswerType.enum';
import {TranslationMgm} from '../translation-mgm';
import {GDPRQuestionnaireMgm} from '../gdpr-questionnaire-mgm';
import {GDPRAnswerMgm} from '../gdpr-answer-mgm';


export class GDPRQuestionMgm implements BaseEntity {
    constructor(
        public id?: number,
        public text?: string,
        public description?: string,
        public language?: Language,
        public answerType?: GDPRAnswerType,
        public order?: number,
        public dataOperationField?: DataOperationField,
        public securityPillar?: SecurityPillar,
        public threatArea?: ThreatArea,
        public translations?: TranslationMgm[],
        public questionnaire?: GDPRQuestionnaireMgm,
        public answers?: GDPRAnswerMgm[],
    ) {
    }
}
