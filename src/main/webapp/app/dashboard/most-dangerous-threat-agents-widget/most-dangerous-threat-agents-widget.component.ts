import * as _ from 'lodash';
import { Component, OnInit } from '@angular/core';
import { SelfAssessmentMgm, SelfAssessmentMgmService } from '../../entities/self-assessment-mgm';
import { Result } from '../../results/models/result.model';
import { ResultsService } from '../../results/results.service';
import { HttpResponse } from '@angular/common/http';

interface OrderBy {
  threatAgent: boolean;
  initial: boolean;
  contextual: boolean;
  refined: boolean;
  type: string;
}

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
  public isCollapsed = true;
  public mdtaEntities: MdtaEntity[];
  public orderBy: OrderBy;
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
  ) { }

  ngOnInit() {
    this.loading = true;
    this.mySelf = this.selfAssessmentService.getSelfAssessment();
    this.orderBy = {
      threatAgent: false,
      initial: false,
      contextual: false,
      refined: false,
      type: 'desc'
    };
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

  private resetOrder() {
    this.orderBy.threatAgent = false;
    this.orderBy.initial = false;
    this.orderBy.contextual = false;
    this.orderBy.refined = false;
    this.orderBy.type = 'desc';
  }

  public tableOrderBy(orderColumn: string, desc: boolean) {
    this.resetOrder();
    if (desc) {
      this.orderBy.type = 'desc';
    } else {
      this.orderBy.type = 'asc';
    }
    switch (orderColumn.toLowerCase()) {
      case ('threat_agent'): {
        this.orderBy.threatAgent = true;
        if (desc) {
          this.mdtaEntities = _.orderBy(this.mdtaEntities, ['threatAgent'], ['desc']);
        } else {
          this.mdtaEntities = _.orderBy(this.mdtaEntities, ['threatAgent'], ['asc']);
        }
        break;
      }
      case ('initial'): {
        this.orderBy.initial = true;
        if (desc) {
          this.mdtaEntities = _.orderBy(this.mdtaEntities, ['initial'], ['desc']);
        } else {
          this.mdtaEntities = _.orderBy(this.mdtaEntities, ['initial'], ['asc']);
        }
        break;
      }
      case ('contextual'): {
        this.orderBy.contextual = true;
        if (desc) {
          this.mdtaEntities = _.orderBy(this.mdtaEntities, ['contextual'], ['desc']);
        } else {
          this.mdtaEntities = _.orderBy(this.mdtaEntities, ['contextual'], ['asc']);
        }
        break;
      }
      case ('refined'): {
        this.orderBy.refined = true;
        if (desc) {
          this.mdtaEntities = _.orderBy(this.mdtaEntities, ['refined'], ['desc']);
        } else {
          this.mdtaEntities = _.orderBy(this.mdtaEntities, ['refined'], ['asc']);
        }
        break;
      }
    }
  }
}
