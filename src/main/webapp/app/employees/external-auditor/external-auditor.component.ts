import {Component, OnDestroy, OnInit} from '@angular/core';
import {Role} from '../../entities/enumerations/Role.enum';
import {EmployeeService} from "../employee.service";
import {DataSharingService} from "../../data-sharing/data-sharing.service";
import {MyCompanyMgm} from "../../entities/my-company-mgm";
import {Employee} from "../models/Employee";
import {Observable, Subscription} from "rxjs";
import {switchMap} from "rxjs/operators";
import {HttpResponse} from "@angular/common/http";
import {of} from "rxjs/observable/of";

@Component({
    selector: 'jhi-external-auditor',
    templateUrl: './external-auditor.component.html',
    styles: []
})
export class ExternalAuditorComponent implements OnInit, OnDestroy {

    public roleEnum = Role;

    private myCompany: MyCompanyMgm;
    public employees: Employee[];

    private subscriptions: Subscription[] = [];

    constructor(
        private dataSharingService: DataSharingService,
        private employeeService: EmployeeService
    ) {
    }

    ngOnInit() {
        this.subscriptions = [];
        this.employees = [];

        this.myCompany = this.dataSharingService.myCompany;
        this.fetchEmployees();

        const employees$: Observable<HttpResponse<Employee[]>> = this.dataSharingService.myCompany$.pipe(
            switchMap((response: MyCompanyMgm) => {
                this.myCompany = response;

                if (this.myCompany && this.myCompany.companyProfile) {
                    return this.employeeService.findAllByCompanyAndRole(this.myCompany.companyProfile, Role.ROLE_EXTERNAL_AUDIT);
                } else {
                    return of(new HttpResponse({body: []}));
                }
            })
        );

        this.subscriptions.push(employees$.subscribe((response: HttpResponse<Employee[]> | null) => {
            if (response) {
                this.employees = response.body;
            }
        }));
    }

    private fetchEmployees() {
        if (this.myCompany && this.myCompany.companyProfile) {
            this.subscriptions.push(this.employeeService.findAllByCompanyAndRole(this.myCompany.companyProfile, Role.ROLE_EXTERNAL_AUDIT).subscribe(
                (response) => {
                    this.employees = response.body;
                }
            ));
        }
    }

    ngOnDestroy(): void {
        if (this.subscriptions && this.subscriptions.length) {
            this.subscriptions.forEach((value, index) => {
                value.unsubscribe();
            });
        }
    }
}
