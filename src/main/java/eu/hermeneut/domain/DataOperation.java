package eu.hermeneut.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A DataOperation.
 */
@Entity
@Table(name = "data_operation")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class DataOperation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "processed_data", nullable = false)
    private String processedData;

    @NotNull
    @Column(name = "processing_purpose", nullable = false)
    private String processingPurpose;

    @NotNull
    @Column(name = "data_subject", nullable = false)
    private String dataSubject;

    @NotNull
    @Column(name = "processing_means", nullable = false)
    private String processingMeans;

    @NotNull
    @Column(name = "data_processor", nullable = false)
    private String dataProcessor;

    @OneToMany(mappedBy = "operation", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<DataRecipient> recipients = new HashSet<>();

    @OneToMany(mappedBy = "operation", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<SecurityImpact> impacts = new HashSet<>();

    @OneToMany(mappedBy = "operation", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<DataThreat> threats = new HashSet<>();

    @ManyToOne
    private CompanyProfile companyProfile;

    @OneToOne(mappedBy = "operation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private OverallSecurityImpact overallSecurityImpact;

    @OneToOne(mappedBy = "operation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private OverallDataThreat overallDataThreat;

    @OneToOne(mappedBy = "operation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private OverallDataRisk overallDataRisk;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public DataOperation name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProcessedData() {
        return processedData;
    }

    public DataOperation processedData(String processedData) {
        this.processedData = processedData;
        return this;
    }

    public void setProcessedData(String processedData) {
        this.processedData = processedData;
    }

    public String getProcessingPurpose() {
        return processingPurpose;
    }

    public DataOperation processingPurpose(String processingPurpose) {
        this.processingPurpose = processingPurpose;
        return this;
    }

    public void setProcessingPurpose(String processingPurpose) {
        this.processingPurpose = processingPurpose;
    }

    public String getDataSubject() {
        return dataSubject;
    }

    public DataOperation dataSubject(String dataSubject) {
        this.dataSubject = dataSubject;
        return this;
    }

    public void setDataSubject(String dataSubject) {
        this.dataSubject = dataSubject;
    }

    public String getProcessingMeans() {
        return processingMeans;
    }

    public DataOperation processingMeans(String processingMeans) {
        this.processingMeans = processingMeans;
        return this;
    }

    public void setProcessingMeans(String processingMeans) {
        this.processingMeans = processingMeans;
    }

    public String getDataProcessor() {
        return dataProcessor;
    }

    public DataOperation dataProcessor(String dataProcessor) {
        this.dataProcessor = dataProcessor;
        return this;
    }

    public void setDataProcessor(String dataProcessor) {
        this.dataProcessor = dataProcessor;
    }

    public Set<DataRecipient> getRecipients() {
        return recipients;
    }

    public DataOperation recipients(Set<DataRecipient> dataRecipients) {
        this.recipients = dataRecipients;
        return this;
    }

    public DataOperation addRecipients(DataRecipient dataRecipient) {
        this.recipients.add(dataRecipient);
        dataRecipient.setOperation(this);
        return this;
    }

    public DataOperation removeRecipients(DataRecipient dataRecipient) {
        this.recipients.remove(dataRecipient);
        dataRecipient.setOperation(null);
        return this;
    }

    public void setRecipients(Set<DataRecipient> dataRecipients) {
        this.recipients = dataRecipients;
    }

    public Set<SecurityImpact> getImpacts() {
        return impacts;
    }

    public DataOperation impacts(Set<SecurityImpact> securityImpacts) {
        this.impacts = securityImpacts;
        return this;
    }

    public DataOperation addImpacts(SecurityImpact securityImpact) {
        this.impacts.add(securityImpact);
        securityImpact.setOperation(this);
        return this;
    }

    public DataOperation removeImpacts(SecurityImpact securityImpact) {
        this.impacts.remove(securityImpact);
        securityImpact.setOperation(null);
        return this;
    }

    public void setImpacts(Set<SecurityImpact> securityImpacts) {
        this.impacts = securityImpacts;
    }

    public Set<DataThreat> getThreats() {
        return threats;
    }

    public DataOperation threats(Set<DataThreat> dataThreats) {
        this.threats = dataThreats;
        return this;
    }

    public DataOperation addThreats(DataThreat dataThreat) {
        this.threats.add(dataThreat);
        dataThreat.setOperation(this);
        return this;
    }

    public DataOperation removeThreats(DataThreat dataThreat) {
        this.threats.remove(dataThreat);
        dataThreat.setOperation(null);
        return this;
    }

    public void setThreats(Set<DataThreat> dataThreats) {
        this.threats = dataThreats;
    }

    public CompanyProfile getCompanyProfile() {
        return companyProfile;
    }

    public DataOperation companyProfile(CompanyProfile companyProfile) {
        this.companyProfile = companyProfile;
        return this;
    }

    public void setCompanyProfile(CompanyProfile companyProfile) {
        this.companyProfile = companyProfile;
    }

    @JsonIgnore
    public OverallSecurityImpact getOverallSecurityImpact() {
        return overallSecurityImpact;
    }

    public void setOverallSecurityImpact(OverallSecurityImpact overallSecurityImpact) {
        this.overallSecurityImpact = overallSecurityImpact;
    }

    @JsonIgnore
    public OverallDataThreat getOverallDataThreat() {
        return overallDataThreat;
    }

    public void setOverallDataThreat(OverallDataThreat overallDataThreat) {
        this.overallDataThreat = overallDataThreat;
    }

    @JsonIgnore
    public OverallDataRisk getOverallDataRisk() {
        return overallDataRisk;
    }

    public void setOverallDataRisk(OverallDataRisk overallDataRisk) {
        this.overallDataRisk = overallDataRisk;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        DataOperation dataOperation = (DataOperation) o;
        if (dataOperation.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), dataOperation.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "DataOperation{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", processedData='" + getProcessedData() + "'" +
            ", processingPurpose='" + getProcessingPurpose() + "'" +
            ", dataSubject='" + getDataSubject() + "'" +
            ", processingMeans='" + getProcessingMeans() + "'" +
            ", dataProcessor='" + getDataProcessor() + "'" +
            "}";
    }
}
