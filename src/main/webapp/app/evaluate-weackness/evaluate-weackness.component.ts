import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {JhiEventManager, JhiAlertService} from 'ng-jhipster';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../entities/self-assessment-mgm';
import {AttackStrategyMgm} from '../entities/attack-strategy-mgm/attack-strategy-mgm.model';
import {AttackStrategyMgmService} from '../entities/attack-strategy-mgm/attack-strategy-mgm.service';
import {Principal} from '../shared';

@Component({
    selector: 'jhi-evaluate-weackness',
    templateUrl: './evaluate-weackness.component.html'
})
export class EvaluateWeacknessComponent implements OnInit, OnDestroy {
    attackStrategies: AttackStrategyMgm[];
    HU_R: AttackStrategyMgm[];
    HU_W: AttackStrategyMgm[];
    HU_D: AttackStrategyMgm[];
    HU_E: AttackStrategyMgm[];
    HU_I: AttackStrategyMgm[];
    HU_C: AttackStrategyMgm[];
    IT_R: AttackStrategyMgm[];
    IT_W: AttackStrategyMgm[];
    IT_D: AttackStrategyMgm[];
    IT_E: AttackStrategyMgm[];
    IT_I: AttackStrategyMgm[];
    IT_C: AttackStrategyMgm[];
    PH_R: AttackStrategyMgm[];
    PH_W: AttackStrategyMgm[];
    PH_D: AttackStrategyMgm[];
    PH_E: AttackStrategyMgm[];
    PH_I: AttackStrategyMgm[];
    PH_C: AttackStrategyMgm[];
    account: Account;
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    mySelf: SelfAssessmentMgm = {};

    constructor(
        private attackStrategyService: AttackStrategyMgmService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal,
        private mySelfAssessmentService: SelfAssessmentMgmService

) {
    }

    getAttacksHU_R(level, phase) {
        this.attackStrategyService
            .findByLevelAndPhase(level, phase)
            .subscribe(
                (res: HttpResponse<AttackStrategyMgm[]>) => this.HU_R = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        return;
    }

    getAttacksHU_W(level, phase) {
        this.attackStrategyService
            .findByLevelAndPhase(level, phase)
            .subscribe(
                (res: HttpResponse<AttackStrategyMgm[]>) => this.HU_W = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        return;
    }

    getAttacksHU_D(level, phase) {
        this.attackStrategyService
            .findByLevelAndPhase(level, phase)
            .subscribe(
                (res: HttpResponse<AttackStrategyMgm[]>) => this.HU_D = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        return;
    }

    getAttacksHU_E(level, phase) {
        this.attackStrategyService
            .findByLevelAndPhase(level, phase)
            .subscribe(
                (res: HttpResponse<AttackStrategyMgm[]>) => this.HU_E = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        return;
    }

    getAttacksHU_I(level, phase) {
        this.attackStrategyService
            .findByLevelAndPhase(level, phase)
            .subscribe(
                (res: HttpResponse<AttackStrategyMgm[]>) => this.HU_I = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        return;
    }

    getAttacksHU_C(level, phase) {
        this.attackStrategyService
            .findByLevelAndPhase(level, phase)
            .subscribe(
                (res: HttpResponse<AttackStrategyMgm[]>) => this.HU_C = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        return;
    }

    getAttacksIT_R(level, phase) {
        this.attackStrategyService
            .findByLevelAndPhase(level, phase)
            .subscribe(
                (res: HttpResponse<AttackStrategyMgm[]>) => this.IT_R = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        return;
    }

    getAttacksIT_W(level, phase) {
        this.attackStrategyService
            .findByLevelAndPhase(level, phase)
            .subscribe(
                (res: HttpResponse<AttackStrategyMgm[]>) => this.IT_W = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        return;
    }

    getAttacksIT_D(level, phase) {
        this.attackStrategyService
            .findByLevelAndPhase(level, phase)
            .subscribe(
                (res: HttpResponse<AttackStrategyMgm[]>) => this.IT_D = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        return;
    }

    getAttacksIT_E(level, phase) {
        this.attackStrategyService
            .findByLevelAndPhase(level, phase)
            .subscribe(
                (res: HttpResponse<AttackStrategyMgm[]>) => this.IT_E = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        return;
    }

    getAttacksIT_I(level, phase) {
        this.attackStrategyService
            .findByLevelAndPhase(level, phase)
            .subscribe(
                (res: HttpResponse<AttackStrategyMgm[]>) => this.IT_I = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        return;
    }

    getAttacksIT_C(level, phase) {
        this.attackStrategyService
            .findByLevelAndPhase(level, phase)
            .subscribe(
                (res: HttpResponse<AttackStrategyMgm[]>) => this.IT_C = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        return;
    }

    getAttacksPH_R(level, phase) {
        this.attackStrategyService
            .findByLevelAndPhase(level, phase)
            .subscribe(
                (res: HttpResponse<AttackStrategyMgm[]>) => this.PH_R = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        return;
    }

    getAttacksPH_W(level, phase) {
        this.attackStrategyService
            .findByLevelAndPhase(level, phase)
            .subscribe(
                (res: HttpResponse<AttackStrategyMgm[]>) => this.PH_W = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        return;
    }

    getAttacksPH_D(level, phase) {
        this.attackStrategyService
            .findByLevelAndPhase(level, phase)
            .subscribe(
                (res: HttpResponse<AttackStrategyMgm[]>) => this.PH_D = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        return;
    }

    getAttacksPH_E(level, phase) {
        this.attackStrategyService
            .findByLevelAndPhase(level, phase)
            .subscribe(
                (res: HttpResponse<AttackStrategyMgm[]>) => this.PH_E = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        return;
    }

    getAttacksPH_I(level, phase) {
        this.attackStrategyService
            .findByLevelAndPhase(level, phase)
            .subscribe(
                (res: HttpResponse<AttackStrategyMgm[]>) => this.PH_I = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        return;
    }

    getAttacksPH_C(level, phase) {
        this.attackStrategyService
            .findByLevelAndPhase(level, phase)
            .subscribe(
                (res: HttpResponse<AttackStrategyMgm[]>) => this.PH_C = res.body,
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        return;
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();
        this.registerChangeInEvaluateWeakness();
        this.getAttacksHU_R('HUMAN', 'RECONNAISSANCE');
        this.getAttacksIT_R('IT', 'RECONNAISSANCE');
        this.getAttacksPH_R('PHYSICAL', 'RECONNAISSANCE');
        this.getAttacksHU_W('HUMAN', 'WEAPONIZATION');
        this.getAttacksIT_W('IT', 'WEAPONIZATION');
        this.getAttacksPH_W('PHYSICAL', 'WEAPONIZATION');
        this.getAttacksHU_D('HUMAN', 'DELIVERY');
        this.getAttacksIT_D('IT', 'DELIVERY');
        this.getAttacksPH_D('PHYSICAL', 'DELIVERY');
        this.getAttacksHU_E('HUMAN', 'EXPLOITATION');
        this.getAttacksIT_E('IT', 'EXPLOITATION');
        this.getAttacksPH_E('PHYSICAL', 'EXPLOITATION');
        this.getAttacksHU_I('HUMAN', 'INSTALLATION');
        this.getAttacksIT_I('IT', 'INSTALLATION');
        this.getAttacksPH_I('PHYSICAL', 'INSTALLATION');
        this.getAttacksHU_C('HUMAN', 'COMMANDCONTROL');
        this.getAttacksIT_C('IT', 'COMMANDCONTROL');
        this.getAttacksPH_C('PHYSICAL', 'COMMANDCONTROL');
    }

    previousState() {
        window.history.back();
    }
    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: AttackStrategyMgm) {
        return item.id;
    }
    registerChangeInEvaluateWeakness() {
        this.eventSubscriber = this.eventManager.subscribe('WeaknessListModification', (response) => this.ngOnInit());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
