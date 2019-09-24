import { BaseEntity } from './../../shared';

export class DataOperationMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public processedData?: string,
        public processingPurpose?: string,
        public dataSubject?: string,
        public processingMeans?: string,
        public dataProcessor?: string,
        public recipients?: BaseEntity[],
        public impacts?: BaseEntity[],
        public threats?: BaseEntity[],
        public companyProfile?: BaseEntity,
    ) {
    }
}
