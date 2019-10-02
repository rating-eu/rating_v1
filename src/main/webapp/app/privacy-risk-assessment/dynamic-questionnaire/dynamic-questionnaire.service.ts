import {Injectable} from '@angular/core';
import {GDPRQuestionMgm} from '../../entities/gdpr-question-mgm';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {DataRecipientMgm} from "../../entities/data-recipient-mgm";
import {DataOperationField} from "../../entities/enumerations/gdpr/DataOperationField.enum";

@Injectable()
export class DynamicQuestionnaireService {

    constructor(private formBuilder: FormBuilder) {
    }

    public buildOperationContextForm(questions: GDPRQuestionMgm[]): FormGroup {
        const formGroup: FormGroup = this.formBuilder.group(
            {}
        );

        questions.forEach((question: GDPRQuestionMgm) => {
            const field: DataOperationField = question.dataOperationField;

            switch (field) {
                case DataOperationField.NAME:
                case DataOperationField.PROCESSED_DATA:
                case DataOperationField.PROCESSING_PURPOSE:
                case DataOperationField.PROCESSING_MEANS:
                case DataOperationField.DATA_PROCESSOR:
                case DataOperationField.DATA_SUBJECT: {
                    formGroup.addControl(DataOperationField[field], this.formBuilder.control(''));
                    break;
                }
                case DataOperationField.DATA_RECIPIENTS: {
                    formGroup.addControl(DataOperationField[field], this.formBuilder.array(new Array<DataRecipientMgm>()));
                    break;
                }
            }
        });

        return formGroup;
    }

    public addDataRecipient(form: FormGroup) {
        const recipients: FormArray = form.controls[DataOperationField[DataOperationField.DATA_RECIPIENTS]] as FormArray;

        if (recipients) {
            recipients.push(
                this.formBuilder.group({
                    'name': '',
                    'type': null
                })
            );
        }
    }
}
