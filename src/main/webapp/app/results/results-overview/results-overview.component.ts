import {Component, OnInit} from '@angular/core';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from "../../entities/self-assessment-mgm";
import {ResultsService} from "../results.service";
import {Result} from "../models/result.model";
import {HttpResponse} from "@angular/common/http";

@Component({
    selector: 'jhi-results-overview',
    templateUrl: './results-overview.component.html',
    styles: []
})
export class ResultsOverviewComponent implements OnInit {

    selfAssessment: SelfAssessmentMgm;
    result: Result;

    constructor(private selfAssessmentService: SelfAssessmentMgmService,
                private resultService: ResultsService) {
    }

    ngOnInit() {
        this.selfAssessment = this.selfAssessmentService.getSelfAssessment();
        console.log('SelfAssessment: ' + this.selfAssessment.id);

        this.resultService.getResult(this.selfAssessment.id).subscribe(
            (response: HttpResponse<Result>) => {
                this.result = response.body;
                console.log('Result: ' + JSON.stringify(this.result));
            }
        );
    }
}
