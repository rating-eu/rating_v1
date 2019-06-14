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

package eu.hermeneut.domain;

import org.hibernate.annotations.*;

import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.*;


import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.Status;

import eu.hermeneut.domain.enumeration.Role;
import org.hibernate.annotations.Cache;

/**
 * A QuestionnaireStatus.
 */
@Entity
@Table(
    name = "questionnaire_status",
    uniqueConstraints = @UniqueConstraint(columnNames = {"jhi_role", "questionnaire_id"})
)
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)

public class QuestionnaireStatus implements Serializable, Comparable<QuestionnaireStatus> {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @CreationTimestamp
    @Column(name = "created")
    private ZonedDateTime created;

    @UpdateTimestamp
    @Column(name = "modified")
    private ZonedDateTime modified;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "jhi_role", nullable = false)
    private Role role;

    @ManyToOne
    @JoinColumn(name = "company_profile_id")
    private CompanyProfile companyProfile;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "questionnaire_id", nullable = false)
    private Questionnaire questionnaire;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "questionnaireStatus", fetch = FetchType.EAGER,
        cascade = CascadeType.ALL, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<MyAnswer> answers = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "external_id", nullable = true)
    private User external;

    /**
     * This field references to the refinement QuestionnaireStatus of the External Audit.
     */
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "refinement_id", nullable = true)
    private QuestionnaireStatus refinement;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Status getStatus() {
        return status;
    }

    public QuestionnaireStatus status(Status status) {
        this.status = status;
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public ZonedDateTime getCreated() {
        return created;
    }

    public QuestionnaireStatus created(ZonedDateTime created) {
        this.created = created;
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getModified() {
        return modified;
    }

    public QuestionnaireStatus modified(ZonedDateTime modified) {
        this.modified = modified;
        return this;
    }

    public void setModified(ZonedDateTime modified) {
        this.modified = modified;
    }

    public Role getRole() {
        return role;
    }

    public QuestionnaireStatus role(Role role) {
        this.role = role;
        return this;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public CompanyProfile getCompanyProfile() {
        return companyProfile;
    }

    public QuestionnaireStatus companyProfile(CompanyProfile companyProfile) {
        this.companyProfile = companyProfile;
        return this;
    }

    public void setCompanyProfile(CompanyProfile companyProfile) {
        this.companyProfile = companyProfile;
    }

    public Questionnaire getQuestionnaire() {
        return questionnaire;
    }

    public QuestionnaireStatus questionnaire(Questionnaire questionnaire) {
        this.questionnaire = questionnaire;
        return this;
    }

    public void setQuestionnaire(Questionnaire questionnaire) {
        this.questionnaire = questionnaire;
    }

    public User getUser() {
        return user;
    }

    public QuestionnaireStatus user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<MyAnswer> getAnswers() {
        return answers;
    }

    public QuestionnaireStatus answers(Set<MyAnswer> myAnswers) {
        this.answers = myAnswers;
        return this;
    }

    public QuestionnaireStatus addAnswers(MyAnswer myAnswer) {
        this.answers.add(myAnswer);
        myAnswer.setQuestionnaireStatus(this);
        return this;
    }

    public QuestionnaireStatus removeAnswers(MyAnswer myAnswer) {
        this.answers.remove(myAnswer);
        myAnswer.setQuestionnaireStatus(null);
        return this;
    }

    public void setAnswers(Set<MyAnswer> myAnswers) {
        this.answers = myAnswers;
    }

    public User getExternal() {
        return external;
    }

    public void setExternal(User external) {
        this.external = external;
    }

    public QuestionnaireStatus getRefinement() {
        return refinement;
    }

    public void setRefinement(QuestionnaireStatus refinement) {
        this.refinement = refinement;
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
        QuestionnaireStatus questionnaireStatus = (QuestionnaireStatus) o;
        if (questionnaireStatus.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), questionnaireStatus.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "QuestionnaireStatus{" +
            "id=" + getId() +
            ", status='" + getStatus() + "'" +
            ", created='" + getCreated() + "'" +
            ", modified='" + getModified() + "'" +
            ", role='" + getRole() + "'" +
            "}";
    }

    @Override
    public int compareTo(QuestionnaireStatus questionnaireStatus) {
        return this.getCreated().compareTo(questionnaireStatus.getCreated());
    }
}
