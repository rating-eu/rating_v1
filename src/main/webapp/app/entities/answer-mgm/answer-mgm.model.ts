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

import {BaseEntity} from './../../shared';
import {AnswerLikelihood} from '../enumerations/AnswerLikelihood.enum';
import {AssetMgm} from '../asset-mgm';
import {AssetCategoryMgm} from '../asset-category-mgm';

export class AnswerMgm implements BaseEntity {
    constructor(public id?: number,
                public name?: string,
                public created?: any,
                public modified?: any,
                public order?: number,
                public likelihood?: AnswerLikelihood,
                public asset?: AssetMgm,
                public assetCategory?: AssetCategoryMgm,
                public questions?: BaseEntity[]) {
    }
}
