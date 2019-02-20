import * as _ from 'lodash';
import {Component, OnInit} from '@angular/core';
import {SelfAssessmentMgm, SelfAssessmentMgmService} from '../../entities/self-assessment-mgm';
import {Result} from '../../results/models/result.model';
import {ResultsService} from '../../results/results.service';
import {HttpResponse} from '@angular/common/http';
import {Couple} from '../../utils/couple.class';

interface MdtaEntity {
    threatAgentID: number;
    threatAgent: string;
    initial: number;
    contextual: number;
    refined: number;
}

enum ValueType {
    'INITIAL',
    'CONTEXTUAL',
    'REFINED'
}

@Component({
    selector: 'jhi-most-dangerous-threat-agents-widget',
    templateUrl: './most-dangerous-threat-agents-widget.component.html',
    styleUrls: ['most-dangerous-threat-agents-widget.component.css']
})
export class MostDangerousThreatAgentsWidgetComponent implements OnInit {
    public readonly THREAT_AGENT_NAME = 'name';
    public readonly INITIAL_LIKELIHOOD = 'initial';
    public readonly CONTEXTUAL_LIKELIHOOD = 'contextual';
    public readonly REFINED_LIKELIHOOD = 'refined';

    // Sorting
    public sortedBy: Map<string, Couple<boolean/*sorted*/, boolean/*ascending*/>>;

    public loading = false;
    public isCollapsed = true;
    public mdtaEntities: MdtaEntity[];
    public threatAgentsPaginator = {
        id: 'threat_agents_paginator',
        itemsPerPage: 7,
        currentPage: 1
    };

    private mySelf: SelfAssessmentMgm;
    private results: Result;

    constructor(
        private resultService: ResultsService,
        private selfAssessmentService: SelfAssessmentMgmService
    ) {
    }

    ngOnInit() {
        this.sortedBy = new Map();
        this.loading = true;
        this.mySelf = this.selfAssessmentService.getSelfAssessment();
        this.resultService.getResult(this.mySelf.id).toPromise().then((res: HttpResponse<Result>) => {
            if (res.body) {
                this.mdtaEntities = [];
                this.results = res.body;
                this.results.initialVulnerability.forEach((item, key) => {
                    const tIndex = _.findIndex(this.mySelf.threatagents, {id: key});
                    this.addInfo(this.mySelf.threatagents[tIndex].id, item, ValueType.INITIAL);
                });
                this.results.contextualVulnerability.forEach((item, key) => {
                    const tIndex = _.findIndex(this.mySelf.threatagents, {id: key});
                    this.addInfo(this.mySelf.threatagents[tIndex].id, item, ValueType.CONTEXTUAL);
                });
                this.results.refinedVulnerability.forEach((item, key) => {
                    const tIndex = _.findIndex(this.mySelf.threatagents, {id: key});
                    this.addInfo(this.mySelf.threatagents[tIndex].id, item, ValueType.REFINED);
                });
                this.mdtaEntities = _.orderBy(this.mdtaEntities, ['initial', 'contextual', 'refined'], ['desc', 'desc', 'desc']);
                this.percentageTransformation();
                this.loading = false;
            } else {
                this.loading = false;
            }
        }).catch(() => {
            this.loading = false;
        });
    }

    private addInfo(tID: number, value: number, typeOfInfo: ValueType) {
        const elemIndex = _.findIndex(this.mdtaEntities, {threatAgentID: tID});
        if (elemIndex === -1) {
            const elem: MdtaEntity = {} as MdtaEntity;
            const tIndex = _.findIndex(this.mySelf.threatagents, {id: tID});
            elem.threatAgentID = this.mySelf.threatagents[tIndex].id;
            elem.threatAgent = this.mySelf.threatagents[tIndex].name;
            switch (typeOfInfo) {
                case ValueType.INITIAL: {
                    elem.initial = value;
                    break;
                }
                case ValueType.CONTEXTUAL: {
                    elem.contextual = value;
                    break;
                }
                case ValueType.REFINED: {
                    elem.refined = value;
                    break;
                }
            }
            this.mdtaEntities.push(_.clone(elem));
        } else {
            switch (typeOfInfo) {
                case ValueType.INITIAL: {
                    this.mdtaEntities[elemIndex].initial = value;
                    break;
                }
                case ValueType.CONTEXTUAL: {
                    this.mdtaEntities[elemIndex].contextual = value;
                    break;
                }
                case ValueType.REFINED: {
                    this.mdtaEntities[elemIndex].refined = value;
                    break;
                }
            }
        }
    }

    private percentageTransformation() {
        for (const elem of this.mdtaEntities) {
            elem.initial = Math.round((elem.initial / 5) * 100);
            elem.contextual = Math.round((elem.contextual / 5) * 100);
            elem.refined = Math.round((elem.refined / 5) * 100);
        }
    }

    onThreatAgentsPageChange(number: number) {
        this.threatAgentsPaginator.currentPage = number;
    }

    public sortTableBy(orderColumn: string, asc: boolean) {

        switch (orderColumn) {
            case this.THREAT_AGENT_NAME: {
                if (asc) {
                    this.mdtaEntities = _.orderBy(this.mdtaEntities, (mdta: MdtaEntity) => mdta.threatAgent, ['asc']);
                } else {
                    this.mdtaEntities = _.orderBy(this.mdtaEntities, (mdta: MdtaEntity) => mdta.threatAgent, ['desc']);
                }

                this.sortedBy.set(this.THREAT_AGENT_NAME, new Couple(true, asc));
                break;
            }
            case this.INITIAL_LIKELIHOOD: {
                if (asc) {
                    this.mdtaEntities = _.orderBy(this.mdtaEntities, (mdta: MdtaEntity) => mdta.initial, ['asc']);
                } else {
                    this.mdtaEntities = _.orderBy(this.mdtaEntities, (mdta: MdtaEntity) => mdta.initial, ['desc']);
                }

                this.sortedBy.set(this.INITIAL_LIKELIHOOD, new Couple(true, asc));
                break;
            }
            case this.CONTEXTUAL_LIKELIHOOD: {
                if (asc) {
                    this.mdtaEntities = _.orderBy(this.mdtaEntities, (mdta: MdtaEntity) => mdta.contextual, ['asc']);
                } else {
                    this.mdtaEntities = _.orderBy(this.mdtaEntities, (mdta: MdtaEntity) => mdta.contextual, ['desc']);
                }

                this.sortedBy.set(this.CONTEXTUAL_LIKELIHOOD, new Couple(true, asc));
                break;
            }
            case this.REFINED_LIKELIHOOD: {
                if (asc) {
                    this.mdtaEntities = _.orderBy(this.mdtaEntities, (mdta: MdtaEntity) => mdta.refined, ['asc']);
                } else {
                    this.mdtaEntities = _.orderBy(this.mdtaEntities, (mdta: MdtaEntity) => mdta.refined, ['desc']);
                }
                this.sortedBy.set(this.REFINED_LIKELIHOOD, new Couple(true, asc));
                break;
            }
        }
    }
}
