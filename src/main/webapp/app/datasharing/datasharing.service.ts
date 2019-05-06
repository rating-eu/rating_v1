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

import { Mode } from './../entities/enumerations/Mode.enum';
import { Injectable } from '@angular/core';
import { Fraction } from '../utils/fraction.class';
import { Couple } from '../utils/couple.class';
import { ThreatAgentMgm } from '../entities/threat-agent-mgm';
import { AnswerMgm } from '../entities/answer-mgm';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { QuestionnaireMgm } from '../entities/questionnaire-mgm';
import { Update } from '../layouts/model/Update';
import { SelfAssessmentMgm } from '../entities/self-assessment-mgm';
import { HttpClient } from '@angular/common/http';
import { MyRole } from '../entities/enumerations/MyRole.enum';
import {QuestionnaireStatusMgm} from "../entities/questionnaire-status-mgm";

@Injectable()
export class DatasharingService {

    private _threatAgentsMap: Map<String, Couple<ThreatAgentMgm, Fraction>>;
    private _identifyThreatAgentsFormDataMap: Map<String, AnswerMgm>;
    private _cisoQuestionnaireStatus: QuestionnaireStatusMgm;
    private _externalQuestionnaireStatus: QuestionnaireStatusMgm;

    // ===Observables-BehaviorSubjects===

    // Map to keep the previous updated answers.
    // Single AttackStrategy update
    private layoutUpdateSubject: BehaviorSubject<Update> = new BehaviorSubject<Update>(null);
    private mySelfAssessmentSubject: BehaviorSubject<SelfAssessmentMgm> = new BehaviorSubject<SelfAssessmentMgm>(null);
    private roleSubject: BehaviorSubject<MyRole> = new BehaviorSubject<MyRole>(null);
    private appMode: BehaviorSubject<Mode> = new BehaviorSubject<Mode>(null);
    private role: MyRole = null;
    private mode: Mode = null;

    constructor(private http: HttpClient) {

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

    updateLayout(layoutUpdate: Update) {
        this.layoutUpdateSubject.next(layoutUpdate);
    }

    getUpdate(): Update {
        return this.layoutUpdateSubject.getValue();
    }

    observeUpdate(): Observable<Update> {
        return this.layoutUpdateSubject.asObservable();
    }

    updateMySelfAssessment(mySelf: SelfAssessmentMgm) {
        this.mySelfAssessmentSubject.next(mySelf);
    }

    getMySelfAssessment(): SelfAssessmentMgm {
        return this.mySelfAssessmentSubject.getValue();
    }

    observeMySelf(): Observable<SelfAssessmentMgm> {
        return this.mySelfAssessmentSubject.asObservable();
    }

    observeRole(): Observable<MyRole> {
        return this.roleSubject.asObservable();
    }

    updateRole(role: MyRole) {
        this.role = role;
        this.roleSubject.next(this.role);
    }

    observeMode(): Observable<Mode> {
        return this.appMode.asObservable();
    }

    updateMode(mode: Mode) {
        this.mode = mode;
        this.appMode.next(mode);
    }

    getMode() {
        return this.mode;
    }

    getRole() {
        return this.role;
    }

    clear() {
        this.mySelfAssessmentSubject.next(null);
        this.layoutUpdateSubject.next(null);
        this.roleSubject.next(null);
    }
}
