import {QuestionnaireScope} from './QuestionnaireScope';
import {DateTime} from 'date-time-js';
import {BaseEntity} from "../../shared";

export class Questionnaire {
    public id?: number;
    public name?: string;
    public scope?: QuestionnaireScope;
    public created?: any;
    public modified?: any;
    public questions?: BaseEntity[];
    public selfassessments?: BaseEntity[];
}
