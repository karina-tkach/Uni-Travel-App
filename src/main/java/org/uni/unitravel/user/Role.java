package org.uni.unitravel.user;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;

@Getter
public enum Role implements GrantedAuthority {
    ADMIN("ADMIN"),
    PARTNER("PARTNER"),
    ANALYST("ANALYST"),
    VISITOR("VISITOR");
    private final String name;

    Role(String name) {
        this.name = name;
    }

    @Override
    public String getAuthority() {
        return name;
    }
}
