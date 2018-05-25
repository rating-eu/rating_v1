import { BaseEntity } from './../../shared';

export class LevelMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
    ) {
    }
}
