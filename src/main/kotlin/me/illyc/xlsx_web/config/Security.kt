package me.illyc.xlsx_web.config

import org.springframework.context.annotation.Bean
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.core.userdetails.User
import org.springframework.security.provisioning.InMemoryUserDetailsManager

@EnableWebSecurity
open class Security {

    @Bean
    open fun userDetailsService() = InMemoryUserDetailsManager(
        User.withUsername("editor")
            .password("{noop}editor")
            .roles("ADMIN")
            .build()
    )

    @Bean
    open fun filterChain(http: HttpSecurity) = http
        .authorizeRequests()
        .antMatchers("/workbook/**").hasRole("ADMIN")
        .anyRequest().permitAll()
        .and().httpBasic()
        .and().csrf().disable()
        .build()!!
}