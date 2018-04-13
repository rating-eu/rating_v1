import {QuestionnaireScope} from "./QuestionnaireScope";
import { DateTime } from 'date-time-js';

export class Questionnaire {
    id: number;
    name: String;
    scope: QuestionnaireScope;
    created: DateTime;
    modified: DateTime;
}
