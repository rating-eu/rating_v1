import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {HttpClient, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {SERVER_API_URL} from '../app.constants';
import {JhiDateUtils} from 'ng-jhipster';

@Injectable()
export class IdentifyAssetService {

    private resourceUrl = SERVER_API_URL + 'api/identify-assets';

    constructor(private http: HttpClient, private dateUtils: JhiDateUtils) {
    }
}
