import {BaseEntity} from './../../shared';
import {ConfigKey} from '../enumerations/configurations/ConfigKey.enum';

export class SystemConfigMgm implements BaseEntity {
    constructor(
        public id?: number,
        public key?: ConfigKey,
        public value?: string,
    ) {
    }
}
