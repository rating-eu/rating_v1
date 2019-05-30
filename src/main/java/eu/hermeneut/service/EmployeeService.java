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

package eu.hermeneut.service;

import eu.hermeneut.domain.Employee;
import eu.hermeneut.domain.enumeration.Role;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface EmployeeService {
    /**
     * Save a Employee.
     *
     * @param employee the entity to save
     * @return the persisted entity
     */
    Employee save(Employee employee);

    /**
     * Get all the Employees.
     *
     * @return the list of entities
     */
    List<Employee> findAll();

    /**
     * Get the "id" Employee.
     *
     * @param id the id of the entity
     * @return the entity
     */
    Employee findOne(Long id);

    /**
     * Get the Employ by login, if it exists.
     * @param login
     * @return
     */
    Optional<Employee> findOneByLogin(String login);

    /**
     * Get the Employ by email, if it exists.
     * @param email
     * @return
     */
    Optional<Employee> findOneByEmail(String email);

    /**
     * Delete the "id" Employee.
     *
     * @param id the id of the entity
     */
    void delete(Long id);

    /**
     * Get all the Employees by company and role.
     * @param companyID
     * @param role
     * @return
     */
    Set<Employee> getEmployeesByCompanyAndRole(Long companyID, Role role);
}
