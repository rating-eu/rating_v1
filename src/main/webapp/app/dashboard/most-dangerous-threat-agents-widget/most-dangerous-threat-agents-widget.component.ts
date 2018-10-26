import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { Result } from '../../results/models/result.model';
import { ResultsService } from '../../results/results.service';
import { HttpResponse } from '@angular/common/http';

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
  public loading = false;
  public isCollapsed = false;
  public mdtaEntities: MdtaEntity[];
  public threatAgentsPaginator = {
    id: 'threat_agents_paginator',
    itemsPerPage: 8,
    currentPage: 1
  };

  private mySelf: SelfAssessmentMgm;
  private results: Result;

  constructor(
    private resultService: ResultsService,
    private selfAssessmentService: SelfAssessmentMgmService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.mySelf = this.selfAssessmentService.getSelfAssessment();
    this.resultService.getResult(this.mySelf.id).toPromise().then((res: HttpResponse<Result>) => {
      if (res.body) {
        this.mdtaEntities = [];
        this.results = res.body;
        this.results.initialVulnerability.forEach((item, key) => {
          const tIndex = _.findIndex(this.mySelf.threatagents, { id: key });
          this.addInfo(this.mySelf.threatagents[tIndex].id, item, ValueType.INITIAL);
        });
        this.results.contextualVulnerability.forEach((item, key) => {
          const tIndex = _.findIndex(this.mySelf.threatagents, { id: key });
          this.addInfo(this.mySelf.threatagents[tIndex].id, item, ValueType.CONTEXTUAL);
        });
        this.results.refinedVulnerability.forEach((item, key) => {
          const tIndex = _.findIndex(this.mySelf.threatagents, { id: key });
          this.addInfo(this.mySelf.threatagents[tIndex].id, item, ValueType.REFINED);
        });
        this.mdtaEntities = _.orderBy(this.mdtaEntities, ['initial', 'contextual', 'refined'], ['desc', 'desc', 'desc']);
        this.loading = false;
      } else {
        this.loading = false;
      }
    }).catch(() => {
      this.loading = false;
    });
  }

  private addInfo(tID: number, value: number, typeOfInfo: ValueType) {
    const elemIndex = _.findIndex(this.mdtaEntities, { threatAgentID: tID });
    if (elemIndex === -1) {
      const elem: MdtaEntity = {} as MdtaEntity;
      const tIndex = _.findIndex(this.mySelf.threatagents, { id: tID });
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

  onThreatAgentsPageChange(number: number) {
    this.threatAgentsPaginator.currentPage = number;
  }
}
