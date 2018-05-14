import { BaseEntity } from './../../shared';
import {MotivationMgm} from '../motivation-mgm';

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
        public description?: string,
        public imageContentType?: string,
        public image?: any,
        public skillLevel?: SkillLevel,
        public intent?: Intent,
        public access?: TA_Access,
        public created?: any,
        public modified?: any,
        public identifiedByDefault?: boolean,
        public questions?: BaseEntity[],
        public motivations?: MotivationMgm[],
        public selfassessments?: BaseEntity[],
    ) {
        this.identifiedByDefault = false;
    }
}
