import { BaseEntity } from './../../shared';

export class DomainOfInfluenceMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public domains?: BaseEntity[],
    ) {
    }
}
