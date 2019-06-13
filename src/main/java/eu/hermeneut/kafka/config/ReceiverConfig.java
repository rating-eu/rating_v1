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

package eu.hermeneut.kafka.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import eu.hermeneut.constant.KafkaListenerFactories;
import eu.hermeneut.domain.compact.input.RiskProfile;
import eu.hermeneut.domain.compact.input.VulnerabilityProfile;
import eu.hermeneut.domain.compact.output.CriticalityNotification;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.KafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.ConcurrentMessageListenerContainer;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import java.util.HashMap;
import java.util.Map;

@Profile("kafka")
@Configuration
@EnableKafka
public class ReceiverConfig implements KafkaListenerFactories {
    @Value("${spring.kafka.consumer.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${spring.kafka.consumer.group-id}")
    private String groupID;

    @Autowired
    private ObjectMapper objectMapper;

    @Bean
    public Map<String, Object> consumerConfigs() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, groupID);
        return props;
    }

    @Bean
    public ConsumerFactory<String, String> kafkaConsumerFactory() {
        return newConsumerFactory(String.class);
    }

    @Bean
    public KafkaListenerContainerFactory<ConcurrentMessageListenerContainer<String, String>> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(kafkaConsumerFactory());
        factory.setBatchListener(true);
        return factory;
    }

    //================================================Risk Profile======================================================
    @Bean
    public ConsumerFactory<String, RiskProfile> riskProfileConsumerFactory() {
        return newConsumerFactory(RiskProfile.class);
    }

    @Bean(name = RISK_PROFILE)
    public KafkaListenerContainerFactory<ConcurrentMessageListenerContainer<String, RiskProfile>> riskProfileKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, RiskProfile> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(riskProfileConsumerFactory());
        factory.setBatchListener(true);
        return factory;
    }

    //================================================Vulnerability Profile======================================================
    @Bean
    public ConsumerFactory<String, VulnerabilityProfile> vulnerabilityProfileConsumerFactory() {
        return newConsumerFactory(VulnerabilityProfile.class);
    }

    @Bean(name = VULNERABILITY_PROFILE)
    public KafkaListenerContainerFactory<ConcurrentMessageListenerContainer<String, VulnerabilityProfile>> vulnerabilityProfileKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, VulnerabilityProfile> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(vulnerabilityProfileConsumerFactory());
        factory.setBatchListener(true);
        return factory;
    }

    //=========================================Criticality Notification=================================================
    @Bean
    public ConsumerFactory<String, CriticalityNotification> criticalityNotificationConsumerFactory() {
        return newConsumerFactory(CriticalityNotification.class);
    }

    @Bean(name = CRITICALITY_NOTIFICATION)
    public KafkaListenerContainerFactory<ConcurrentMessageListenerContainer<String, CriticalityNotification>> criticalityNotificationKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, CriticalityNotification> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(criticalityNotificationConsumerFactory());
        factory.setBatchListener(true);
        return factory;
    }

    //==============================================Helpher methods=====================================================

    private <T> ConsumerFactory<String, T> newConsumerFactory(Class<T> t) {
        return new DefaultKafkaConsumerFactory<>(consumerConfigs(),
            new StringDeserializer(),
            new JsonDeserializer<>(t, objectMapper)
        );
    }
}
