package Linkly.backend.Backend.controller;

import Linkly.backend.Backend.dto.LoginRequest;
import Linkly.backend.Backend.entity.User;
import Linkly.backend.Backend.repositories.UserRepository;
import Linkly.backend.Backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
//        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
//        if (userOpt.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
//        }
//
//        User user = userOpt.get();
//        if (!user.getPassword().equals(request.getPassword())) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
//        }
//
//        return ResponseEntity.ok(user);
//    }


//    @PostMapping("/login")
//    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
//
//        System.out.println("Received login request: " + loginRequest);
//        System.out.println("Email: " + loginRequest.getEmail());
//        System.out.println("Password: " + loginRequest.getPassword());
//        System.out.println("Stored Hashed Password: " + loginRequest.getPassword());
//
//
//        if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email and password are required");
//        }
//
//        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());
//
//        if (userOpt.isEmpty()) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
//        }
//
//        User user = userOpt.get();
//
//        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
//        }
//
//        return ResponseEntity.ok(user);
//    }



    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("username", user.getUsername());
        response.put("avatarUrl", user.getAvatarUrl());

        return ResponseEntity.ok(response);
    }




    @PostMapping("/register")
    public ResponseEntity<?> registerUser( @RequestBody User user) {
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Password cannot be null or empty");
        }

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }


        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }





}
