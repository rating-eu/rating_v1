import {Component, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {DataImpactDescriptionMgm, DataImpactDescriptionMgmService} from '../../entities/data-impact-description-mgm';

@Component({
    selector: 'jhi-impact-level-description',
    templateUrl: './data-impacts-description.component.html',
    styles: []
})
export class DataImpactsDescriptionComponent implements OnInit {

    public descriptions: DataImpactDescriptionMgm[];

    constructor(private dataImpactDescriptionService: DataImpactDescriptionMgmService) {
    }

    ngOnInit() {
        this.descriptions = [];

        this.dataImpactDescriptionService.getAll()
            .toPromise()
            .then((response: HttpResponse<DataImpactDescriptionMgm[]>) => {
                this.descriptions = response.body;
            });
    }
}
