import { BaseEntity } from './../../shared';

export const enum ConfigKey {
    'SERVICE_EMAIL'
}

export class SystemConfigMgm implements BaseEntity {
    constructor(
        public id?: number,
        public key?: ConfigKey,
        public value?: string,
    ) {
    }
}
