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

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ElasticsearchReindexService } from './elasticsearch-reindex.service';

@Component({
    selector: 'jhi-elasticsearch-reindex-modal',
    templateUrl: './elasticsearch-reindex-modal.component.html'
})
export class ElasticsearchReindexModalComponent {

    constructor(
        private elasticsearchReindexService: ElasticsearchReindexService,
        public activeModal: NgbActiveModal
    ) { }

    reindex() {
        this.elasticsearchReindexService.reindex().subscribe(() => this.activeModal.dismiss());
    }
}
