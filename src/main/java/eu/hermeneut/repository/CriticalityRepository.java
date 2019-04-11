package eu.hermeneut.repository;

import eu.hermeneut.domain.Criticality;
import eu.hermeneut.domain.compact.output.CriticalityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CriticalityRepository extends JpaRepository<Criticality, Long> {

    @Query("SELECT criticality from Criticality criticality where criticality.companyProfile.id = :companyProfileID")
    List<Criticality> findAllByCompanyProfile(@Param("companyProfileID") Long companyProfileID);

    @Query("SELECT criticality from Criticality criticality where criticality.companyProfile.id = :companyProfileID " +
        "AND criticality.attackStrategy.id = :attackStrategyID AND criticality.type = :criticalityType")
    Criticality findOneByCompanyProfileAttackStrategyAndCriticalityType(@Param("companyProfileID") Long companyProfileID,
                                                                        @Param("attackStrategyID") Long attackStrategyID,
                                                                        @Param("criticalityType") CriticalityType criticalityType);
}
