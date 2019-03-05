package eu.hermeneut.utils.tuple;

public class Couple<T, U> {
    private T a;
    private U b;

    public Couple(){

    }

    public Couple(T a, U b) {
        this.a = a;
        this.b = b;
    }

    public T getA() {
        return a;
    }

    public void setA(T a) {
        this.a = a;
    }

    public U getB() {
        return b;
    }

    public void setB(U b) {
        this.b = b;
    }

    @Override
    public String toString() {
        return "Couple{" +
            "a=" + a +
            ", b=" + b +
            '}';
    }
}
