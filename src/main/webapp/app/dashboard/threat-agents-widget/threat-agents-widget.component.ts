import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelfAssessmentMgmService, SelfAssessmentMgm } from '../../entities/self-assessment-mgm';
import { MyAnswerMgmService, MyAnswerMgm } from '../../entities/my-answer-mgm';
import { QuestionMgmService, QuestionMgm } from '../../entities/question-mgm';
import { QuestionnaireStatusMgm, QuestionnaireStatusMgmService } from '../../entities/questionnaire-status-mgm';
import { HttpResponse } from '@angular/common/http';
import { MotivationMgmService, MotivationMgm } from '../../entities/motivation-mgm';
import { ThreatAgentMgmService, ThreatAgentMgm } from '../../entities/threat-agent-mgm';
import { mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Couple } from '../../utils/couple.class';
import { Fraction } from '../../utils/fraction.class';
import { SkillLevel } from '../../entities/enumerations/SkillLevel.enum';
import { Subscription, Observable } from 'rxjs';
import { QuestionnaireMgm } from '../../entities/questionnaire-mgm';
import { BaseEntity } from '../../shared';
import { AnswerMgm } from '../../entities/answer-mgm';
import * as CryptoJS from 'crypto-js';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService, DashboardStatus } from '../dashboard.service';

@Component({
  selector: 'jhi-threat-agents-widget',
  templateUrl: './threat-agents-widget.component.html',
  styleUrls: ['threat-agents-widget.component.css']
})
export class ThreatAgentsWidgetComponent implements OnInit, OnDestroy {
  private static YES = 'YES';
  private static NO = 'NO';

  private closeResult: string;

  private subscriptions: Subscription[] = [];
  private questionnaire: QuestionnaireMgm;

  public selectedThreatAgent: ThreatAgentMgm = null;
  public selfAssessment: SelfAssessmentMgm;
  public loading = false;

  // ThreatAgents
  private defaultThreatAgents$: Observable<HttpResponse<ThreatAgentMgm[]>>;
  private defaultThreatAgents: ThreatAgentMgm[];

  // Motivations
  private motivations$: Observable<HttpResponse<MotivationMgm[]>>;
  public motivations: MotivationMgm[];

  private defaultThreatAgentsMotivations$: Observable<[HttpResponse<ThreatAgentMgm[]>, HttpResponse<MotivationMgm[]>]>;

  // QuestionnaireStatus
  private questionnaireStatuses$: Observable<HttpResponse<QuestionnaireStatusMgm[]>>;
  private questionnaireStatus: QuestionnaireStatusMgm;

  // MyAnswers
  private myAnswers$: Observable<HttpResponse<MyAnswerMgm[]>>;
  private myAnswers: MyAnswerMgm[];

  // Questions
  private questions$: Observable<HttpResponse<QuestionMgm[]>>;
  private questions: QuestionMgm[];
  private questionsMap: Map<number, QuestionMgm>;

  // Questions & MyAnswers Join
  private questionsMyAnswers$: Observable<[HttpResponse<QuestionMgm[]>, HttpResponse<MyAnswerMgm[]>]>;

  // ThreatAgents Percentage Map
  private threatAgentsPercentageMap: Map<String, Couple<ThreatAgentMgm, Fraction>>;
  private threatAgentsPercentageArray: Couple<ThreatAgentMgm, Fraction>[];

  private status: DashboardStatus;

  constructor(
    private selfAssessmentService: SelfAssessmentMgmService,
    private myAnswerService: MyAnswerMgmService,
    private questionService: QuestionMgmService,
    private questionnaireStatusService: QuestionnaireStatusMgmService,
    private motivationsService: MotivationMgmService,
    private threatAgentService: ThreatAgentMgmService,
    private modalService: NgbModal,
    private dashService: DashboardService
  ) { }

  ngOnInit() {
    this.loading = true;
    // identifyThreatAgentsStatus checker
    this.status = this.dashService.getStatus();

    // The below code is been copy and customized from the resul.component of the identify-threat-agents module
    this.selfAssessment = this.selfAssessmentService.getSelfAssessment();
    this.questionnaireStatuses$ = this.questionnaireStatusService.getAllBySelfAssessmentAndQuestionnairePurpose(this.selfAssessment.id, 'ID_THREAT_AGENT');

    // First Fetch the QuestionnaireStatus with the above observable.
    // Then Create the Observable for the Questions and MyAnswers belonging to the fetched QuestionnaireStatus.
    this.questionsMyAnswers$ = this.questionnaireStatuses$.pipe(
      mergeMap((questionnaireStatusResponse: HttpResponse<QuestionnaireStatusMgm[]>) => {
        this.questionnaireStatus = questionnaireStatusResponse.body[0];
        if (!this.questionnaireStatus) {
          return forkJoin(Observable.of(null), Observable.of(null));
        }
        // console.log('QuestionnaireStatus: ' + JSON.stringify(this.questionnaireStatus));
        this.questionnaire = this.questionnaireStatus.questionnaire;
        // console.log('Questionnaire: ' + JSON.stringify(this.questionnaire));
        this.questions$ = this.questionService.getQuestionsByQuestionnaire(this.questionnaire.id);
        this.myAnswers$ = this.myAnswerService.getAllByQuestionnaireStatusID(this.questionnaireStatus.id);
        return forkJoin(this.questions$, this.myAnswers$);
      })
    );
    // Create the Observable to fetch the Motivations of the ThreatAgents
    this.motivations$ = this.motivationsService.query();
    // Create the Observable to fetch the default ThreatAgents
    this.defaultThreatAgents$ = this.threatAgentService.getDefaultThreatAgents();
    // Chain observables
    this.defaultThreatAgentsMotivations$ =
      this.questionsMyAnswers$.mergeMap(
        (response: [HttpResponse<QuestionMgm[]>, HttpResponse<MyAnswerMgm[]>]) => {
          if (!response[0] || !response[1]) {
            return forkJoin(Observable.of(null), Observable.of(null));
          }
          this.questions = response[0].body;
          // console.log('Questions: ' + JSON.stringify(this.questions));
          this.myAnswers = response[1].body;
          // console.log('MyAnswers: ' + JSON.stringify(this.myAnswers));
          return forkJoin(this.defaultThreatAgents$, this.motivations$);
        }
      );
    this.defaultThreatAgentsMotivations$.subscribe(
      (response: [HttpResponse<ThreatAgentMgm[]>, HttpResponse<MotivationMgm[]>]) => {
        if (!response[0] || !response[1]) {
          this.loading = false;
          return;
        }
        this.defaultThreatAgents = response[0].body;
        // console.log('DefaultThreatAgents: ' + JSON.stringify(this.defaultThreatAgents));

        this.motivations = response[1].body;
        // console.log('Motivations: ' + JSON.stringify(this.motivations));

        this.questionsMap = this.arrayToMap<QuestionMgm>(this.questions);

        this.threatAgentsPercentageMap = this.questionsMyAnswersToThreatAgentsPercentageMap(this.questionsMap, this.myAnswers, this.defaultThreatAgents);
        this.threatAgentsPercentageArray = Array.from(this.threatAgentsPercentageMap.values());

        // Sort ThreatAgents by Skills * Accuracy
        this.threatAgentsPercentageArray = this.threatAgentsPercentageArray.sort(
          (a: Couple<ThreatAgentMgm, Fraction>, b: Couple<ThreatAgentMgm, Fraction>) => {
            const aSkill: number = Number(SkillLevel[a.key.skillLevel]);
            const bSkill: number = Number(SkillLevel[b.key.skillLevel]);

            const aAccuracy: number = Number(a.value.toPercentage().toFixed(2));
            const bAccuracy: number = Number(b.value.toPercentage().toFixed(2));

            const aStrength: number = aSkill * aAccuracy;
            const bStrength: number = bSkill * bAccuracy;

            const result = (aStrength - bStrength) * -1;

            return result;
          }
        );
        if (!this.selfAssessment.threatagents || !this.motivations || !this.threatAgentsPercentageArray) {
          this.status.identifyThreatAgentsStatus = false;
          this.dashService.updateStatus(this.status);
        } else {
          if (this.selfAssessment.threatagents.length !== 0 && this.motivations.length !== 0 && this.threatAgentsPercentageArray.length !== 0) {
            this.status.identifyThreatAgentsStatus = true;
            this.dashService.updateStatus(this.status);
          } else {
            this.status.identifyThreatAgentsStatus = false;
            this.dashService.updateStatus(this.status);
          }
        }
        this.loading = false;
        // console.log('ThreatAgentsPercentageArray: ' + JSON.stringify(this.threatAgentsPercentageArray));
      }
    );
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.forEach((subscription: Subscription) => {
        if (subscription) {
          subscription.unsubscribe();
        }
      });
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  open(content) {
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  /**
     * Converts the input array to a Map having the item's ID as the KEY and the item itself as the VALUE.
     * Attention: If the array contains more items with the same ID, only the last of them will be present.
     * The id of the item must be a number.
     * @param {T[]} array The input array.
     * @returns {Map<number, T extends BaseEntity>} The output map.
     */
  private arrayToMap<T extends BaseEntity>(array: T[]): Map<number, T> {

    const map: Map<number, T> = new Map<number, T>();

    array.forEach((item: T) => {
      map.set(Number(item.id), item);
    });

    return map;
  }

  private questionsMyAnswersToThreatAgentsPercentageMap(questionsMap: Map<number, QuestionMgm>,
    myAnswers: MyAnswerMgm[],
    defaultThreatAgents: ThreatAgentMgm[]): Map<String, Couple<ThreatAgentMgm, Fraction>> {

    const map: Map<string, Couple<ThreatAgentMgm, Fraction>> = new Map<string, Couple<ThreatAgentMgm, Fraction>>();

    myAnswers.forEach((myAnswer: MyAnswerMgm) => {
      const question: QuestionMgm = this.questionsMap.get(myAnswer.question.id);
      const answer: AnswerMgm = myAnswer.answer;
      const threatAgent: ThreatAgentMgm = question.threatAgent;

      // The hash of the ThreatAgent JSON is used as the Key of the Map.
      const threatAgentHash: string = CryptoJS.SHA256(JSON.stringify(threatAgent)).toString();

      if (map.has(threatAgentHash)) {// a question identifying this threat agent has already been encountered.
        // console.log('Threat agent already processed...');
        // fraction = #YES/#Questions
        const fraction: Fraction = map.get(threatAgentHash).value;
        // increment the number of questions identifying this threat-agent
        fraction.whole++;
        if (answer.name.toUpperCase() === ThreatAgentsWidgetComponent.YES) {
          // console.log('Warning: you answered YES');
          fraction.part++;
        } else if (answer.name.toUpperCase() === ThreatAgentsWidgetComponent.NO) {
          // console.log('Good, you answered NO');
        }
      } else {// first time
        // console.log('First Time processing this threat agent');
        const fraction = new Fraction(0, 1);
        map.set(threatAgentHash, new Couple<ThreatAgentMgm, Fraction>(threatAgent, fraction));
        if (answer.name.toUpperCase() === ThreatAgentsWidgetComponent.YES) {
          // console.log('Warning: you answered YES');
          fraction.part++;
        } else if (answer.name.toUpperCase() === ThreatAgentsWidgetComponent.NO) {
          // console.log('Good, you answered NO');
        }
      }
    });

    // Default ThreatAgents
    defaultThreatAgents.forEach((threatAgent: ThreatAgentMgm) => {
      // The hash of the ThreatAgent JSON is used as the Key of the Map.
      const threatAgentHash: string = CryptoJS.SHA256(JSON.stringify(threatAgent)).toString();
      const fraction: Fraction = new Fraction(1, 1); // 100%
      const couple: Couple<ThreatAgentMgm, Fraction> = new Couple<ThreatAgentMgm, Fraction>(threatAgent, fraction);

      map.set(threatAgentHash, couple);
    });

    return map;
  }

  public selectThreatAgent(threatAgent: ThreatAgentMgm) {
    if (this.selectedThreatAgent) {
      if (this.selectedThreatAgent.id === threatAgent.id) {
        this.selectedThreatAgent = null;
      } else {
        this.selectedThreatAgent = threatAgent;
      }
    } else {
      this.selectedThreatAgent = threatAgent;
    }
  }
}
