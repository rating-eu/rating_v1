import { DateTime } from 'date-time-js';
import {BaseEntity} from '../../shared';

export class Asset {
    id: number;
    public name: string;
    public description: string;
    public created: DateTime;
    public modified: DateTime;
    public containers: BaseEntity[];
    public domains: BaseEntity[];
    public assetcategory: BaseEntity;
    public selfassessments: BaseEntity[];
}
