import {Component, Input, OnInit} from '@angular/core';
import {QuestionControlService} from './services/question-control.service';
import {FormGroup} from '@angular/forms';
import {QuestionMgm} from '../../../../entities/question-mgm';
import {AnswerMgm} from '../../../../entities/answer-mgm';
import {ThreatAgentMgm} from '../../../../entities/threat-agent-mgm';
import {Fraction} from '../../../../utils/fraction.class';
import * as CryptoJS from 'crypto-js';
import {Couple} from '../../../../utils/couple.class';

@Component({
    selector: 'jhi-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styles: [],
    providers: [QuestionControlService]
})
export class DynamicFormComponent implements OnInit {
    private static YES: String = 'YES';
    private static NO: String = 'NO';

    @Input() messageFromParent: String = 'PercheNonFunziona';
    _questionsArray: QuestionMgm[];
    form: FormGroup;
    payLoad = '';

    constructor(private questionControlService: QuestionControlService) {

    }

    @Input()
    set questionsArray(questionsArray: QuestionMgm[]) {
        console.log('QuestionsArray changed...');
        this._questionsArray = questionsArray;
        console.log('Now its ' + this._questionsArray);

        // Now we can create the form, since the questionsArray is no more undefined
        if (this._questionsArray) {
            this.form = this.questionControlService.toFormGroup(this._questionsArray);
            console.log('Form has been created...');
            console.log('Form is: ' + this.form);
        }
    }

    get questionsArray() {
        return this._questionsArray;
    }

    ngOnInit() {
        console.log('Sha256:');
        console.log(CryptoJS.SHA256('Maurizio').toString());
    }

    onSubmit() {
        console.log('OnSubmit called');
        this.payLoad = JSON.stringify(this.form.value);
        console.log('Form\'s value is:');
        console.log(this.payLoad);

        const formData = this.form.value;

        console.log('Keys: ' + Object.keys(formData));

        const formDataMap = new Map<String, AnswerMgm>();

        Object.keys(formData).forEach((key) => {
            formDataMap.set(key, formData[key] as AnswerMgm);
        });

        console.log('Map: ' + formDataMap);

        const threatAgentsMap: Map<String, Couple<ThreatAgentMgm, Fraction>> = new Map<String, Couple<ThreatAgentMgm, Fraction>>();

        formDataMap.forEach((value, key) => {
            console.log('key: ' + key);
            console.log('value: ' + JSON.stringify(value));

            const answer: AnswerMgm = value as AnswerMgm;
            const threatAgent: ThreatAgentMgm = answer.question.threatAgent;
            const threatAgentHash = CryptoJS.SHA256(JSON.stringify(threatAgent)).toString();

            if (threatAgentsMap.has(threatAgentHash)) {// a question identifying this threat agent has already been encountered.
                console.log('Threat agent already processed...');

                // fraction = #YES/#Questions
                const fraction: Fraction = threatAgentsMap.get(threatAgentHash).value;
                // increment the number of questions identifying this threat-agent
                fraction.whole++;

                if (answer.name === DynamicFormComponent.YES) {
                    console.log('Warning: you answered YES');
                    fraction.part++;
                } else if (answer.name === DynamicFormComponent.NO) {
                    console.log('Good, you answered NO');
                }
            } else {// first time
                console.log('First Time processing this threat agent');

                const fraction = new Fraction(0, 1);
                threatAgentsMap.set(threatAgentHash, new Couple<ThreatAgentMgm, Fraction>(threatAgent, fraction));

                if (answer.name === DynamicFormComponent.YES) {
                    console.log('Warning: you answered YES');
                    fraction.part++;
                } else if (answer.name === DynamicFormComponent.NO) {
                    console.log('Good, you answered NO');
                }
            }
        });

        threatAgentsMap.forEach((value, key) => {
            console.log('ThreatAgent:' + key + ' ==> ' + value.key.name + '\t' + value.value.toPercentage() + '\%');
        });
    }
}
