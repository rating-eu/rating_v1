import { BaseEntity } from './../../shared';

export const enum Phase {
    'RECONNAISSANCE',
    'WEAPONIZATION',
    'DELIVERY',
    'EXPLOITATION',
    'INSTALLATION',
    'COMMANDCONTROL'
}

export class PhaseWrapperMgm implements BaseEntity {
    constructor(
        public id?: number,
        public phase?: Phase,
        public attackStrategy?: BaseEntity,
    ) {
    }
}
