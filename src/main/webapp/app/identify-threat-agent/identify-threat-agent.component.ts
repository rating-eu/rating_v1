import {Component, OnInit} from '@angular/core';
import {JhiEventManager, JhiLanguageService} from 'ng-jhipster';
import {JhiLanguageHelper, LoginModalService, Principal} from '../shared';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../entities/self-assessment-mgm';

@Component({
    selector: 'jhi-identify-threat-agent',
    templateUrl: './identify-threat-agent.component.html'
})
export class IdentifyThreatAgentComponent implements OnInit {
    account: Account;
    mySelf: SelfAssessmentMgm = {};
    langs: string[] = ['de', 'en', 'es', 'fr', 'it', 'pt-pt'];
    index = 1;

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private mySelfAssessmentService: SelfAssessmentMgmService,
        private languageService: JhiLanguageService, private languageHelper: JhiLanguageHelper
    ) {
    }

    ngOnInit() {
        // this.principal.identity().then((account) => {
        //     this.account = account;
        // });
        this.mySelf = this.mySelfAssessmentService.getSelfAssessment();

    }

    previousState() {
        window.history.back();
    }

    nextLanguage() {
        this.languageService.changeLanguage('it');
    }
}
