import {Component, OnInit} from '@angular/core';
import {Employee} from '../models/Employee';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {MyCompanyMgm} from '../../entities/my-company-mgm';
import {ActivatedRoute, Router} from '@angular/router';
import {EmployeeService} from '../employee.service';
import {Role} from "../../entities/enumerations/Role.enum";
import {QuestionnairePurpose} from "../../entities/enumerations/QuestionnairePurpose.enum";

@Component({
    selector: 'jhi-employee',
    templateUrl: './employee.component.html',
    styles: []
})
export class EmployeeComponent implements OnInit {

    private subscriptions;

    public employee: Employee;
    public isSaving: Boolean;

    private myCompany: MyCompanyMgm;
    private role: Role;
    private employeeID: number;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dataSHaringService: DatasharingService,
        private employeeService: EmployeeService
    ) {

    }

    ngOnInit() {
        this.subscriptions = [];

        this.employee = new Employee();

        this.isSaving = false;

        this.myCompany = this.dataSHaringService.myCompany;
        this.assignCompany();

        this.dataSHaringService.myCompanyObservable.subscribe((company) => {
            this.myCompany = company;
            this.assignCompany();
        });

        this.subscriptions.push(
            this.route.params.subscribe((params) => {
                if (params['id']) {//For editing
                    try {
                        this.employeeID = Number(params['id']);
                    } catch (err) {
                        console.warn('Unable to parse Employee ID.');
                    }
                }

                if (params['role']) {
                    switch (params['role']) {
                        case Role[Role.ROLE_EXTERNAL_AUDIT]: {
                            this.role = Role.ROLE_EXTERNAL_AUDIT;
                            break;
                        }
                        case Role[Role.ROLE_CISO_DEPUTY]: {
                            this.role = Role.ROLE_CISO_DEPUTY;
                            break;
                        }
                        case Role[Role.ROLE_FINANCIAL_DEPUTY]: {
                            this.role = Role.ROLE_FINANCIAL_DEPUTY;
                            break;
                        }
                    }
                }
            })
        );
    }

    private assignCompany() {
        if (this.myCompany && this.myCompany.companyProfile) {
            this.employee.companyProfile = this.myCompany.companyProfile;
        }
    }

    public save() {
        if (!this.employee.id) {
            this.employeeService.create(this.employee)
                .toPromise()
                .then((response) => {
                    this.employee = response.body;

                    switch (this.role) {
                        case Role.ROLE_EXTERNAL_AUDIT: {
                            this.router.navigate(['/employees/external']);
                            break;
                        }
                        case Role.ROLE_CISO_DEPUTY: {
                            this.router.navigate(['/employees/ciso']);
                            break;
                        }
                        case Role.ROLE_FINANCIAL_DEPUTY: {
                            this.router.navigate(['/employees/financial']);
                            break;
                        }
                        default: {
                            this.router.navigate(['/dashboard']);
                            break;
                        }
                    }
                });
        }
    }

    public cancel() {
        switch (this.role) {
            case Role.ROLE_EXTERNAL_AUDIT: {
                this.router.navigate(['/employees/external']);
                break;
            }
            case Role.ROLE_CISO_DEPUTY: {
                this.router.navigate(['/employees/ciso']);
                break;
            }
            case Role.ROLE_FINANCIAL_DEPUTY: {
                this.router.navigate(['/employees/financial']);
                break;
            }
            default: {
                this.router.navigate(['/dashboard']);
                break;
            }
        }
    }
}
