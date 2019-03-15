import { Mode } from './../../entities/enumerations/Mode.enum';
import { DatasharingService } from './../../datasharing/datasharing.service';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SERVER_API_URL } from '../../app.constants';

@Injectable()
export class MainService {
    private modeUrl = SERVER_API_URL + '/api/mode';

    constructor(
        private http: HttpClient,
        private dataSharing: DatasharingService,
    ) { }

    public getMode(): Observable<Mode> {
        return this.http.get<Mode>(this.modeUrl, { observe: 'response' })
            .map((res: HttpResponse<Mode>) => {
                return res.body;
            }).catch((err: HttpErrorResponse) => {
                console.error('An error occurred:', err.status);
                return Observable.empty<Mode>();
            });
    }
}
