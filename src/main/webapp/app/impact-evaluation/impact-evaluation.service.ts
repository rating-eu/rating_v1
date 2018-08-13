import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '../../../../../node_modules/@angular/common/http';
import { SelfAssessmentMgm } from '../entities/self-assessment-mgm';
import { SERVER_API_URL } from '../app.constants';
import { Observable } from '../../../../../node_modules/rxjs';
import { MyAssetMgm } from '../entities/my-asset-mgm';

@Injectable()
export class ImpactEvaluationService {
  private resourceUrl = SERVER_API_URL + 'api/my-assets/self-assessment';

  constructor(
    private http: HttpClient
  ) { }

  getMyAssets(self: SelfAssessmentMgm): Observable<MyAssetMgm[]> {
    const options: HttpParams = new HttpParams();
    options.set('selfAssessmentID', self.id.toString());
    return this.http.get<MyAssetMgm[]>(this.resourceUrl, { params: options, observe: 'response' })
      .map((res: HttpResponse<MyAssetMgm[]>) => {
        return res.body;
    });
  }

}
