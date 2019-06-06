import {Component, OnInit} from '@angular/core';
import {DatasharingService} from "../../datasharing/datasharing.service";
import {SelfAssessmentMgm, SelfAssessmentMgmService} from "../../entities/self-assessment-mgm";
import {Router} from "@angular/router";
import {ImpactMode} from "../../entities/enumerations/ImpactMode.enum";

@Component({
    selector: 'jhi-choice',
    templateUrl: './choice.component.html',
    styles: []
})
export class ChoiceComponent implements OnInit {

    private selfAssessment: SelfAssessmentMgm;
    private impactMode: ImpactMode;

    constructor(private router: Router,
                private dataSharing: DatasharingService,
                private selfAssessmentService: SelfAssessmentMgmService) {
    }

    ngOnInit() {
        this.dataSharing.checkSelfAssessment();
        this.selfAssessment = this.dataSharing.selfAssessment;

        this.dataSharing.selfAssessment$.subscribe((value: SelfAssessmentMgm) => {
            this.selfAssessment = value;
        });
    }

    quantitativeMode() {
        this.impactMode = ImpactMode.QUANTITATIVE;

        if (this.selfAssessment) {
            switch (this.selfAssessment.impactMode) {
                case ImpactMode.QUANTITATIVE: {
                    // Just redirect
                    this.router.navigate(['/impact-evaluation/quantitative']);
                    break;
                }
                default: {
                    // Update the ImpactMode
                    this.selfAssessment.impactMode = ImpactMode.QUANTITATIVE;

                    this.selfAssessmentService.update(this.selfAssessment).subscribe((response) => {
                        this.selfAssessment = response.body;
                        this.dataSharing.selfAssessment = this.selfAssessment;

                        this.router.navigate(['/impact-evaluation/quantitative']);
                    });
                }
            }
        }
    }

    qualitativeMode() {
        this.impactMode = ImpactMode.QUALITATIVE;

        if (this.selfAssessment) {
            switch (this.selfAssessment.impactMode) {
                case ImpactMode.QUALITATIVE: {
                    // Just redirect
                    this.router.navigate(['/impact-evaluation/qualitative']);
                    break;
                }
                default: {
                    // Update the ImpactMode
                    this.selfAssessment.impactMode = ImpactMode.QUALITATIVE;

                    this.selfAssessmentService.update(this.selfAssessment).subscribe((response) => {
                        this.selfAssessment = response.body;
                        this.dataSharing.selfAssessment = this.selfAssessment;

                        this.router.navigate(['/impact-evaluation/qualitative']);
                    });
                }
            }
        }
    }
}
