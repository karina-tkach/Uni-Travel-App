package org.uni.unitravel.user.controller.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String name;
    private String surname;
    private String password;
    private String email;
}
