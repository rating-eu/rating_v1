import { BaseEntity, User } from './../../shared';

export class ExternalAuditMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public user?: User,
    ) {
    }
}
