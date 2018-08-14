import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '../../../../../node_modules/@angular/common/http';
import { SelfAssessmentMgm } from '../entities/self-assessment-mgm';
import { SERVER_API_URL } from '../app.constants';
import { Observable } from '../../../../../node_modules/rxjs';
import { MyAssetMgm } from '../entities/my-asset-mgm';
import { EBITMgm } from '../entities/ebit-mgm';
import { Wp3BundleInput } from './model/wp3-bundle-input.model';
import { Wp3BundleOutput } from './model/wp3-bundle-output.model';

@Injectable()
export class ImpactEvaluationService {
  private resourceUrl = SERVER_API_URL + 'api/my-assets/self-assessment/';

  constructor(
    private http: HttpClient
  ) { }

  getMyAssets(self: SelfAssessmentMgm): Observable<MyAssetMgm[]> {
    const uri = this.resourceUrl + self.id.toString();
    return this.http.get<MyAssetMgm[]>(uri, { observe: 'response' })
      .map((res: HttpResponse<MyAssetMgm[]>) => {
        return res.body;
      });
  }

  evaluateStepOne(bundle: Wp3BundleInput): Observable<Wp3BundleOutput> {
    return null;
  }

  evaluateStepTwo(bundle: Wp3BundleInput): Observable<Wp3BundleOutput> {
    return null;
  }

  evaluateStepThree(bundle: Wp3BundleInput): Observable<Wp3BundleOutput> {
    return null;
  }

  evaluateStepFour(bundle: Wp3BundleInput): Observable<Wp3BundleOutput> {
    return null;
  }

}
