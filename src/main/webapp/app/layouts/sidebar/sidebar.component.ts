/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    HostListener,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
    ViewRef
} from '@angular/core';
import {Principal} from '../../shared';
import {DatasharingService} from '../../datasharing/datasharing.service';
import {LayoutConfiguration} from '../model/LayoutConfiguration';

import {MenuItem} from 'primeng/api';
import {Role} from '../../entities/enumerations/Role.enum';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../entities/self-assessment-mgm';
import {LogoMgm, LogoMgmService} from '../../entities/logo-mgm';
import {HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {CompanyBoardStatus} from "../../dashboard/models/CompanyBoardStatus";
import {Status} from "../../entities/enumerations/Status.enum";
import {JhiDateUtils} from 'ng-jhipster';
import * as _ from 'lodash';
import {ImpactMode} from "../../entities/enumerations/ImpactMode.enum";
import {Subscription} from 'rxjs';
import {EventManagerService} from '../../datasharing/event-manager.service';
import {EventType} from '../../entities/enumerations/EventType.enum';
import {Event} from '../../datasharing/event.model';

@Component({
    selector: 'jhi-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['sidebar.css'],
    encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnInit, OnDestroy, AfterViewInit {

    public isCollapsed = true;
    public menuItems: MenuItem[];
    private companyMenuItem: MenuItem;
    private peopleMenuItem: MenuItem;
    private cyberPostureMenuItem: MenuItem;
    private riskManagementMenuItem: MenuItem;
    private taxonomiesMenuItem: MenuItem;
    private aboutUsMenuItem: MenuItem;
    private termsOfUseMenuItem: MenuItem;

    public secondaryLogo: LogoMgm = null;
    private selfAssessments: SelfAssessmentMgm[];
    private selfAssessment: SelfAssessmentMgm;
    public companyBoardStatus: CompanyBoardStatus = null;
    public role: Role = null;

    private subscriptions: Subscription[];

    private riskAssessmentsMap: Map<number, MenuItem>;

    windowWidth: number = window.innerWidth;

    constructor(
        private principal: Principal,
        private dataSharingService: DatasharingService,
        private selfAssessmentService: SelfAssessmentMgmService,
        private logoService: LogoMgmService,
        private router: Router,
        private changeDetector: ChangeDetectorRef,
        private dateUtils: JhiDateUtils,
        private dataSharing: DatasharingService,
        private eventManagerService: EventManagerService,
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
        let updateLayout: LayoutConfiguration = this.dataSharingService.layoutConfiguration;
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
            updateLayout = new LayoutConfiguration();
            updateLayout.isSidebarCollapsed = this.isCollapsed;
        }
    }

    ngOnInit() {
        this.subscriptions = [];
        this.companyBoardStatus = this.dataSharingService.companyBoardStatus;
        this.createMenuItems();
        this.riskAssessmentsMap = new Map();

        this.dataSharingService.companyBoardStatus$.subscribe((status: CompanyBoardStatus) => {
            this.companyBoardStatus = status;
            this.filterByCompanyBoardStatus();
        });

        this.selfAssessment = this.dataSharingService.selfAssessment;
        this.expandSelectedSelfAssessment();

        this.dataSharingService.selfAssessment$.subscribe((assessment) => {
            this.selfAssessment = assessment;
            this.expandSelectedSelfAssessment();
        });

        this.role = this.dataSharingService.role;
        this.filterByRole();

        //Check if CISO inside
        this.fetchSelfAssessments();

        this.dataSharingService.role$.subscribe((roleResponse: Role) => {
            this.role = roleResponse;
            this.filterByRole();

            //Check if CISO inside
            this.fetchSelfAssessments();
        });

        this.principal.getAuthenticationState().subscribe((identity) => {
            if (identity) {
                this.isCollapsed = !this.isAuthenticated();
                layoutConfiguration = new LayoutConfiguration();
                layoutConfiguration.isSidebarCollapsed = this.isCollapsed;

                this.dataSharingService.layoutConfiguration = layoutConfiguration;
                this.fetchSecondaryLogo();

                this.principal.hasAnyAuthority([Role[Role.ROLE_CISO]]).then((response: boolean) => {
                    if (response) {
                        this.createMenuItems();
                    } else {
                        this.principal.hasAnyAuthority([Role[Role.ROLE_EXTERNAL_AUDIT]]).then((response2: boolean) => {
                            if (response2) {
                                layoutConfiguration.isSidebarCollapsed = true;
                                layoutConfiguration.isSidebarCollapsedByMe = false;
                                this.dataSharingService.layoutConfiguration = layoutConfiguration;
                                this.createMenuItems();
                            } else {
                                this.principal.hasAnyAuthority([Role[Role.ROLE_ADMIN]]).then((response3: boolean) => {
                                    if (response3) {
                                        layoutConfiguration.isSidebarCollapsed = true;
                                        layoutConfiguration.isSidebarCollapsedByMe = false;
                                        this.dataSharingService.layoutConfiguration = layoutConfiguration;
                                        this.router.navigate(['/jhi-metrics']);
                                    }
                                });
                            }
                        });
                    }
                });
            } else {

            }
        });
        this.isCollapsed = this.dataSharingService.layoutConfiguration != null ? this.dataSharingService.layoutConfiguration.isSidebarCollapsed : true;

        let layoutConfiguration: LayoutConfiguration = this.dataSharingService.layoutConfiguration;
        if (layoutConfiguration) {
            this.isCollapsed = layoutConfiguration.isSidebarCollapsed;
        }

        this.dataSharingService.layoutConfiguration$.subscribe((update: LayoutConfiguration) => {
            if (update) {
                this.isCollapsed = update.isSidebarCollapsed;
            }
        });

        this.subscriptions.push(
            this.eventManagerService.observe(EventType.RISK_ASSESSMENT_LIST_UPDATE).subscribe((event: Event) => {
                this.fetchSelfAssessments();
            })
        )
    }

    private expandSelectedSelfAssessment() {
        if (this.selfAssessment) {
            this.riskAssessmentsMap.forEach((item: MenuItem, key: number) => {
                if (key !== this.selfAssessment.id) {
                    item.expanded = false;
                } else {
                    item.expanded = true;
                }
            });
        }
    }

    private fetchSecondaryLogo() {
        this.logoService.getSecondaryLogo().toPromise().then((logo: HttpResponse<LogoMgm>) => {
            this.secondaryLogo = logo.body;
            if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                this.changeDetector.detectChanges();
            }
        }).catch((reason) => {
            //Do Nothing
        });
    }

    ngAfterViewInit() {
        this.windowWidth = window.innerWidth;
    }

    private createMenuItems() {
        this.companyMenuItem = {
            label: 'Company',
            icon: 'fas fa-building',
            items: [
                {
                    label: 'Reports',
                    icon: 'fas fa-file-download',
                    routerLink: ['/pages/coming-soon']
                }
            ]
        };

        this.peopleMenuItem = {
            label: 'People',
            icon: 'fas fa-address-book',
            items: [
                {
                    label: 'CISO Deputy',
                    icon: 'fas fa-user-tie',
                    routerLink: ['/people/ciso']
                },
                {
                    label: 'External Auditor',
                    icon: 'fas fa-address-card',
                    routerLink: ['/people/external']
                },
                {
                    label: 'Financial Deputy',
                    icon: 'fas fa-glasses',
                    routerLink: ['/people/financial']
                }
            ]
        };

        this.cyberPostureMenuItem = {
            label: 'Cyber Posture',
            icon: 'fas fa-shield-alt',
            visible: this.role === Role.ROLE_CISO,
            items: [
                {
                    label: "Threat Agents",
                    icon: "fas fa-user-secret",
                    routerLink: ['/identify-threat-agent/questionnaires/ID_THREAT_AGENT']
                },
                {
                    label: "Vulnerabilities",
                    icon: "fa fa-bomb",
                    routerLink: ['/evaluate-weakness/questionnaires/SELFASSESSMENT']
                }
            ]
        };

        this.riskManagementMenuItem = {
            label: 'Risk Management',
            icon: 'fa fa-bolt',
            visible: this.role === Role.ROLE_CISO
                && this.companyBoardStatus
                && this.companyBoardStatus.identifyThreatAgentsStatus === Status.FULL
                && this.companyBoardStatus.assessVulnerablitiesStatus === Status.FULL,
            items: []
        };

        this.taxonomiesMenuItem = {
            label: 'Taxonomies',
            icon: 'fas fa-atom',
            items: [
                {
                    label: 'Assets',
                    items: [
                        {
                            label: 'Add',
                            icon: 'fa fa-plus',
                            routerLink: ['/pages/coming-soon']
                        },
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
                            label: 'Add',
                            icon: 'fa fa-plus',
                            routerLink: ['/pages/coming-soon']
                        },
                        {
                            label: 'View',
                            icon: 'far fa-eye',
                            routerLink: ['/threat-agent-mgm']
                        },
                        {
                            label: 'Update',
                            icon: 'fas fa-pen-fancy',
                            routerLink: ['/pages/coming-soon']
                        },
                    ]
                },
                {
                    label: 'Attack Strategies',
                    items: [
                        {
                            label: 'Add',
                            icon: 'fa fa-plus',
                            routerLink: ['/pages/coming-soon']
                        },
                        {
                            label: 'View',
                            icon: 'far fa-eye',
                            routerLink: ['/attack-strategy-mgm']
                        },
                        {
                            label: 'Update',
                            icon: 'fas fa-pen-fancy',
                            routerLink: ['/pages/coming-soon']
                        }
                    ]
                },
                {
                    label: 'Mitigations',
                    items: [
                        {
                            label: 'Add',
                            icon: 'fa fa-plus',
                            routerLink: ['/pages/coming-soon']
                        },
                        {
                            label: 'View',
                            icon: 'far fa-eye',
                            routerLink: ['/mitigation-mgm']
                        },
                        {
                            label: 'Update',
                            icon: 'fas fa-pen-fancy',
                            routerLink: ['/mitigation-mgm']
                        }
                    ]
                }
            ]
        };

        this.aboutUsMenuItem = {
            label: 'About-Us',
            icon: 'fa fa-info',
            routerLink: ['/about-us']
        };

        this.termsOfUseMenuItem = {
            label: 'Terms of Use',
            icon: 'fas fa-file-signature',
            routerLink: ['/terms']
        };

        // @ts-ignore
        this.companyMenuItem.items.push(this.peopleMenuItem);

        this.menuItems = [
            this.companyMenuItem,
            this.cyberPostureMenuItem,
            this.riskManagementMenuItem,
            this.taxonomiesMenuItem,
            this.aboutUsMenuItem,
            this.termsOfUseMenuItem
        ];

        if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
            this.changeDetector.detectChanges();
        }
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    toggleSideBar() {
        let layoutConfiguration: LayoutConfiguration = this.dataSharingService.layoutConfiguration;

        if (layoutConfiguration) {
            layoutConfiguration.isSidebarCollapsed = !layoutConfiguration.isSidebarCollapsed;
        } else {
            layoutConfiguration = new LayoutConfiguration();
            layoutConfiguration.isSidebarCollapsed = !this.principal.isAuthenticated();
        }

        this.dataSharingService.layoutConfiguration = layoutConfiguration;
    }

    private showSelfAssessments() {
        if (this.selfAssessments) {
            if (this.riskManagementMenuItem) {
                this.riskManagementMenuItem.items = [];

                const servicesMenuItem: MenuItem = {
                    label: 'Services',
                    routerLink: ['/my-risk-assessments']
                };

                // @ts-ignore
                this.riskManagementMenuItem.items.push(servicesMenuItem);

                // Sort SelfAssessments by creation date
                const self = this;

                this.selfAssessments = _.sortBy(this.selfAssessments, function (assessment: SelfAssessmentMgm) {
                    return self.dateUtils.convertDateTimeFromServer(assessment.created);
                });

                this.selfAssessments.forEach((assessment) => {
                    if (assessment) {
                        const assessmentItem: MenuItem = {
                            label: assessment.name,
                            command: event => {
                                if (this.selfAssessment) {
                                    if (this.selfAssessment.id !== assessment.id) {
                                        this.dataSharingService.selfAssessment = assessment;
                                    }
                                } else {
                                    this.dataSharingService.selfAssessment = assessment;
                                }

                                if (this.router.url !== '/riskboard') {
                                    this.router.navigate(['/riskboard']);
                                }
                            },
                            items: [
                                {
                                    label: 'Assets',
                                    items: [
                                        {
                                            label: 'Asset Clustering',
                                            routerLink: ['/identify-asset/asset-clustering']
                                        },
                                        {
                                            label: 'Cascade Effects',
                                            routerLink: ['/identify-asset/cascade-effects']
                                        },
                                        {
                                            label: 'Related Costs',
                                            routerLink: ['/identify-asset/attack-costs']
                                        }
                                    ]
                                },
                                {
                                    label: 'Impact Analysis',
                                    routerLink: ['/impact-evaluation'],
                                    items: [
                                        {
                                            label: 'Quantitative',
                                            items: [
                                                {
                                                    label: 'Impact Evaluation',
                                                    command: event => {
                                                        // Update the Impact Mode of the Assessment
                                                        this.updateAssessmentImpactMode(assessment, ImpactMode.QUANTITATIVE);
                                                    },
                                                    routerLink: ['/impact-evaluation/quantitative']
                                                },
                                                {
                                                    label: 'Estimation of the Data Assets category Losses',
                                                    command: event => {
                                                        // Update the Impact Mode of the Assessment
                                                        this.updateAssessmentImpactMode(assessment, ImpactMode.QUANTITATIVE);
                                                    },
                                                    routerLink: ['/impact-evaluation/quantitative/data-assets-losses-estimation']
                                                },
                                                {
                                                    label: 'Estimation of the Attack Related Costs',
                                                    command: event => {
                                                        // Update the Impact Mode of the Assessment
                                                        this.updateAssessmentImpactMode(assessment, ImpactMode.QUANTITATIVE);
                                                    },
                                                    routerLink: ['/impact-evaluation/quantitative/attack-related-costs-estimation']
                                                }
                                            ]
                                        },
                                        {
                                            label: 'Qualitative',
                                            items: [
                                                {
                                                    label: 'Impacts on Assets',
                                                    command: event => {
                                                        // Update the Impact Mode of the Assessment
                                                        this.updateAssessmentImpactMode(assessment, ImpactMode.QUALITATIVE);
                                                    },
                                                    routerLink: ['/impact-evaluation/qualitative/']
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    label: 'Risk Analysis',
                                    routerLink: ['/risk-management/risk-evaluation'],
                                    items: [
                                        {
                                            label: 'Risk Matrix',
                                            routerLink: ['/risk-management/risk-evaluation']
                                        },
                                        {
                                            label: 'Assets at Risk',
                                            routerLink: ['/risk-management/risk-evaluation']
                                        },
                                        {
                                            label: 'Mitigations',
                                            items: [
                                                {
                                                    label: 'Cost Benefit Analysis',
                                                    routerLink: ['/pages/coming-soon']
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        };

                        this.riskAssessmentsMap.set(assessment.id, assessmentItem);

                        // @ts-ignore
                        this.riskManagementMenuItem.items.push(assessmentItem);
                    }
                });

                if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                    this.changeDetector.detectChanges();
                }
            }
        }
    }

    private updateAssessmentImpactMode(assessment: SelfAssessmentMgm, impactMode: ImpactMode) {
        if (assessment.impactMode !== impactMode) {
            assessment.impactMode = impactMode;

            this.selfAssessmentService.update(assessment).toPromise().then((response: HttpResponse<SelfAssessmentMgm>) => {
                this.selfAssessment = response.body;
                this.dataSharing.selfAssessment = this.selfAssessment;
            });
        }
    }

    private filterByCompanyBoardStatus() {
        if (this.riskManagementMenuItem) {
            this.riskManagementMenuItem.visible = this.role === Role.ROLE_CISO
                && this.companyBoardStatus
                && this.companyBoardStatus.identifyThreatAgentsStatus === Status.FULL
                && this.companyBoardStatus.assessVulnerablitiesStatus === Status.FULL;

            if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                this.changeDetector.detectChanges();
            }
        }
    }

    private filterByRole() {
        if (this.role) {
            if (this.cyberPostureMenuItem) {
                this.cyberPostureMenuItem.visible = this.role === Role.ROLE_CISO;

                if (this.changeDetector && !(this.changeDetector as ViewRef).destroyed) {
                    this.changeDetector.detectChanges();
                }
            }
        }
    }

    private fetchSelfAssessments() {
        switch (this.role) {
            case Role.ROLE_CISO: {
                this.selfAssessmentService.getMySelfAssessments().subscribe(
                    (response: SelfAssessmentMgm[]) => {
                        this.selfAssessments = response;
                        this.showSelfAssessments();
                    }
                );

                break;
            }
            default: {
                break;
            }
        }
    }

    ngOnDestroy(): void {
        this.changeDetector.detach();

        if(this.subscriptions && this.subscriptions.length){
            this.subscriptions.forEach((subscription: Subscription) => {
               subscription.unsubscribe();
            });
        }
    }
}
