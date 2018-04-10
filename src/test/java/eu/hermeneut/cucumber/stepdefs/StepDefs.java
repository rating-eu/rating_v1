package eu.hermeneut.cucumber.stepdefs;

import eu.hermeneut.HermeneutApp;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.ResultActions;

import org.springframework.boot.test.context.SpringBootTest;

@WebAppConfiguration
@SpringBootTest
@ContextConfiguration(classes = HermeneutApp.class)
public abstract class StepDefs {

    protected ResultActions actions;

}
