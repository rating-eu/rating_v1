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
                label: 'About-Us', icon: 'fa fa-info', routerLink: ['/about-us']
            },
            {
                label: 'Company',
                items: [
                    {label: 'My Company', icon: 'fa fa-home', routerLink: ['/my-company']},
                    {label: 'My SelfAssessments', icon: 'fa fa-repeat', routerLink: ['/my-self-assessments']}
                ]
            },
            {
                label: 'Self Assessment',
                items: [
                    {
                        label: 'My Profile',
                        items: [
                            {
                                label: 'Assets',
                                items: [
                                    {
                                        label: 'Clusters',
                                        routerLink: ['/identify-asset']
                                    },
                                    {
                                        label: 'Reports',
                                        routerLink: ['/identify-asset']
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        label: 'Vulnerabilities',
                        items: [
                            {
                                label: 'Threat Agents',
                                items: [
                                    {
                                        label: 'Identify',
                                        routerLink: ['/identify-threat-agent/questionnaires/ID_THREAT_AGENT']
                                    },
                                    {
                                        label: 'Matrix',
                                        routerLink: ['/identify-threat-agent/result']
                                    }
                                ]
                            },
                            {
                                label: 'Attack Strategies',
                                items: [
                                    {
                                        label: 'Likelihood Matrix',
                                        routerLink: ['/evaluate-weakness/result']
                                    },
                                    {
                                        label: 'Asses Vulnerabilities',
                                        routerLink: ['/evaluate-weakness/questionnaires/SELFASSESSMENT']
                                    }
                                ]
                            },
                            {
                                label: 'Results',
                                routerLink: ['/results']
                            }
                        ]
                    },
                    {
                        label: 'Consequences',
                        items: [
                            {
                                label: 'Loss due to a cyber Attack',
                                routerLink: ['/impact-evaluation']
                            }
                        ]
                    },
                    {
                        label: 'Risk Management',
                        items: [
                            {
                                label: 'Risk Scenarios',
                                routerLink: ['/risk-management/risk-evaluation']
                            },
                            {
                                label: 'Risk Mitigations',
                                routerLink: ['/risk-management/risk-mitigation']
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Taxonomies',
                items: [
                    {
                        label: 'Assets',
                        items: [
                            {
                                label: 'Tangible',
                                routerLink: ['/asset-mgm']
                            },
                            {
                                label: 'Intangible',
                                routerLink: ['/asset-mgm']
                            }
                        ]
                    },
                    {
                        label: 'Threat Agents',
                        items: [
                            {
                                label: 'View',
                                routerLink: ['/threat-agent-mgm']
                            },
                            {
                                label: 'Update',
                                routerLink: ['/threat-agent-mgm']
                            },
                        ]
                    },
                    {
                        label: 'Attack Strategies',
                        items: [
                            {
                                label: 'View',
                                routerLink: ['/attack-strategy-mgm']
                            },
                            {
                                label: 'Update',
                                routerLink: ['/attack-strategy-mgm']
                            }
                        ]
                    },
                    {
                        label: 'Mitigations',
                        items: [
                            {
                                label: 'View',
                                routerLink: ['/mitigation-mgm']
                            },
                            {
                                label: 'Update',
                                routerLink: ['/mitigation-mgm']
                            }
                        ]
                    }
                ]
            }
        ];

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
