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

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.Document;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

import eu.hermeneut.domain.enumeration.QuestionType;

import eu.hermeneut.domain.enumeration.AnswerType;

/**
 * A Question.
 */
@Entity
@Table(name = "question")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "question")
public class Question implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "created")
    private ZonedDateTime created;

    @Column(name = "modified")
    private ZonedDateTime modified;

    @Column(name = "jhi_order")
    private Integer order;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "question_type", nullable = false)
    private QuestionType questionType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "answer_type", nullable = false)
    private AnswerType answerType;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "question_attack_strategies",
               joinColumns = @JoinColumn(name="questions_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="attack_strategies_id", referencedColumnName="id"))
    private Set<AttackStrategy> attackStrategies = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "question_answers",
               joinColumns = @JoinColumn(name="questions_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="answers_id", referencedColumnName="id"))
    private Set<Answer> answers = new HashSet<>();

    @ManyToOne
    private Questionnaire questionnaire;

    @ManyToOne
    private ThreatAgent threatAgent;

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

    public Question name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ZonedDateTime getCreated() {
        return created;
    }

    public Question created(ZonedDateTime created) {
        this.created = created;
        return this;
    }

    public void setCreated(ZonedDateTime created) {
        this.created = created;
    }

    public ZonedDateTime getModified() {
        return modified;
    }

    public Question modified(ZonedDateTime modified) {
        this.modified = modified;
        return this;
    }

    public void setModified(ZonedDateTime modified) {
        this.modified = modified;
    }

    public Integer getOrder() {
        return order;
    }

    public Question order(Integer order) {
        this.order = order;
        return this;
    }

    public void setOrder(Integer order) {
        this.order = order;
    }

    public QuestionType getQuestionType() {
        return questionType;
    }

    public Question questionType(QuestionType questionType) {
        this.questionType = questionType;
        return this;
    }

    public void setQuestionType(QuestionType questionType) {
        this.questionType = questionType;
    }

    public AnswerType getAnswerType() {
        return answerType;
    }

    public Question answerType(AnswerType answerType) {
        this.answerType = answerType;
        return this;
    }

    public void setAnswerType(AnswerType answerType) {
        this.answerType = answerType;
    }

    public Set<AttackStrategy> getAttackStrategies() {
        return attackStrategies;
    }

    public Question attackStrategies(Set<AttackStrategy> attackStrategies) {
        this.attackStrategies = attackStrategies;
        return this;
    }

    public Question addAttackStrategies(AttackStrategy attackStrategy) {
        this.attackStrategies.add(attackStrategy);
        return this;
    }

    public Question removeAttackStrategies(AttackStrategy attackStrategy) {
        this.attackStrategies.remove(attackStrategy);
        return this;
    }

    public void setAttackStrategies(Set<AttackStrategy> attackStrategies) {
        this.attackStrategies = attackStrategies;
    }

    public Set<Answer> getAnswers() {
        return answers;
    }

    public Question answers(Set<Answer> answers) {
        this.answers = answers;
        return this;
    }

    public Question addAnswers(Answer answer) {
        this.answers.add(answer);
        answer.getQuestions().add(this);
        return this;
    }

    public Question removeAnswers(Answer answer) {
        this.answers.remove(answer);
        answer.getQuestions().remove(this);
        return this;
    }

    public void setAnswers(Set<Answer> answers) {
        this.answers = answers;
    }

    public Questionnaire getQuestionnaire() {
        return questionnaire;
    }

    public Question questionnaire(Questionnaire questionnaire) {
        this.questionnaire = questionnaire;
        return this;
    }

    public void setQuestionnaire(Questionnaire questionnaire) {
        this.questionnaire = questionnaire;
    }

    public ThreatAgent getThreatAgent() {
        return threatAgent;
    }

    public Question threatAgent(ThreatAgent threatAgent) {
        this.threatAgent = threatAgent;
        return this;
    }

    public void setThreatAgent(ThreatAgent threatAgent) {
        this.threatAgent = threatAgent;
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
        Question question = (Question) o;
        if (question.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), question.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Question{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", created='" + getCreated() + "'" +
            ", modified='" + getModified() + "'" +
            ", order=" + getOrder() +
            ", questionType='" + getQuestionType() + "'" +
            ", answerType='" + getAnswerType() + "'" +
            "}";
    }
}
