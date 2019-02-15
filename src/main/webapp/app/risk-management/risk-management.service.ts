import { ThreatAgentInterest } from './model/threat-agent-interest.model';
import { Injectable } from '@angular/core';
import { Observable, Subject } from '../../../../../node_modules/rxjs';
import { SERVER_API_URL } from '../app.constants';
import { SelfAssessmentMgm } from '../entities/self-assessment-mgm';
import { CriticalLevelMgm } from '../entities/critical-level-mgm';
import { HttpClient, HttpResponse, HttpErrorResponse } from '../../../../../node_modules/@angular/common/http';
import { MyAssetMgm } from '../entities/my-asset-mgm';
import { MyAssetAttackChance } from './model/my-asset-attack-chance.model';
import { AttackCostFormula } from './model/attack-cost-formula.model';

@Injectable()
export class RiskManagementService {
  private criticalLevelServiceUrl = SERVER_API_URL + 'api/critical-levels/self-assessment/';
  private assetServiceUrl = SERVER_API_URL + 'api/my-assets/self-assessment/';
  private attackChanceServiceUrl = SERVER_API_URL + 'api/{selfAssessmentID}/wp4/my-assets/{myAssetID}/attack-chances/';
  private threatAgentsInterestsServiceUrl = SERVER_API_URL + 'api/{selfAssessmentID}/wp4/my-assets/{myAssetID}/threat-agent-interests';
  private attackCostsFormulaByMyAssetUrl = SERVER_API_URL + '/api/{selfAssessmentID}/formula/attack-costs/{myAssetID}';
  private impactFormulaByMyAssetUrl = SERVER_API_URL + '/api/{selfAssessmentID}/formula/impact/{myAssetID}';
  private subscriptorForCriticalLevel: Subject<CriticalLevelMgm> = new Subject<CriticalLevelMgm>();

  constructor(
    private http: HttpClient
  ) { }

  public subscribeForCriticalLevel(): Observable<CriticalLevelMgm> {
    return this.subscriptorForCriticalLevel.asObservable();
  }

  public sendUpdateForCriticalLevelToSubscriptor(level: CriticalLevelMgm) {
    this.subscriptorForCriticalLevel.next(level);
  }

  public getImpactFormulaByMyAsset(self: SelfAssessmentMgm, myAsset: MyAssetMgm): Observable<string> {
    const uri = this.impactFormulaByMyAssetUrl.replace('{selfAssessmentID}', String(self.id)).replace('{myAssetID}', String(myAsset.id));
    return this.http.get(uri, {responseType: 'text'})
      .map((res) => {
        return res;
      }).catch((err) => {
        console.error('An error occurred:', err);
        return Observable.empty<string>();
      });
  }

  public getAttackCostsFormulaByMyAsset(self: SelfAssessmentMgm, myAsset: MyAssetMgm): Observable<AttackCostFormula[]> {
    const uri = this.attackCostsFormulaByMyAssetUrl.replace('{selfAssessmentID}', String(self.id)).replace('{myAssetID}', String(myAsset.id));
    return this.http.get<AttackCostFormula[]>(uri, { observe: 'response' })
      .map((res: HttpResponse<AttackCostFormula[]>) => {
        return res.body;
      }).catch((err: HttpErrorResponse) => {
        console.error('An error occurred:', err.status);
        return Observable.empty<AttackCostFormula[]>();
      });
  }

  public getCriticalLevel(self: SelfAssessmentMgm): Observable<CriticalLevelMgm> {
    const uri = this.criticalLevelServiceUrl + self.id.toString();
    return this.http.get<CriticalLevelMgm>(uri, { observe: 'response' })
      .map((res: HttpResponse<CriticalLevelMgm>) => {
        return res.body;
      }).catch((err: HttpErrorResponse) => {
        console.error('An error occurred:', err.status);
        return Observable.empty<CriticalLevelMgm>();
      });
  }

  public getMyAssets(self: SelfAssessmentMgm): Observable<MyAssetMgm[]> {
    const uri = this.assetServiceUrl + self.id.toString();
    return this.http.get<MyAssetMgm[]>(uri, { observe: 'response' })
      .map((res: HttpResponse<MyAssetMgm[]>) => {
        return res.body;
      });
  }

  public getAttackChance(myAsset: MyAssetMgm, self: SelfAssessmentMgm): Observable<MyAssetAttackChance[]> {
    const uri = this.attackChanceServiceUrl.replace('{selfAssessmentID}', String(self.id)).replace('{myAssetID}', String(myAsset.id));
    return this.http.get<MyAssetAttackChance[]>(uri, { observe: 'response' })
      .map((res: HttpResponse<MyAssetAttackChance[]>) => {
        return res.body;
      });
  }

  public getThreatAgentsInterests(myAsset: MyAssetMgm, self: SelfAssessmentMgm): Observable<ThreatAgentInterest[]> {
    const uri = this.threatAgentsInterestsServiceUrl.replace('{selfAssessmentID}', String(self.id)).replace('{myAssetID}', String(myAsset.id));
    return this.http.get<ThreatAgentInterest[]>(uri, { observe: 'response' })
      .map((res: HttpResponse<ThreatAgentInterest[]>) => {
        return res.body;
      });
  }

  public whichLevel(row: number, column: number, criticalLevel: CriticalLevelMgm): string {
    const level = row * column;
    if (level <= criticalLevel.lowLimit) {
      return 'low';
    } else if (level > criticalLevel.lowLimit && level <= criticalLevel.mediumLimit) {
      return 'medium';
    } else if (level > criticalLevel.mediumLimit && level <= criticalLevel.highLimit) {
      return 'high';
    } else if (criticalLevel.mediumLimit === undefined && level <= criticalLevel.highLimit) {
      return 'high';
    } else if (criticalLevel.lowLimit === undefined && level <= criticalLevel.mediumLimit) {
      return 'medium';
    } else {
      return 'undefined';
    }
  }
}
