import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Principal} from '../../shared';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {Update} from '../model/Update';

import {MenuItem} from 'primeng/api';

@Component({
    selector: 'jhi-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['sidebar.css'],
    encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit {

    isCollapsed = true;
    private items: MenuItem[];

    constructor(
        private principal: Principal,
        private dataSharingService: DatasharingService
    ) {
        this.isCollapsed = true;
        console.log('DataSharing: ' + JSON.stringify(dataSharingService));
    }

    ngOnInit() {
        this.items = [
            {
                label: 'Company name',
                items: [
                    {label: 'My Company', icon: 'fa fa-home', routerLink: ['my-company']},
                    /*{label: 'Utenti censiti', icon: 'fa fa-refresh'},*/
                    {label: 'My SelfAssessments', icon: 'fa fa-repeat', routerLink: ['my-self-assessments']}
                ]
            },
            {
                label: 'Self Assessment',
                items: [
                    {
                        label: 'Likelihood and Vulnerabilities', icon: 'fa fa-plus',
                        items: [
                            {
                                label: 'Assets', icon: '', title: 'What do I own?',
                                items: [
                                    {
                                        label: 'View all available assets',
                                        icon: '',
                                        routerLink: ['identify-asset']
                                    },
                                    {label: 'Identify Assets', icon: '', routerLink: ['identify-asset']}
                                ]
                            },
                            {
                                label: 'Threat Agents', icon: '', title: 'who would attack my company? and why?',
                                items: [
                                    {label: 'View all available Threat Agents', icon: ''},
                                    {
                                        label: 'Identify Threat Agents',
                                        icon: '',
                                        routerLink: ['identify-threat-agent']
                                    }
                                ]
                            },
                            {
                                label: 'Attack Plans', icon: '', title: 'how my company may be attacked?',
                                items: [
                                    {label: 'View All Attack Strategies', icon: ''},
                                    {label: 'View Countermeasures', icon: ''},
                                    {label: 'Evaluate weakness', icon: '', routerLink: ['evaluate-weakness']}
                                ]
                            },
                            {
                                label: 'Results', icon: '', title: 'which are the weakness of my company?', routerLink: ['results'],
                            }
                        ]
                    },
                    {label: 'Impact Evaluation', icon: '', routerLink: ['impact-evaluation']},
                    {
                        label: 'Risk Management', icon: '',
                        items: [
                            {
                                label: 'Risk evaluation',
                                icon: '',
                                routerLink: ['risk-management/risk-evaluation']
                            },
                            {
                                label: 'Risk Mitigation',
                                icon: '',
                                routerLink: ['risk-management/risk-mitigation']
                            },
                        ]
                    }
                ]
            }];

        this.isCollapsed = this.dataSharingService.getUpdate() != null ? this.dataSharingService.getUpdate().isSidebarCollapsed : true;

        let updateLayout: Update = this.dataSharingService.getUpdate();
        if (updateLayout) {
            this.isCollapsed = updateLayout.isSidebarCollapsed;
        }

        this.dataSharingService.observeUpdate().subscribe((update: Update) => {
            if (update) {
                this.isCollapsed = update.isSidebarCollapsed;
            }
        });

        this.principal.getAuthenticationState().subscribe((identity) => {
            if (identity) {
                this.isCollapsed = !this.isAuthenticated();
                console.log('SIdebar isAuthenticated: ' + this.isAuthenticated());

                updateLayout = new Update();
                updateLayout.isSidebarCollapsed = this.isCollapsed;

                this.dataSharingService.updateLayout(updateLayout);
            } else {

            }
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    toggleSideBar() {
        let update: Update = this.dataSharingService.getUpdate();

        if (update) {
            update.isSidebarCollapsed = !update.isSidebarCollapsed;
        } else {
            update = new Update();
            update.isSidebarCollapsed = !this.principal.isAuthenticated();
        }

        this.dataSharingService.updateLayout(update);
    }
}
