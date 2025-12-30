package org.uni.unitravel.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@ComponentScan("org.uni.unitravel")
@PropertySource("classpath:/application.properties")
public class ApplicationConfiguration {
}


