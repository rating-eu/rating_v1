import { BaseEntity } from './../../shared';

export const enum Language {
    'IT',
    'EN',
    'DE',
    'ES',
    'FR',
    'PT_PT'
}

export const enum GDPRAnswerType {
    'OPEN',
    'MULTIPLE_CHOICE',
    'OBJECT'
}

export const enum DataOperationField {
    'NAME',
    'PROCESSED_DATA',
    'PROCESSING_PURPOSE',
    'DATA_SUBJECT',
    'PROCESSING_MEANS',
    'DATA_RECIPIENTS',
    'DATA_PROCESSOR'
}

export const enum SecurityPillar {
    'CONFIDENTIALITY',
    'INTEGRITY',
    'AVAILABILITY'
}

export const enum ThreatArea {
    'NETWORK_AND_TECHNICAL_RESOURCES',
    'PROCEDURES_RELATED_TO_THE_PROCESSING_OF_PERSONAL_DATA',
    'PEOPLE_INVOLVED_IN_THE_PROCESSING_OF_PERSONAL_DATA',
    'BUSINESS_SECTOR_AND_SCALE_OF_PROCESSING'
}

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
