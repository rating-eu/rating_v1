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

package eu.hermeneut.service.impl;

import eu.hermeneut.domain.Employee;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.repository.EmployeeRepository;
import eu.hermeneut.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public Employee save(Employee employee) {
        return this.employeeRepository.save(employee);
    }

    @Override
    public List<Employee> findAll() {
        return this.employeeRepository.findAll();
    }

    @Override
    public Employee findOne(Long id) {
        return this.employeeRepository.findOne(id);
    }

    @Override
    public Optional<Employee> findOneByLogin(String login) {
        return this.employeeRepository.findOneByLogin(login.toLowerCase());
    }

    @Override
    public Optional<Employee> findOneByEmail(String email) {
        return this.employeeRepository.findOneByEmail(email.toLowerCase());
    }

    @Override
    public void delete(Long id) {
        this.employeeRepository.delete(id);
    }

    @Override
    public Set<Employee> getEmployeesByCompanyAndRole(Long companyID, Role role) {
        return this.employeeRepository.findAllByCompanyIDAndRole(companyID, role);
    }
}
