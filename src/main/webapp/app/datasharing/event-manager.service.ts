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

import {Injectable} from "@angular/core";
import {Observable, ReplaySubject} from "rxjs";
import {Event} from "./event.model";

@Injectable()
export class EventManagerService {

    private eventsSubjectMap: Map<string, ReplaySubject<Event>>;

    constructor() {
        this.eventsSubjectMap = new Map<string, ReplaySubject<Event>>();
    }

    broadcast(event: Event) {
        if (event) {

            let subject: ReplaySubject<Event> = null;

            if (this.eventsSubjectMap.has(event.name)) {
                subject = this.eventsSubjectMap.get(event.name);
            } else {
                subject = new ReplaySubject();
                this.eventsSubjectMap.set(event.name, subject);
            }

            subject.next(event);
        }
    }

    observe(eventName: string): Observable<Event> {
        let subject: ReplaySubject<Event> = null;

        if (this.eventsSubjectMap.has(eventName)) {
            subject = this.eventsSubjectMap.get(eventName);
        } else {
            subject = new ReplaySubject();
            this.eventsSubjectMap.set(eventName, subject);
        }

        return subject.asObservable();
    }
}
