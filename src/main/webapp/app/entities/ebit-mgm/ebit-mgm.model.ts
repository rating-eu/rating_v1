import { BaseEntity } from './../../shared';

export class EBITMgm implements BaseEntity {
    constructor(
        public id?: number,
        public year?: number,
        public value?: number,
        public created?: any,
        public selfAssessment?: BaseEntity,
    ) {
    }
}
