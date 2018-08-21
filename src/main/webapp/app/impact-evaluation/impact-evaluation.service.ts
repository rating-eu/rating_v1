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
  private assetServiceUrl = SERVER_API_URL + 'api/my-assets/self-assessment/';
  private wp3ServiceUrl = SERVER_API_URL + 'api/{selfAssessmentID}';
  private operationStepOne = '/wp3/step-one/';
  private operationStepTwo = '/wp3/step-two/';
  private operationStepThree = '/wp3/step-three/';
  private operationStepFour = '/wp3/step-four/';

  constructor(
    private http: HttpClient
  ) {}

  getMyAssets(self: SelfAssessmentMgm): Observable<MyAssetMgm[]> {
    const uri = this.assetServiceUrl + self.id.toString();
    return this.http.get<MyAssetMgm[]>(uri, { observe: 'response' })
      .map((res: HttpResponse<MyAssetMgm[]>) => {
        return res.body;
      });
  }

  evaluateStepOne(bundle: Wp3BundleInput, self: SelfAssessmentMgm): Observable<Wp3BundleOutput> {
    return this.http.post<Wp3BundleOutput>(
      this.wp3ServiceUrl.replace('{selfAssessmentID}', String(self.id)) + this.operationStepOne,
      bundle,
      { observe: 'response' })
            .map((res: HttpResponse<Wp3BundleOutput>) => {
                return res.body;
            });
  }

  evaluateStepTwo(bundle: Wp3BundleInput, self: SelfAssessmentMgm): Observable<Wp3BundleOutput> {
    return this.http.post<Wp3BundleOutput>(
      this.wp3ServiceUrl.replace('{selfAssessmentID}', String(self.id)) + this.operationStepTwo,
      bundle,
      { observe: 'response' })
            .map((res: HttpResponse<Wp3BundleOutput>) => {
                return res.body;
            });
  }

  evaluateStepThree(bundle: Wp3BundleInput, self: SelfAssessmentMgm): Observable<Wp3BundleOutput> {
    return this.http.post<Wp3BundleOutput>(
      this.wp3ServiceUrl.replace('{selfAssessmentID}', String(self.id)) + this.operationStepThree,
      bundle,
      { observe: 'response' })
            .map((res: HttpResponse<Wp3BundleOutput>) => {
                return res.body;
            });
  }

  evaluateStepFour(bundle: Wp3BundleInput, self: SelfAssessmentMgm): Observable<Wp3BundleOutput> {
    return this.http.post<Wp3BundleOutput>(
      this.wp3ServiceUrl.replace('{selfAssessmentID}', String(self.id)) + this.operationStepFour,
      bundle,
      { observe: 'response' })
            .map((res: HttpResponse<Wp3BundleOutput>) => {
                return res.body;
            });
  }

}
