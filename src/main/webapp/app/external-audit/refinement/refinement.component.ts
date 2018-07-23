import {Component, OnInit} from '@angular/core';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../entities/self-assessment-mgm';

@Component({
    selector: 'jhi-refinement',
    templateUrl: './refinement.component.html',
    styles: []
})
export class RefinementComponent implements OnInit {

    selfAssessment: SelfAssessmentMgm;

    constructor(
        private selfAssessmentService: SelfAssessmentMgmService
    ) {
    }

    ngOnInit() {
        this.selfAssessment = this.selfAssessmentService.getSelfAssessment();
    }
}
