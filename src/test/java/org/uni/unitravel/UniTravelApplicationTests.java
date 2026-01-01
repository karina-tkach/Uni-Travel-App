package org.uni.unitravel;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Disabled("Disabled for CI/CD")
class UniTravelApplicationTests {

    @Test
    void contextLoads() {
    }
}

