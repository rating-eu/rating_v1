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
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Update} from '../layouts/model/Update';
import {SelfAssessmentMgm} from '../entities/self-assessment-mgm';
import {Role} from '../entities/enumerations/Role.enum';
import {QuestionnaireStatusMgm} from "../entities/questionnaire-status-mgm";
import {MyCompanyMgm} from "../entities/my-company-mgm";
import {User} from "../shared";
import {Router} from "@angular/router";
import {SessionStorageService} from "ngx-webstorage";

@Injectable()
export class DatasharingService {

    private static readonly SELF_ASSESSMENT_KEY = 'selfAssessment';
    private _threatAgentsMap: Map<String, Couple<ThreatAgentMgm, Fraction>>;
    private _identifyThreatAgentsFormDataMap: Map<String, AnswerMgm>;
    private _cisoQuestionnaireStatus: QuestionnaireStatusMgm;
    private _externalQuestionnaireStatus: QuestionnaireStatusMgm;

    // ===Observables-BehaviorSubjects===

    // Map to keep the previous updated answers.
    // Single AttackStrategy update
    private layoutUpdateSubject: BehaviorSubject<Update> = new BehaviorSubject<Update>(null);

    // Application Mode
    private _mode: Mode = null;
    private _modeSubject: BehaviorSubject<Mode> = new BehaviorSubject<Mode>(this._mode);

    // User
    private _user: User;
    private _userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(this._user);

    // MyCompany
    private _myCompany: MyCompanyMgm = null;
    private _myCompanySubject: BehaviorSubject<MyCompanyMgm> = new BehaviorSubject<MyCompanyMgm>(this._myCompany);

    // Role
    private _role: Role = null;
    private _roleSubject: BehaviorSubject<Role> = new BehaviorSubject<Role>(this._role);

    // SelfAssessment
    private _selfAssessment: SelfAssessmentMgm = null;
    private _selfAssessmentSubject: BehaviorSubject<SelfAssessmentMgm> = new BehaviorSubject<SelfAssessmentMgm>(this._selfAssessment);


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
            this.router.navigate(['/my-risk-assessments']);
            return null;
        } else {
            let update: Update = this.getUpdate();

            if (!update) {
                update = new Update();
            }

            update.selfAssessmentId = this._selfAssessment.id.toString();
            update.navSubTitle = self.name;

            this.updateLayout(update);
            return this._selfAssessment;
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

    updateLayout(layoutUpdate: Update) {
        this.layoutUpdateSubject.next(layoutUpdate);
    }

    getUpdate(): Update {
        return this.layoutUpdateSubject.getValue();
    }

    observeUpdate(): Observable<Update> {
        return this.layoutUpdateSubject.asObservable();
    }

    clear() {
        this._roleSubject.next(null);
        this._myCompanySubject.next(null);
        this._selfAssessmentSubject.next(null);
        this._modeSubject.next(null);
        this.layoutUpdateSubject.next(null);
    }
}
