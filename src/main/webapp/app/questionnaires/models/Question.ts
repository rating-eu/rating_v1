import {DateTime} from "date-time-js";

export class Question {
    id: number;
    name: string;
    created: DateTime;
    modified: DateTime;

    questionnaire: Number;
}
