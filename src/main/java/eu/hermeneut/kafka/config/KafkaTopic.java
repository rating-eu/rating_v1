package eu.hermeneut.kafka.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Profile("kafka")
@Component
@ConfigurationProperties(prefix = "kafka.topic")
public class KafkaTopic {

    private String riskProfile;

    private String criticalityNotification;

    public String getRiskProfile() {
        return riskProfile;
    }

    public void setRiskProfile(String riskProfile) {
        this.riskProfile = riskProfile;
    }

    public String getCriticalityNotification() {
        return criticalityNotification;
    }

    public void setCriticalityNotification(String criticalityNotification) {
        this.criticalityNotification = criticalityNotification;
    }
}
