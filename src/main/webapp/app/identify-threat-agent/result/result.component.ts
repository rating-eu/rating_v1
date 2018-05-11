import {Component, OnInit} from '@angular/core';
import {DatasharingService} from '../../datasharing/datasharing.service';

@Component({
    selector: 'jhi-result',
    templateUrl: './result.component.html',
    styles: []
})
export class ResultComponent implements OnInit {

    constructor(private dataSharingService: DatasharingService) {
    }

    ngOnInit() {
        console.log('Message from dataSharingService is: ' + this.dataSharingService.getMessage());
    }

}
