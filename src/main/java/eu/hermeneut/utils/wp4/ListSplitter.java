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

package eu.hermeneut.utils.wp4;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ListSplitter {
    private static final Logger log = LoggerFactory.getLogger(ListSplitter.class);


    public static <T> Map<Integer, List<T>> split(List<T> list, int clusters) {

        if (list == null) {
            throw new IllegalArgumentException("List CAN NOT BE NULL!");
        }

        if (clusters > list.size()) {
            throw new IllegalArgumentException("The number of Clusters CAN NOT BE GREATER THAN list SIZE!");
        }

        Map<Integer, List<T>> listClusters = new HashMap<>();

        final int CLUSTER_SIZE = (int) Math.ceil((double) list.size() / (double) clusters);
        log.debug("Cluster Size: " + CLUSTER_SIZE + "\n");

        for (int cluster = 1, startIndex = 0; cluster <= clusters; cluster++) {
            log.debug("Cluster: " + cluster);
            log.debug("StartIndex: " + startIndex);

            int endIndexPlusOne = cluster * CLUSTER_SIZE;

            if (endIndexPlusOne > list.size()) {
                endIndexPlusOne = list.size();
            }

            log.debug("EndIndex: " + endIndexPlusOne + "\n");

            listClusters.put(cluster, list.subList(startIndex, endIndexPlusOne));

            startIndex += CLUSTER_SIZE;

            if (startIndex > list.size()) {
                startIndex = list.size();
            }
        }

        return listClusters;
    }

    /*public static void main(String[] args) {
        List<String> strings = new ArrayList<>();
        strings.add("A");
        strings.add("B");
        strings.add("C");
        strings.add("D");
        strings.add("E");
        strings.add("F");
        strings.add("G");
        strings.add("H");
        strings.add("I");
        strings.add("J");
        strings.add("K");
        strings.add("L");
        strings.add("M");
        strings.add("N");

        Map<Integer, List<String>> result = split(strings, 5);
        log.debug(result + "");
    }*/
}
