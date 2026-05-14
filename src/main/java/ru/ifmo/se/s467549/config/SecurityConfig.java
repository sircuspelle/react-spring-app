package ru.ifmo.se.s467549.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import ru.ifmo.se.s467549.service.UserDetailsServiceImpl;

import java.util.List;

/**
 * @Configuration - бины в контекст приложения
 * @EnableWebSecurity - включить Spring Security
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // CORS данные вынесены в конфигурационный файл
    @Value("${cors.allowed-origins:http://localhost:5173}")
    private String allowedOrigins;

    private final UserDetailsServiceImpl userDetailsService;

    public SecurityConfig(UserDetailsServiceImpl userDetailsService) {
        // загрузка из БД по логину
        this.userDetailsService = userDetailsService;
        // отладка консольная
        System.out.println(">>> SecurityConfig loaded! <<<");
    }

    /**
     * живущий в контейнере объект - инструкция
     *
     * @param HttpSecurity http - контекст конфигурации, реализующий шаблон Builder
     * @return http.build() - список jakarta.servlet.Filter
     * @throws Exception
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Cross-Site Request Factory выключен - не ожидаем защитные токены в запросе
                .csrf(AbstractHttpConfigurer::disable)
                // Cross-Origin Resource Sharing сконфигурирован для отладки фронта и бэка
                .cors(Customizer.withDefaults())
                // авторизуем шттп запросы
                .authorizeHttpRequests(auth -> auth
                        // разрешаем регистрацию
                        .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
                        // разрешаем всем смотреть ошибки - не обязательно
                        .requestMatchers("/error").permitAll()
                        // для всего остального разрешаем только authenticated пользователям
                        .anyRequest().authenticated()
                )
                // аутентификация с помощью HTTP Basic
                // логин и пароль кодируются в Base64 и кладутся в заголовок Authorization: Basic ...
                .httpBasic(
                        httpBasic -> httpBasic
                                .authenticationEntryPoint((request, response, authException) -> {
                                    // вместо стандартного поведения (заголовок WWW-Authenticate) просто возвращаем 401
                                    // чтобы не было некрасивых всплывающих окон
                                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, authException.getMessage());
                                })

                );

        return http.build();
    }

    // добавляем бин конфигурации CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(allowedOrigins.split(",")));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        // пользователи из сервиса
        authProvider.setUserDetailsService(userDetailsService);
        // способ проверки паролей
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
}