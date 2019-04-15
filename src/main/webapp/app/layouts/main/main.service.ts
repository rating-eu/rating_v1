/*
 * Copyright 2019 HERMENEUT Consortium
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
