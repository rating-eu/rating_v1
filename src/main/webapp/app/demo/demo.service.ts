import {Injectable} from '@angular/core';
import {SERVER_API_URL} from "../app.constants";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class DemoService {

    // {companyProfileID}/privacy-board/operation/{operationID}/status
    private loadThreatAgentsDemoURL = SERVER_API_URL + '/api/demo/threat-agents';
    private loadVulnerabilitiesDemoURL = SERVER_API_URL + '/api/demo/vulnerabilities';
    private loadServiceDemoURL = SERVER_API_URL + '/api/demo/service';

    constructor(private http: HttpClient) {
    }

    public loadThreatAgentsDemo(): Observable<boolean> {
        return this.http.post<boolean>(this.loadThreatAgentsDemoURL, {});
    }

    public loadVulnerabilitiesDemo(): Observable<boolean> {
        return this.http.post<boolean>(this.loadVulnerabilitiesDemoURL, {});
    }

    public loadServiceDemo(): Observable<boolean> {
        return this.http.post<boolean>(this.loadServiceDemoURL, {});
    }
}
