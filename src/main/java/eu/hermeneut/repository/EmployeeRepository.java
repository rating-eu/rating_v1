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

package eu.hermeneut.repository;

import eu.hermeneut.domain.Employee;
import eu.hermeneut.domain.User;
import eu.hermeneut.domain.enumeration.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    @Query("SELECT DISTINCT employee FROM Employee employee LEFT JOIN FETCH employee.companyProfile " +
        "WHERE employee.companyProfile.id = :companyID AND employee.role = :role")
    Set<Employee> findAllByCompanyIDAndRole(@Param("companyID") Long companyID, @Param("role") Role role);

    @Query("SELECT DISTINCT employee FROM Employee employee LEFT JOIN FETCH employee.companyProfile " +
        "WHERE employee.email = :email")
    Optional<Employee> findOneByEmail(@Param("email") String email);

    @Query("SELECT DISTINCT employee FROM Employee employee LEFT JOIN FETCH employee.companyProfile " +
        "WHERE employee.login = :login")
    Optional<Employee> findOneByLogin(@Param("login") String login);
}
