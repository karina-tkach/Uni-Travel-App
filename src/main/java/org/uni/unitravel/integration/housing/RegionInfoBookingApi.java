package org.uni.unitravel.integration.housing;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public enum RegionInfoBookingApi {

    VINNYTSKA(4833L, null, "Вінницька область"),
    VOLYNSKA(4834L, null, "Волинська область"),
    DNIPROPETROVSKA(4815L, null, "Дніпропетровська область"),
    ZHYTOMYRSKA(4836L, null, "Житомирська область"),

    ZAKARPATSKA(null, List.of(48.6208, 22.287883), "Закарпатська область"),
    ZAPORIZKA(null, List.of(47.8388, 35.139567), "Запорізька область"),

    IVANO_FRANKIVSKA(4817L, null, "Івано-Франківська область"),
    KYIVSKA(4821L, null, "Київська область"),
    KIROVOHRADSKA(4822L, null, "Кіровоградська область"),
    LVIVSKA(4823L, null, "Львівська область"),
    MYKOLAIVSKA(4825L, null, "Миколаївська область"),
    ODESKA(4826L, null, "Одеська область"),
    POLTAVSKA(4627L, null, "Полтавська область"),
    RIVNENSKA(4828L, null, "Рівненська область"),
    SUMSKA(4830L, null, "Сумська область"),
    TERNOPILSKA(4831L, null, "Тернопільська область"),
    KHARKIVSKA(4818L, null, "Харківська область"),

    KHERSONSKA(null, List.of(46.635417, 32.616867), "Херсонська область"),

    KHMELNYTSKA(4820L, null, "Хмельницька область"),
    CHERKASKA(4812L, null, "Черкаська область"),
    CHERNIVETSKA(6303L, null, "Чернівецька область"),
    CHERNIGIVSKA(4813L, null, "Чернігівська область");

    private final Long destId;
    private final List<Double> coordinates;
    private final String uaName;

    RegionInfoBookingApi(Long destId, List<Double> coordinates, String uaName) {
        this.destId = destId;
        this.coordinates = coordinates;
        this.uaName = uaName;
    }

    public Long getDestId() { return destId; }
    public List<Double> getCoordinates() { return coordinates; }
    public String getUaName() { return uaName; }

    private static final Map<String, RegionInfoBookingApi> UA_LOOKUP = new HashMap<>();

    static {
        for (RegionInfoBookingApi r : values()) {
            UA_LOOKUP.put(r.uaName, r);
        }
    }

    public static RegionInfoBookingApi fromUkrainian(String name) {
        return UA_LOOKUP.get(name);
    }
}

