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

package eu.hermeneut.web.rest.employee;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.Employee;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class EmployeeResource {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping("/employees")
    @Timed
    public Employee createEmployee(@RequestBody @Valid Employee employee) {

        Employee savedEmployee = this.employeeService.save(employee);

        if (savedEmployee != null) {
            // TODO create user
        }

        return savedEmployee;
    }

    @GetMapping("/employees/company/{companyID}/role/{role}")
    @Timed
    public Set<Employee> getEmployeesByCompanyAndRole(@PathVariable Long companyID, @PathVariable Role role) {
        return this.employeeService.getEmployeesByCompanyAndRole(companyID, role);
    }
}
