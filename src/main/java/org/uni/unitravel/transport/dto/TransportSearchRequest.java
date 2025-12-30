package org.uni.unitravel.transport.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TransportSearchRequest {

    private String pointA;
    private String pointB;
    private LocalDate travelDate;
}

