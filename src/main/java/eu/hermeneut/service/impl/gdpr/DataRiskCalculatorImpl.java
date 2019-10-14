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

package eu.hermeneut.service.impl.gdpr;

import eu.hermeneut.domain.DataOperation;
import eu.hermeneut.domain.OverallDataRisk;
import eu.hermeneut.domain.OverallDataThreat;
import eu.hermeneut.domain.OverallSecurityImpact;
import eu.hermeneut.domain.enumeration.DataImpact;
import eu.hermeneut.domain.enumeration.DataRiskLevel;
import eu.hermeneut.domain.enumeration.DataThreatLikelihood;
import eu.hermeneut.service.gdpr.DataRiskCalculator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
public class DataRiskCalculatorImpl implements DataRiskCalculator {
    private static Map<DataThreatLikelihood, Map<DataImpact, DataRiskLevel>> dataRisksMap;

    static {
        dataRisksMap = new HashMap<DataThreatLikelihood, Map<DataImpact, DataRiskLevel>>() {
            {
                put(DataThreatLikelihood.LOW, new HashMap<DataImpact, DataRiskLevel>() {
                    {
                        put(DataImpact.LOW, DataRiskLevel.LOW);
                        put(DataImpact.MEDIUM, DataRiskLevel.MEDIUM);
                        put(DataImpact.HIGH, DataRiskLevel.HIGH);
                        put(DataImpact.VERY_HIGH, DataRiskLevel.HIGH);
                    }
                });

                put(DataThreatLikelihood.MEDIUM, new HashMap<DataImpact, DataRiskLevel>() {
                    {
                        put(DataImpact.LOW, DataRiskLevel.LOW);
                        put(DataImpact.MEDIUM, DataRiskLevel.MEDIUM);
                        put(DataImpact.HIGH, DataRiskLevel.HIGH);
                        put(DataImpact.VERY_HIGH, DataRiskLevel.HIGH);
                    }
                });

                put(DataThreatLikelihood.HIGH, new HashMap<DataImpact, DataRiskLevel>() {
                    {
                        put(DataImpact.LOW, DataRiskLevel.MEDIUM);
                        put(DataImpact.MEDIUM, DataRiskLevel.HIGH);
                        put(DataImpact.HIGH, DataRiskLevel.HIGH);
                        put(DataImpact.VERY_HIGH, DataRiskLevel.HIGH);
                    }
                });
            }
        };
    }

    @Override
    public OverallDataRisk calculateOverallDataRisk(OverallSecurityImpact overallSecurityImpact, OverallDataThreat overallDataThreat) {
        if (overallSecurityImpact == null) {
            throw new IllegalArgumentException("OverallDataThreat is NULL!");
        } else if (overallDataThreat == null) {
            throw new IllegalArgumentException("OverallSecurityImpact is NULL!");
        }

        DataOperation operationA = overallSecurityImpact.getOperation();
        DataOperation operationB = overallDataThreat.getOperation();

        if (operationA == null || operationB == null) {
            throw new IllegalArgumentException("One of the DataOperations is NULL!");
        }

        if (!operationA.getId().equals(operationB.getId())) {
            throw new IllegalArgumentException("The DataOperations are different!");
        }

        DataImpact dataImpact = overallSecurityImpact.getImpact();
        DataThreatLikelihood threatLikelihood = overallDataThreat.getLikelihood();

        if (dataImpact == null) {
            throw new IllegalArgumentException("DataImpact is NULL!");
        }

        if (threatLikelihood == null) {
            throw new IllegalArgumentException("ThreatLikelihood is NULL!");
        }

        OverallDataRisk overallDataRisk = new OverallDataRisk();
        overallDataRisk.setOperation(operationA);
        overallDataRisk.setRiskLevel(dataRisksMap.get(threatLikelihood).get(dataImpact));

        return overallDataRisk;
    }
}
