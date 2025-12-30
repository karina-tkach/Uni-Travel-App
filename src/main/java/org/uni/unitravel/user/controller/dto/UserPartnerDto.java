package org.uni.unitravel.user.controller.dto;

import lombok.Getter;
import lombok.Setter;
import org.uni.unitravel.partner.model.Partner;
import org.uni.unitravel.user.Role;
import org.uni.unitravel.user.User;

@Getter
@Setter
public class UserPartnerDto {
    private Integer id;
    private String name;
    private String surname;
    private String email;
    private Role role;
    private String serviceName;
    private String serviceUrl;

    public UserPartnerDto(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.surname = user.getSurname();
        this.email = user.getEmail();
        this.role = user.getRole();
    }

    public UserPartnerDto(Partner partner) {
        this.id = partner.getUser().getId();
        this.name = partner.getUser().getName();
        this.surname = partner.getUser().getSurname();
        this.email = partner.getUser().getEmail();
        this.role = partner.getUser().getRole();
        this.serviceName = partner.getServiceName();
        this.serviceUrl = partner.getServiceUrl();
    }
}
