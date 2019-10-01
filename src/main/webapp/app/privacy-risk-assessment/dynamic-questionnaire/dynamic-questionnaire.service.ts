import { Injectable } from '@angular/core';
import {GDPRQuestionMgm} from "../../entities/gdpr-question-mgm";
import {FormControl, FormGroup} from "@angular/forms";

@Injectable()
export class DynamicQuestionnaireService {

  constructor() { }

  toOperationContextForm(questions: GDPRQuestionMgm[]): FormGroup{
      const group: any = {};

      questions.forEach((question) => {
          group[question.id] = new FormControl('');
      });

      const formGroup: FormGroup = new FormGroup(group);

      return formGroup;
  }
}
