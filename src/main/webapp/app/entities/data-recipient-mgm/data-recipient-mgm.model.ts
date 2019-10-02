import { BaseEntity } from './../../shared';
import {DataOperationMgm} from '../data-operation-mgm';
import {DataRecipientType} from '../enumerations/gdpr/DataRecipientType.enum';

export class DataRecipientMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public type?: DataRecipientType,
        public operation?: DataOperationMgm,
    ) {
    }
}
