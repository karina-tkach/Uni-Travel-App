package org.uni.unitravel.user.controller.dto;

import lombok.Getter;
import lombok.Setter;
import org.uni.unitravel.user.Role;

@Getter
@Setter
public class AddUserRequest {
    private String name;
    private String surname;
    private String email;
    private String password;
    private Role role;
    private String serviceName;
    private String serviceUrl;
}
