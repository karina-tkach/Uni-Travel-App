package org.uni.unitravel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class UniTravelApplication {

    public static void main(String[] args) {
        SpringApplication.run(UniTravelApplication.class, args);
    }

}
