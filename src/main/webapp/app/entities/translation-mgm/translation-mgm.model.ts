import { BaseEntity } from './../../shared';

export const enum Language {
    'IT',
    'EN',
    'DE',
    'ES',
    'FR',
    'PT_PT'
}

export class TranslationMgm implements BaseEntity {
    constructor(
        public id?: number,
        public text?: string,
        public language?: Language,
        public dataImpactDescription?: BaseEntity,
        public gDPRQuestion?: BaseEntity,
        public gDPRAnswer?: BaseEntity,
    ) {
    }
}
