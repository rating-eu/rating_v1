import {Component, Input, OnInit, ViewRef} from '@angular/core';
import {DataOperationMgm} from "../../entities/data-operation-mgm";

@Component({
    selector: 'jhi-operation-context-widget',
    templateUrl: './operation-context-widget.component.html',
    styles: []
})
export class OperationContextWidgetComponent implements OnInit {

    public loading: boolean;

    // Properties
    private _dataOperation: DataOperationMgm;

    constructor() {
    }

    ngOnInit() {
        this.loading = false;
    }

    @Input()
    set dataOperation(dataOperation: DataOperationMgm) {
        this._dataOperation = dataOperation;
    }

    get dataOperation(): DataOperationMgm {
        return this._dataOperation;
    }
}
