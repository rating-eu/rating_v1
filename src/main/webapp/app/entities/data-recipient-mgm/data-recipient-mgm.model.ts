import { BaseEntity } from './../../shared';

export const enum DataRecipientType {
    'INTERNAL',
    'EXTERNAL'
}

export class DataRecipientMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public type?: DataRecipientType,
        public operation?: BaseEntity,
    ) {
    }
}
