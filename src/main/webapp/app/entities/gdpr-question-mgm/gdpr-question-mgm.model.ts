import {BaseEntity} from './../../shared';
import {Language} from '../enumerations/gdpr/Language.enum';
import {SecurityPillar} from '../enumerations/gdpr/SecurityPillar.enum';
import {ThreatArea} from '../enumerations/gdpr/ThreatArea.enum';
import {DataOperationField} from '../enumerations/gdpr/DataOperationField';
import {GDPRAnswerType} from '../enumerations/gdpr/GDPRAnswerType.enum';


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
        public translations?: BaseEntity[],
        public questionnaire?: BaseEntity,
        public answers?: BaseEntity[],
    ) {
    }
}
