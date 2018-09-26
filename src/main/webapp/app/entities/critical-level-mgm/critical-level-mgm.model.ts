import { BaseEntity } from '../../shared';

export class CriticalLevelMgm implements BaseEntity {
    constructor(
        public id?: number,
        public side?: number,
        public lowLimit?: number,
        public mediumLimit?: number,
        public highLimit?: number,
        public selfAssessment?: BaseEntity,
    ) {
    }
}
