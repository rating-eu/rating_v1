import { BaseEntity } from './../../shared';

export const enum Level {
    'HUMAN',
    'IT',
    'PHYSICAL'
}

export class LevelWrapperMgm implements BaseEntity {
    constructor(
        public id?: number,
        public level?: Level,
        public attackStrategy?: BaseEntity,
    ) {
    }
}
