package org.uni.unitravel.user.controller.dto;

import lombok.Getter;
import lombok.Setter;
import org.uni.unitravel.user.Role;

@Getter
@Setter
public class UpdateUserRequest {
    private Integer id;
    private Long partnerId;
    private String name;
    private String surname;
    private String email;
    private Role role;

    // OPTIONAL
    private String password;
    private String serviceName;
    private String serviceUrl;
}

