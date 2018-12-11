package eu.hermeneut.service;

import eu.hermeneut.domain.wp4.MyAssetAttackChance;
import eu.hermeneut.exceptions.NotFoundException;
import eu.hermeneut.exceptions.NullInputException;

import java.util.List;

public interface WP4StepsService {
    List<MyAssetAttackChance> getAttackChances(Long selfAssessmentID, Long myAssetID) throws NullInputException, NotFoundException;
}
