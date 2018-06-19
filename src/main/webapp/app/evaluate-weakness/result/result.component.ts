import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {QuestionnaireStatusMgmService} from '../../entities/questionnaire-status-mgm';
import {HttpResponse} from '@angular/common/http';
import {QuestionnaireStatusMgm} from '../../entities/questionnaire-status-mgm/questionnaire-status-mgm.model';
import {Observable} from 'rxjs/Observable';
import {MyAnswerMgm, MyAnswerMgmService} from '../../entities/my-answer-mgm';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {PhaseMgm} from '../../entities/phase-mgm';
import {LevelMgm} from '../../entities/level-mgm';
import {AttackStrategyMgm} from '../../entities/attack-strategy-mgm/attack-strategy-mgm.model';

@Component({
    selector: 'jhi-result',
    templateUrl: './result.component.html',
    styles: []
})
export class WeaknessResultComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    attackStrategies: AttackStrategyMgm[];
    attackLayers: LevelMgm[];
    cyberKillChainPhases: PhaseMgm[];
    attacksCKC7Matrix: AttackStrategyMgm[][][];

    constructor(private route: ActivatedRoute,
                private questionnaireStatusService: QuestionnaireStatusMgmService,
                private myAnswerService: MyAnswerMgmService) {
    }

    ngOnInit() {
        this.subscriptions.push(
            this.route.params.subscribe(
                (params: Params) => {
                    const questionnaireStatusID: number = params['statusID'];
                    console.log('QuestionnaireStatusID: ' + questionnaireStatusID);

                    const getObservables: Observable<HttpResponse<any>>[] = [];
                    getObservables.push(this.questionnaireStatusService.find(questionnaireStatusID));
                    getObservables.push(this.myAnswerService.getAllByQuestionnaireStatusID(questionnaireStatusID));

                    forkJoin(getObservables).toPromise().then(
                        (responses: any[]) => {
                            responses.forEach((value, index, array) => {
                                switch (index) {
                                    case 0: {
                                        const questionnaireStatus: QuestionnaireStatusMgm = (value as HttpResponse<QuestionnaireStatusMgm>).body;
                                        console.log('QuestionnaireStatus: ' + JSON.stringify(questionnaireStatus));
                                        break;
                                    }
                                    case 1: {
                                        const myAnswers: MyAnswerMgm[] = (value as HttpResponse<MyAnswerMgm[]>).body;
                                        console.log('MyAnswers: ' + JSON.stringify(myAnswers));
                                        break;
                                    }
                                }
                            });
                        }
                    );
                }
            )
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
    }

}
