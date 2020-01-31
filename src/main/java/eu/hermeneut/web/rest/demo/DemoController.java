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

package eu.hermeneut.web.rest.demo;

import com.codahale.metrics.annotation.Timed;
import eu.hermeneut.domain.CompanyProfile;
import eu.hermeneut.domain.MyCompany;
import eu.hermeneut.domain.User;
import eu.hermeneut.security.AuthoritiesConstants;
import eu.hermeneut.security.SecurityUtils;
import eu.hermeneut.service.MyCompanyService;
import eu.hermeneut.service.UserService;
import eu.hermeneut.service.demo.DemoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/demo")
public class DemoController {

    @Autowired
    private DemoService demoService;

    @Autowired
    private UserService userService;

    @Autowired
    private MyCompanyService myCompanyService;

    @PostMapping("/threat-agents")
    @Timed
    public void loadThreatAgentsDemo() {
        //Get the current user
        User currentUser = this.userService.getUserWithAuthorities().orElse(null);

        if (currentUser != null) {
            if (SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.CISO)) {
                MyCompany myCompany = this.myCompanyService.findOneByUser(currentUser.getId());

                if (myCompany != null) {
                    CompanyProfile companyProfile = myCompany.getCompanyProfile();

                    if (companyProfile != null) {
                        this.demoService.loadThreatAgentsQuestionnaireStatus(currentUser, companyProfile);
                    }
                }
            }
        }
    }
}
