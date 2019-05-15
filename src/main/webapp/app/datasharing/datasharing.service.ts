/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {Mode} from './../entities/enumerations/Mode.enum';
import {Injectable} from '@angular/core';
import {Fraction} from '../utils/fraction.class';
import {Couple} from '../utils/couple.class';
import {ThreatAgentMgm} from '../entities/threat-agent-mgm';
import {AnswerMgm} from '../entities/answer-mgm';
import {Observable} from 'rxjs/Observable';
import {LayoutConfiguration} from '../layouts/model/LayoutConfiguration';
import {SelfAssessmentMgm} from '../entities/self-assessment-mgm';
import {Role} from '../entities/enumerations/Role.enum';
import {QuestionnaireStatusMgm} from "../entities/questionnaire-status-mgm";
import {MyCompanyMgm} from "../entities/my-company-mgm";
import {User} from "../shared";
import {Router} from "@angular/router";
import {SessionStorageService} from "ngx-webstorage";
import {RiskBoardStatus} from "../risk-board/risk-board.service";
import {ReplaySubject} from "rxjs";

@Injectable()
export class DatasharingService {

    private static readonly SELF_ASSESSMENT_KEY = 'selfAssessment';
    private _threatAgentsMap: Map<String, Couple<ThreatAgentMgm, Fraction>>;
    private _identifyThreatAgentsFormDataMap: Map<String, AnswerMgm>;
    private _cisoQuestionnaireStatus: QuestionnaireStatusMgm;
    private _externalQuestionnaireStatus: QuestionnaireStatusMgm;

    // ===Observables-BehaviorSubjects===

    // Application Mode
    private _mode: Mode = null;
    private _modeSubject: ReplaySubject<Mode> = new ReplaySubject<Mode>();

    // User
    private _user: User;
    private _userSubject: ReplaySubject<User> = new ReplaySubject<User>();

    // MyCompany
    private _myCompany: MyCompanyMgm = null;
    private _myCompanySubject: ReplaySubject<MyCompanyMgm> = new ReplaySubject<MyCompanyMgm>();

    // Role
    private _role: Role = null;
    private _roleSubject: ReplaySubject<Role> = new ReplaySubject<Role>();

    // SelfAssessment
    private _selfAssessment: SelfAssessmentMgm = null;
    private _selfAssessmentSubject: ReplaySubject<SelfAssessmentMgm> = new ReplaySubject<SelfAssessmentMgm>();

    // RiskBoard Status
    private _riskBoardStatus: RiskBoardStatus = null;
    private _riskBoardStatusSubject: ReplaySubject<RiskBoardStatus> = new ReplaySubject<RiskBoardStatus>();

    // Layout Configuration
    private _layoutConfiguration: LayoutConfiguration = null;
    private _layoutConfigurationSubject: ReplaySubject<LayoutConfiguration> = new ReplaySubject<LayoutConfiguration>();

    constructor(
        private router: Router,
        private sessionStorage: SessionStorageService
    ) {
    }

    set threatAgentsMap(threatAgents: Map<String, Couple<ThreatAgentMgm, Fraction>>) {
        this._threatAgentsMap = threatAgents;
    }

    get threatAgentsMap(): Map<String, Couple<ThreatAgentMgm, Fraction>> {
        return this._threatAgentsMap;
    }

    get identifyThreatAgentsFormDataMap(): Map<String, AnswerMgm> {
        return this._identifyThreatAgentsFormDataMap;
    }

    set identifyThreatAgentsFormDataMap(value: Map<String, AnswerMgm>) {
        this._identifyThreatAgentsFormDataMap = value;
    }

    get cisoQuestionnaireStatus(): QuestionnaireStatusMgm {
        return this._cisoQuestionnaireStatus;
    }

    set cisoQuestionnaireStatus(value: QuestionnaireStatusMgm) {
        this._cisoQuestionnaireStatus = value;
    }

    get externalQuestionnaireStatus(): QuestionnaireStatusMgm {
        return this._externalQuestionnaireStatus;
    }

    set externalQuestionnaireStatus(value: QuestionnaireStatusMgm) {
        this._externalQuestionnaireStatus = value;
    }

    // MyCompany property
    set myCompany(myCompany: MyCompanyMgm) {
        this._myCompany = myCompany;
        this._myCompanySubject.next(this._myCompany);
    }

    get myCompany(): MyCompanyMgm {
        return this._myCompany;
    }

    get myCompanyObservable(): Observable<MyCompanyMgm> {
        return this._myCompanySubject.asObservable();
    }

    // SelfAssessment property
    set selfAssessment(selfAssessment: SelfAssessmentMgm) {
        this._selfAssessment = selfAssessment;
        this.sessionStorage.store(DatasharingService.SELF_ASSESSMENT_KEY, this._selfAssessment);
        this._selfAssessmentSubject.next(this._selfAssessment);
    }

    get selfAssessment(): SelfAssessmentMgm {
        if (!this._selfAssessment) {
            this._selfAssessment = this.sessionStorage.retrieve(DatasharingService.SELF_ASSESSMENT_KEY);
        }

        if (!this._selfAssessment) {
            return null;
        } else {
            let configuration: LayoutConfiguration = this.layoutConfiguration;

            if (!configuration) {
                configuration = new LayoutConfiguration();
            }

            configuration.selfAssessmentId = this._selfAssessment.id.toString();
            configuration.navSubTitle = self.name;

            this.layoutConfiguration = configuration;
            return this._selfAssessment;
        }
    }

    checkSelfAssessment() {
        if (!this.selfAssessment) {
            this.router.navigate(['/my-risk-assessments']);
        }
    }

    get selfAssessmentObservable(): Observable<SelfAssessmentMgm> {
        return this._selfAssessmentSubject.asObservable();
    }

    // Role property
    get role(): Role {
        return this._role;
    }

    set role(role: Role) {
        this._role = role;
        this._roleSubject.next(this._role);
    }

    get roleObservable(): Observable<Role> {
        return this._roleSubject.asObservable();
    }

    // Mode property
    get mode(): Mode {
        return this._mode;
    }

    set mode(mode: Mode) {
        this._mode = mode;
        this._modeSubject.next(this._mode);
    }

    get modeObservable(): Observable<Mode> {
        return this._modeSubject.asObservable();
    }

    // User property
    get user(): User {
        return this._user;
    }

    set user(user: User) {
        this._user = user;
        this._userSubject.next(this.user);
    }

    get userObservable(): Observable<User> {
        return this._userSubject.asObservable();
    }

    // RiskBoard Status property
    get riskBoardStatus(): RiskBoardStatus {
        return this._riskBoardStatus;
    }

    set riskBoardStatus(status: RiskBoardStatus) {
        this._riskBoardStatus = status;
        this._riskBoardStatusSubject.next(this._riskBoardStatus);
    }

    get riskBoardStatusObservable(): Observable<RiskBoardStatus> {
        return this._riskBoardStatusSubject.asObservable();
    }

    // Layout Configuration property
    get layoutConfiguration(): LayoutConfiguration {
        return this._layoutConfiguration;
    }

    set layoutConfiguration(configuration: LayoutConfiguration) {
        this._layoutConfiguration = configuration;
        this._layoutConfigurationSubject.next(this._layoutConfiguration);
    }

    get layoutConfigurationObservable(): Observable<LayoutConfiguration> {
        return this._layoutConfigurationSubject.asObservable();
    }

    clear() {
        this.role = null;
        this.myCompany = null;
        this.selfAssessment = null;
        this.mode = null;
        this.layoutConfiguration = null;
    }
}
