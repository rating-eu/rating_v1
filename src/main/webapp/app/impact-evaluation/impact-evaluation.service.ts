import {AttackCostMgm, CostType} from './../entities/attack-cost-mgm/attack-cost-mgm.model';
import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse, HttpParams} from '../../../../../node_modules/@angular/common/http';
import {SelfAssessmentMgm} from '../entities/self-assessment-mgm';
import {SERVER_API_URL} from '../app.constants';
import {Observable} from '../../../../../node_modules/rxjs';
import {MyAssetMgm} from '../entities/my-asset-mgm';
import {Wp3BundleInput} from './model/wp3-bundle-input.model';
import {Wp3BundleOutput} from './model/wp3-bundle-output.model';
import {ImpactEvaluationStatus} from './model/impact-evaluation-status.model';
import {AttackCostParamMgm} from '../entities/attack-cost-param-mgm';

@Injectable()
export class ImpactEvaluationService {
    private assetServiceUrl = SERVER_API_URL + 'api/my-assets/self-assessment/';
    private wp3ServiceUrl = SERVER_API_URL + 'api/{selfAssessmentID}';
    private wp3StatusUrl = SERVER_API_URL + 'api/{selfAssessmentID}/dashboard/impact-evaluation-status';
    private attackCostUrl = SERVER_API_URL + 'api/{selfAssessmentID}/attack-costs';
    private attackCostParamsUrl = SERVER_API_URL + 'api/{selfAssessmentID}/attack-cost-params';
    private updateAttackCostParamsUrl = SERVER_API_URL + 'api/attack-cost-params';
    private evaluateAttackCostUrl = SERVER_API_URL + 'api/{selfAssessmentID}/{costType}/evaluate-attack-cost';
    private updateAttackCostUrl = SERVER_API_URL + 'api/{selfAssessmentID}/attack-cost';
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

    /*
    API: POST evaluateParam(ParamType (url), AttackCostParam[] (BODY)) --> AttackCostParam;
    API: POST evaluateAttackCost(CostType (url), AttackCostParam[] (BODY)) --> AttackCost(ID=NULL)
    API: PUT api/{selfAssessmentID}/attack-cost --> AttackCost
    */
    updateAttackCost(self: SelfAssessmentMgm, cost: AttackCostMgm): Observable<AttackCostMgm> {
        const uri = this.updateAttackCostUrl.replace('{selfAssessmentID}', String(self.id));
        return this.http.put<AttackCostMgm>(uri, cost, {observe: 'response'})
            .map((res: HttpResponse<AttackCostMgm>) => {
                return res.body;
            });
    }

    updateCreateAttackCostParam(param: AttackCostParamMgm): Observable<AttackCostParamMgm> {
        return this.http.put<AttackCostParamMgm>(this.updateAttackCostParamsUrl, param, {observe: 'response'})
            .map((res: HttpResponse<AttackCostParamMgm>) => {
                return res.body;
            });
    }

    evaluateAttackCost(self: SelfAssessmentMgm, attackCostType: CostType, params: AttackCostParamMgm[]): Observable<AttackCostMgm> {
        let uri = this.evaluateAttackCostUrl.replace('{selfAssessmentID}', String(self.id));
        uri = uri.replace('{costType}', CostType[attackCostType]);
        return this.http.post<AttackCostMgm>(uri, params, {observe: 'response'})
            .map((res: HttpResponse<AttackCostMgm>) => {
                return res.body;
            });
    }

    getAttackCost(self: SelfAssessmentMgm): Observable<AttackCostMgm[]> {
        return this.http.get<AttackCostMgm[]>(
            this.attackCostUrl.replace('{selfAssessmentID}', String(self.id)),
            {observe: 'response'})
            .map((res: HttpResponse<AttackCostMgm[]>) => {
                return res.body;
            });
    }

    getAttackCostParams(self: SelfAssessmentMgm): Observable<AttackCostParamMgm[]> {
        return this.http.get<AttackCostParamMgm[]>(
            this.attackCostParamsUrl.replace('{selfAssessmentID}', String(self.id)),
            {observe: 'response'})
            .map((res: HttpResponse<AttackCostParamMgm[]>) => {
                return res.body;
            });
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
