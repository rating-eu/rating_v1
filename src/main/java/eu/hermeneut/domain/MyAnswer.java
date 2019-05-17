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

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.io.Serializable;
import java.util.Objects;

/**
 * A MyAnswer.
 */
@Entity
@Table(name = "my_answer",
    uniqueConstraints = @UniqueConstraint(columnNames = {"questionnaire_status_id", "questionnaire_id", "question_id", "user_id", "answer_id", "answer_offset"})
)
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)

public class MyAnswer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "note")
    private String note;

    @NotNull
    @Column(name = "answer_offset", nullable = false)
    private Integer answerOffset;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    private QuestionnaireStatus questionnaireStatus;

    @OneToOne
    private Answer answer;

    @OneToOne
    private Question question;

    @OneToOne
    private Questionnaire questionnaire;

    @OneToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNote() {
        return note;
    }

    public MyAnswer note(String note) {
        this.note = note;
        return this;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Integer getAnswerOffset() {
        return answerOffset;
    }

    public MyAnswer answerOffset(Integer answerOffset) {
        this.answerOffset = answerOffset;
        return this;
    }

    public void setAnswerOffset(Integer answerOffset) {
        this.answerOffset = answerOffset;
    }

    @JsonIgnore
    public QuestionnaireStatus getQuestionnaireStatus() {
        return questionnaireStatus;
    }

    public MyAnswer questionnaireStatus(QuestionnaireStatus questionnaireStatus) {
        this.questionnaireStatus = questionnaireStatus;
        return this;
    }

    public void setQuestionnaireStatus(QuestionnaireStatus questionnaireStatus) {
        this.questionnaireStatus = questionnaireStatus;
    }

    public Answer getAnswer() {
        return answer;
    }

    public MyAnswer answer(Answer answer) {
        this.answer = answer;
        return this;
    }

    public void setAnswer(Answer answer) {
        this.answer = answer;
    }

    public Question getQuestion() {
        return question;
    }

    public MyAnswer question(Question question) {
        this.question = question;
        return this;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Questionnaire getQuestionnaire() {
        return questionnaire;
    }

    public MyAnswer questionnaire(Questionnaire questionnaire) {
        this.questionnaire = questionnaire;
        return this;
    }

    public void setQuestionnaire(Questionnaire questionnaire) {
        this.questionnaire = questionnaire;
    }

    public User getUser() {
        return user;
    }

    public MyAnswer user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
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
        MyAnswer myAnswer = (MyAnswer) o;
        if (myAnswer.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), myAnswer.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "MyAnswer{" +
            "id=" + getId() +
            ", note='" + getNote() + "'" +
            ", answerOffset=" + getAnswerOffset() +
            "}";
    }
}
