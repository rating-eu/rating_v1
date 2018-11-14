package eu.hermeneut.kafka.config;

import eu.hermeneut.domain.compact.RiskProfile;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class SenderConfig {

    @Value("${spring.kafka.consumer.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public Map<String, Object> producerConfigs() {
        Map<String, Object> properties = new HashMap<>();
        properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        //The maximum size of a request in bytes.
        properties.put(ProducerConfig.MAX_REQUEST_SIZE_CONFIG, "20971520");
        properties.put(ProducerConfig.COMPRESSION_TYPE_CONFIG, "gzip");

        return properties;
    }

    @Qualifier("RiskProfile")
    @Bean
    public ProducerFactory<String, RiskProfile> producerFactory() {
        return new DefaultKafkaProducerFactory<>(producerConfigs());
    }

    @Qualifier("RiskProfile")
    @Bean
    public KafkaTemplate<String, RiskProfile> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}
