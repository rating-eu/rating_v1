import { BaseEntity } from './../../shared';

export const enum ContainerType {
    'HUMAN',
    'IT',
    'PHYSICAL',
    'INTANGIBLE'
}

export class ContainerMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public containerType?: ContainerType,
        public created?: any,
        public companies?: BaseEntity[],
        public assets?: BaseEntity[],
    ) {
    }
}
