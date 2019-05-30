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
import eu.hermeneut.domain.MyCompany;
import eu.hermeneut.domain.User;
import eu.hermeneut.domain.enumeration.Role;
import eu.hermeneut.repository.MyCompanyRepository;
import eu.hermeneut.repository.UserRepository;
import eu.hermeneut.service.EmployeeService;
import eu.hermeneut.service.MailService;
import eu.hermeneut.service.MyCompanyService;
import eu.hermeneut.service.UserService;
import eu.hermeneut.utils.tuple.Couple;
import eu.hermeneut.web.rest.errors.EmailAlreadyUsedException;
import eu.hermeneut.web.rest.errors.LoginAlreadyUsedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class EmployeeResource {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private MailService mailService;

    @Autowired
    private MyCompanyRepository myCompanyRepository;

    @PostMapping("/employees")
    @Timed
    public Employee createEmployee(@RequestBody @Valid Employee employee) {

        //Check for duplicate login
        employeeService.findOneByLogin(employee.getLogin().toLowerCase()).ifPresent(e -> {
            throw new LoginAlreadyUsedException();
        });

        userRepository.findOneByLogin(employee.getLogin().toLowerCase()).ifPresent(u -> {
            throw new LoginAlreadyUsedException();
        });

        //Check for duplicate email
        employeeService.findOneByEmail(employee.getEmail().toLowerCase()).ifPresent(e -> {
            throw new LoginAlreadyUsedException();
        });

        userRepository.findOneByEmailIgnoreCase(employee.getEmail()).ifPresent(u -> {
            throw new EmailAlreadyUsedException();
        });

        Employee savedEmployee = this.employeeService.save(employee);

        if (savedEmployee != null) {
            // TODO create user
            Couple<User, byte[]> userCouple = userService.registerEmployee(employee);
            mailService.sendEmployeeActivationEmail(employee, userCouple.getA(), userCouple.getB());

            MyCompany myCompany = new MyCompany();
            myCompany.setUser(userCouple.getA());
            myCompany.setCompanyProfile(employee.getCompanyProfile());

            this.myCompanyRepository.save(myCompany);
        }

        return savedEmployee;
    }

    @GetMapping("/employees/company/{companyID}/role/{role}")
    @Timed
    public Set<Employee> getEmployeesByCompanyAndRole(@PathVariable Long companyID, @PathVariable Role role) {
        return this.employeeService.getEmployeesByCompanyAndRole(companyID, role);
    }
}
