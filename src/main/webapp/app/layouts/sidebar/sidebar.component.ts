import { Component, OnInit, ViewEncapsulation, AfterViewInit, HostListener } from '@angular/core';
import { Principal } from '../../shared';
import { DatasharingService } from '../../datasharing/datasharing.service';
import { Update } from '../model/Update';

import { MenuItem } from 'primeng/api';
import { MyRole } from '../../entities/enumerations/MyRole.enum';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';

@Component({
    selector: 'jhi-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['sidebar.css'],
    encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit, AfterViewInit {

    isCollapsed = true;
    private isCollapsedByMe = false;
    private items: MenuItem[];
    private isCISO = false;
    private isExternal = false;
    private mySelf: SelfAssessmentMgm;

    windowWidth: number = window.innerWidth;

    constructor(
        private principal: Principal,
        private dataSharingService: DatasharingService,
        private selfAssessmentService: SelfAssessmentMgmService
    ) {
        this.isCollapsed = true;
        this.isSidebarCollapseByTheScreen();
    }

    @HostListener('window:resize', ['$event'])
    resize(event) {
        this.windowWidth = window.innerWidth;
        this.isSidebarCollapseByTheScreen();
    }

    private isSidebarCollapseByTheScreen() {
        let updateLayout: Update = this.dataSharingService.getUpdate();
        if (updateLayout && updateLayout.isSidebarCollapsedByMe) {
            return;
        }
        if (this.windowWidth < 800) {
            this.isCollapsed = true;
        } else {
            this.isCollapsed = false;
        }
        if (updateLayout) {
            updateLayout.isSidebarCollapsed = this.isCollapsed;
        } else {
            updateLayout = new Update();
            updateLayout.isSidebarCollapsed = this.isCollapsed;
        }
    }

    ngOnInit() {
        this.principal.getAuthenticationState().subscribe((identity) => {
            if (identity) {
                this.isCollapsed = !this.isAuthenticated();
                // console.log('Sidebar isAuthenticated: ' + this.isAuthenticated());

                updateLayout = new Update();
                updateLayout.isSidebarCollapsed = this.isCollapsed;

                this.dataSharingService.updateLayout(updateLayout);

                this.principal.hasAnyAuthority([MyRole[MyRole.ROLE_CISO]]).then((response: boolean) => {
                    // console.log('IsCISO response: ' + response);

                    if (response) {
                        this.isCISO = response;
                        this.isExternal = !this.isCISO;
                        this.createMenuItems(this.isCISO);
                    } else {
                        this.principal.hasAnyAuthority([MyRole[MyRole.ROLE_EXTERNAL_AUDIT]]).then((response2: boolean) => {
                            // console.log('IsExternal response: ' + response2);
                            this.isExternal = response2;
                            this.isCISO = !this.isExternal;
                            this.createMenuItems(this.isCISO, this.isExternal);
                        });
                    }
                });
            } else {

            }
        });

        // console.log('HadAnyAuthority direct CISO: ' + this.principal.hasAnyAuthorityDirect([MyRole[MyRole.ROLE_CISO]]));
        // console.log('Role CISO: ' + MyRole[MyRole.ROLE_CISO]);
        // this.createMenuItems();

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

        this.dataSharingService.observeMySelf().subscribe((mySelf) => {
            if (mySelf) {
                this.createMenuItems(this.isCISO, this.isExternal);
            }
        });
        /*
        setTimeout(() => {
            console.log('Menu Items created after timeout:');
            console.log(JSON.stringify(this.items));
        }, 100 * 1000);
        */
    }

    ngAfterViewInit() {
        this.windowWidth = window.innerWidth;
    }

    private createMenuItems(isCISO = false, isExternal = false) {
        this.mySelf = this.selfAssessmentService.getSelfAssessment();
        let visibleByMySelf = false;
        if (this.mySelf) {
            visibleByMySelf = true;
        }
        this.items = [
            {
                label: 'About-Us', icon: 'fa fa-info', routerLink: ['/about-us']
            },
            {
                label: 'Company',
                items: [
                    { label: 'My Company', icon: 'fa fa-home', routerLink: ['/my-company'] },
                    { label: 'My SelfAssessments', icon: 'fa fa-repeat', routerLink: ['/my-self-assessments'] }
                ]
            },
            {
                label: 'Self Assessment',
                visible: visibleByMySelf,
                items: [
                    {
                        label: 'Assets',
                        // routerLink: ['/identify-asset'],
                        items: [
                            {
                                label: 'Asset Clustering',
                                routerLink: ['/identify-asset/asset-clustering']
                            },
                            {
                                label: 'Magnitudo',
                                routerLink: ['/identify-asset/magnitude']
                            },
                            {
                                label: 'Cascade Effects',
                                routerLink: ['/identify-asset/cascade-effects']
                            },
                            {
                                label: 'Attack Costs',
                                routerLink: ['/identify-asset/attack-costs']
                            },
                            {
                                label: 'Asset Report',
                                routerLink: ['/identify-asset/asset-report']
                            },
                        ]
                    },
                    {
                        label: 'Vulnerability Assessment',
                        items: [
                            {
                                label: 'Threat Agents',
                                items: [
                                    {
                                        label: 'Identify',
                                        routerLink: ['/identify-threat-agent/questionnaires/ID_THREAT_AGENT'],
                                        visible: isCISO
                                    },
                                    {
                                        label: 'Results',
                                        routerLink: ['/identify-threat-agent/result']
                                    }
                                ]
                            },
                            {
                                label: 'Attack Strategies',
                                items: [
                                    {
                                        label: 'Assess Vulnerabilities',
                                        routerLink: ['/evaluate-weakness/questionnaires/SELFASSESSMENT']
                                    },
                                    {
                                        label: 'Likelihood Results',
                                        routerLink: ['/evaluate-weakness/result']
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
                                label: 'Impact Evaluation',
                                routerLink: ['/impact-evaluation']
                            }
                        ]
                    },
                    {
                        label: 'Risk Management',
                        routerLink: ['/risk-management'],
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
        /*
        console.log('Menu Items created');
        console.log(JSON.stringify(this.items));
        */
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
