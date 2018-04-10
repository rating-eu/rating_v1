import { BaseEntity } from './../../shared';

export class MotivationMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public created?: any,
        public modified?: any,
        public tagents?: BaseEntity[],
    ) {
    }
}
