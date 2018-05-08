import { BaseEntity } from './../../shared';

export const enum SkillLevel {
    'HIGH',
    'MEDIUM',
    'LOW'
}

export const enum Intent {
    'HOSTILE',
    'NON_HOSTILE'
}

export const enum TA_Access {
    'INSIDER',
    'OUTSIDER',
    'BOTH'
}

export class ThreatAgentMgm implements BaseEntity {
    constructor(
        public id?: number,
        public name?: string,
        public skillLevel?: SkillLevel,
        public intent?: Intent,
        public access?: TA_Access,
        public created?: any,
        public modified?: any,
        public questions?: BaseEntity[],
        public motivations?: BaseEntity[],
        public selfassessments?: BaseEntity[],
    ) {
    }
}
