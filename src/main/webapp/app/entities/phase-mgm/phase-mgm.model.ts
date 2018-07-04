import { BaseEntity } from './../../shared';

export class PhaseMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public weight?: number,
    ) {
    }
}
