package school_app.project.demo.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import school_app.project.demo.application.dtos.LoginRequest;
import school_app.project.demo.application.dtos.LoginResponse;
import school_app.project.demo.application.services.UserService;
import school_app.project.demo.infrastructure.security.CustomUserDetailsService;
import school_app.project.demo.infrastructure.security.JwtUtils;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtUtils jwtUtils;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
            String token = jwtUtils.generateToken(userDetails);
            String role = userDetails.getAuthorities().stream()
                    .findFirst()
                    .map(auth -> auth.getAuthority().replace("ROLE_", "").toLowerCase())
                    .orElse("student");

            String name = userService.findByEmail(loginRequest.getEmail())
                    .map(user -> user.getName())
                    .orElse(loginRequest.getEmail());

            return ResponseEntity.ok(LoginResponse.builder()
                    .token(token)
                    .role(role)
                    .name(name)
                    .build());
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401).build();
        }
    }
}
