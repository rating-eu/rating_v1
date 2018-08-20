import { Injectable } from '@angular/core';
import { Observable } from '../../../../../node_modules/rxjs';
import { SERVER_API_URL } from '../app.constants';
import { SelfAssessmentMgm } from '../entities/self-assessment-mgm';
import { CriticalLevelMgm } from '../entities/critical-level-mgm';
import { HttpClient, HttpResponse } from '../../../../../node_modules/@angular/common/http';

@Injectable()
export class RiskManagementService {
  private criticalLevelServiceUrl = SERVER_API_URL + 'api/critical-levels/self-assessment/';
  constructor(
    private http: HttpClient
  ) { }

  public getCriticalLevel(self: SelfAssessmentMgm): Observable<CriticalLevelMgm> {
    const uri = this.criticalLevelServiceUrl + self.id.toString();
    return this.http.get<CriticalLevelMgm>(uri, { observe: 'response' })
      .map((res: HttpResponse<CriticalLevelMgm>) => {
        return res.body;
      });
  }
  public updateCriticalLevel(criticalLevel: any): Observable<void> {
    return null;
  }

}
