import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse, HttpParams} from '../../../../../node_modules/@angular/common/http';
import {SelfAssessmentMgm} from '../entities/self-assessment-mgm';
import {SERVER_API_URL} from '../app.constants';
import {Observable} from '../../../../../node_modules/rxjs';
import {MyAssetMgm} from '../entities/my-asset-mgm';
import {EBITMgm} from '../entities/ebit-mgm';
import {Wp3BundleInput} from './model/wp3-bundle-input.model';
import {Wp3BundleOutput} from './model/wp3-bundle-output.model';
import {ImpactEvaluationStatus} from './model/impact-evaluation-status.model';

@Injectable()
export class ImpactEvaluationService {
    private assetServiceUrl = SERVER_API_URL + 'api/my-assets/self-assessment/';
    private wp3ServiceUrl = SERVER_API_URL + 'api/{selfAssessmentID}';
    private wp3StatusUrl = SERVER_API_URL + 'api/{selfAssessmentID}/dashboard/impact-evaluation-status';
    private operationStepOne = '/wp3/step-one/';
    private operationStepTwo = '/wp3/step-two/';
    private operationStepThree = '/wp3/step-three/';
    private operationStepFour = '/wp3/step-four/';
    private operationStepFive = '/wp3/step-five/';
    private myAssetsEconomicLossesEvaluationStep = '/wp3/economic-losses';

    constructor(
        private http: HttpClient
    ) {
    }

    getStatus(self: SelfAssessmentMgm): Observable<ImpactEvaluationStatus> {
        return this.http.get<ImpactEvaluationStatus>(
            this.wp3StatusUrl.replace('{selfAssessmentID}', String(self.id)),
            {observe: 'response'})
            .map((res: HttpResponse<ImpactEvaluationStatus>) => {
                return res.body;
            });
    }

    getMyAssets(self: SelfAssessmentMgm): Observable<MyAssetMgm[]> {
        const uri = this.assetServiceUrl + self.id.toString();
        return this.http.get<MyAssetMgm[]>(uri, {observe: 'response'})
            .map((res: HttpResponse<MyAssetMgm[]>) => {
                return res.body;
            });
    }

    evaluateStepOne(bundle: Wp3BundleInput, self: SelfAssessmentMgm): Observable<Wp3BundleOutput> {
        return this.http.post<Wp3BundleOutput>(
            this.wp3ServiceUrl.replace('{selfAssessmentID}', String(self.id)) + this.operationStepOne,
            bundle,
            {observe: 'response'})
            .map((res: HttpResponse<Wp3BundleOutput>) => {
                return res.body;
            });
    }

    evaluateStepTwo(bundle: Wp3BundleInput, self: SelfAssessmentMgm): Observable<Wp3BundleOutput> {
        return this.http.post<Wp3BundleOutput>(
            this.wp3ServiceUrl.replace('{selfAssessmentID}', String(self.id)) + this.operationStepTwo,
            bundle,
            {observe: 'response'})
            .map((res: HttpResponse<Wp3BundleOutput>) => {
                return res.body;
            });
    }

    evaluateStepThree(bundle: Wp3BundleInput, self: SelfAssessmentMgm): Observable<Wp3BundleOutput> {
        return this.http.post<Wp3BundleOutput>(
            this.wp3ServiceUrl.replace('{selfAssessmentID}', String(self.id)) + this.operationStepThree,
            bundle,
            {observe: 'response'})
            .map((res: HttpResponse<Wp3BundleOutput>) => {
                return res.body;
            });
    }

    evaluateStepFour(bundle: Wp3BundleInput, self: SelfAssessmentMgm): Observable<Wp3BundleOutput> {
        return this.http.post<Wp3BundleOutput>(
            this.wp3ServiceUrl.replace('{selfAssessmentID}', String(self.id)) + this.operationStepFour,
            bundle,
            {observe: 'response'})
            .map((res: HttpResponse<Wp3BundleOutput>) => {
                return res.body;
            });
    }

    evaluateStepFive(bundle: Wp3BundleInput, self: SelfAssessmentMgm): Observable<Wp3BundleOutput> {
        return this.http.post<Wp3BundleOutput>(
            this.wp3ServiceUrl.replace('{selfAssessmentID}', String(self.id)) + this.operationStepFive,
            bundle,
            {observe: 'response'})
            .map((res: HttpResponse<Wp3BundleOutput>) => {
                return res.body;
            });
    }

    evaluateMyAssetsEconomicLosses(self: SelfAssessmentMgm): Observable<MyAssetMgm[]> {
        return this.http.get<MyAssetMgm[]>(this.wp3ServiceUrl.replace('{selfAssessmentID}', self.id + '') + this.myAssetsEconomicLossesEvaluationStep, {observe: 'response'})
            .map((res: HttpResponse<MyAssetMgm[]>) => {
                return res.body;
            });
    }
}
