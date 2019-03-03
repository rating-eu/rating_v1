package eu.hermeneut.domain.wp3;

import eu.hermeneut.domain.interfaces.WithYear;

import java.math.BigDecimal;

public class IDE implements WithYear {
    private Integer year;
    private BigDecimal value;

    public IDE() {

    }

    public IDE(Integer year, BigDecimal value) {
        this.year = year;
        this.value = value;
    }

    @Override
    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "IDE{" +
            "year=" + year +
            ", value=" + value +
            '}';
    }
}
