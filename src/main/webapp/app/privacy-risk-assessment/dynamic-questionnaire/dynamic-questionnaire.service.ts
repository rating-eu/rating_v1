import {Injectable} from '@angular/core';
import {GDPRQuestionMgm} from '../../entities/gdpr-question-mgm';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {DataRecipientMgm} from "../../entities/data-recipient-mgm";
import {DataOperationField} from "../../entities/enumerations/gdpr/DataOperationField.enum";
import {DataOperationMgm} from "../../entities/data-operation-mgm";
import {SecurityPillar} from "../../entities/enumerations/gdpr/SecurityPillar.enum";

@Injectable()
export class DynamicQuestionnaireService {

    constructor(private formBuilder: FormBuilder) {
    }

    /*===Operation Context===*/
    public buildOperationContextForm(dataOperation: DataOperationMgm, questions: GDPRQuestionMgm[]): FormGroup {
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

                    if (dataOperation && dataOperation.recipients) {
                        dataOperation.recipients.forEach((recipient: DataRecipientMgm) => {
                                this.addDataRecipient(formGroup);
                            }
                        );
                    }

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

    public removeRecipient(form: FormGroup, index: number) {
        const recipients: FormArray = form.controls[DataOperationField[DataOperationField.DATA_RECIPIENTS]] as FormArray;

        if (recipients) {
            recipients.removeAt(index);
        }
    }

    /*===Impact Evaluation===*/
    public buildImpactEvaluationForm(dataOperation: DataOperationMgm, questions: GDPRQuestionMgm[]): FormGroup {
        const formGroup: FormGroup = this.formBuilder.group(
            {}
        );

        questions.forEach((question: GDPRQuestionMgm) => {
            const securityPillar: SecurityPillar = question.securityPillar;

            switch (securityPillar) {
                case SecurityPillar.CONFIDENTIALITY:
                case SecurityPillar.INTEGRITY:
                case SecurityPillar.AVAILABILITY: {
                    formGroup.addControl(SecurityPillar[securityPillar], this.formBuilder.control(''));
                    break;
                }
            }
        });

        return formGroup;
    }

    /*===Threat Likelihood===*/
    public buildThreatLikelihoodForm(dataOperation: DataOperationMgm, questions: GDPRQuestionMgm[]): FormGroup {
        const formGroup: FormGroup = this.formBuilder.group(
            {}
        );

        questions.forEach((question: GDPRQuestionMgm) => {
            formGroup.addControl(String(question.id), this.formBuilder.control(''));
        });

        return formGroup;
    }
}
