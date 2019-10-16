import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewRef} from '@angular/core';
import {DataOperationMgm} from '../../entities/data-operation-mgm';
import {DataSharingService} from '../../data-sharing/data-sharing.service';
import {MyCompanyMgm} from '../../entities/my-company-mgm';
import {Subscription} from 'rxjs';
import {DataOperationsService} from './data-operations.service';
import {HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {EventManagerService} from '../../data-sharing/event-manager.service';
import {EventType} from '../../entities/enumerations/EventType.enum';
import {Event} from '../../data-sharing/event.model';
import {ActionType} from "../../entities/enumerations/ActionType.enum";

@Component({
    selector: 'jhi-data-operations',
    templateUrl: './data-operations.component.html',
    styles: []
})
export class DataOperationsComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[];

    public myCompany: MyCompanyMgm;
    public dataOperations: DataOperationMgm[];

    constructor(private dataSharingService: DataSharingService,
                private eventManagerService: EventManagerService,
                private dataOperationsService: DataOperationsService,
                private changeDetector: ChangeDetectorRef,
                private router: Router) {
    }

    ngOnInit() {
        this.subscriptions = [];

        this.myCompany = this.dataSharingService.myCompany;
        this.fetchDataOperations();

        this.subscriptions.push(
            this.dataSharingService.myCompany$.subscribe(
                (response: MyCompanyMgm) => {
                    this.myCompany = response;

                    this.fetchDataOperations();
                }
            )
        );

        this.subscriptions.push(this.eventManagerService.observe(EventType.DATA_OPERATION_LIST_UPDATE).subscribe((event: Event) => {
            if (event && event.action === ActionType.DELETE) {
                // Clear the selected DataOperation just in case it has been deleted.
                this.dataSharingService.dataOperation = null;
                this.fetchDataOperations();
            }
        }));
    }

    private fetchDataOperations() {
        if (this.myCompany && this.myCompany.companyProfile) {

            this.dataOperationsService
                .getOperationsByCompanyProfile(this.myCompany.companyProfile.id)
                .toPromise()
                .then(
                    (response: HttpResponse<DataOperationMgm[]>) => {
                        this.dataOperations = response.body;

                        if(this.changeDetector && !(this.changeDetector as ViewRef).destroyed){
                            this.changeDetector.detectChanges();
                        }
                    }
                );
        }
    }

    public selectDataOperation(dataOperation: DataOperationMgm) {
        console.log('DataOperation: ' + dataOperation.name);

        this.dataSharingService.dataOperation = dataOperation;
    }

    trackId(index: number, item: DataOperationMgm) {
        return item.id;
    }

    ngOnDestroy(): void {
        this.changeDetector.detach();

        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((subscription: Subscription) => {
                subscription.unsubscribe();
            });
        }
    }

    createNewDataOperation() {
        const dataOperation = new DataOperationMgm();
        dataOperation.companyProfile = this.myCompany.companyProfile;

        this.dataSharingService.dataOperation = dataOperation;

        this.router.navigate(['/privacy-board']);
    }
}
