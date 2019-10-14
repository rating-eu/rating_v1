import {Component, OnDestroy, OnInit} from '@angular/core';
import {Role} from "../../entities/enumerations/Role.enum";
import {MyCompanyMgm} from "../../entities/my-company-mgm";
import {Employee} from "../models/Employee";
import {Observable, Subscription} from "rxjs";
import {DataSharingService} from "../../data-sharing/data-sharing.service";
import {EmployeeService} from "../employee.service";
import {switchMap} from "rxjs/operators";
import {HttpResponse} from "@angular/common/http";
import {of} from "rxjs/observable/of";

@Component({
    selector: 'jhi-financial-deputy',
    templateUrl: './financial-deputy.component.html',
    styles: []
})
export class FinancialDeputyComponent implements OnInit, OnDestroy {
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
        this.myCompany = this.dataSharingService.myCompany;
        this.fetchEmployees();

        const employees$: Observable<HttpResponse<Employee[]>> = this.dataSharingService.myCompany$.pipe(
            switchMap((response: MyCompanyMgm) => {
                this.myCompany = response;

                if (this.myCompany && this.myCompany.companyProfile) {
                    return this.employeeService.findAllByCompanyAndRole(this.myCompany.companyProfile, Role.ROLE_FINANCIAL_DEPUTY);
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
            this.subscriptions.push(this.employeeService.findAllByCompanyAndRole(this.myCompany.companyProfile, Role.ROLE_FINANCIAL_DEPUTY).subscribe(
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
