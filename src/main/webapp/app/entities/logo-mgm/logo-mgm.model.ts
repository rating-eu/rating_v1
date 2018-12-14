import { BaseEntity } from './../../shared';

export class LogoMgm implements BaseEntity {
    constructor(
        public id?: number,
        public primary?: boolean,
        public imageContentType?: string,
        public image?: any,
    ) {
        this.primary = false;
    }
}
