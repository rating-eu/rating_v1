package eu.hermeneut.repository;

import eu.hermeneut.domain.GDPRQuestion;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the GDPRQuestion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GDPRQuestionRepository extends JpaRepository<GDPRQuestion, Long> {
    @Query("select distinct gdpr_question from GDPRQuestion gdpr_question left join fetch gdpr_question.answers")
    List<GDPRQuestion> findAllWithEagerRelationships();

    @Query("select gdpr_question from GDPRQuestion gdpr_question left join fetch gdpr_question.answers where gdpr_question.id =:id")
    GDPRQuestion findOneWithEagerRelationships(@Param("id") Long id);

    @Query("SELECT question FROM GDPRQuestion question LEFT JOIN FETCH question.answers WHERE question.questionnaire.id = :questionnaireID")
    List<GDPRQuestion> findAllByQuestionnaire(@Param("questionnaireID") Long questionnaireID);
}
