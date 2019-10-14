import {BaseEntity} from './../../shared';
import {DataImpact} from '../enumerations/gdpr/DataImpact.enum';
import {Language} from '../enumerations/gdpr/Language.enum';
import {TranslationMgm} from '../translation-mgm';

export class DataImpactDescriptionMgm implements BaseEntity {
    constructor(
        public id?: number,
        public impact?: DataImpact,
        public description?: string,
        public language?: Language,
        public translations?: TranslationMgm[],
    ) {
    }
}
