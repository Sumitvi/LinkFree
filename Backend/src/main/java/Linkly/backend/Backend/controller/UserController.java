package Linkly.backend.Backend.controller;
import Linkly.backend.Backend.entity.User;
import Linkly.backend.Backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;


//    @GetMapping("/{username}")
//    public User getUserByUsername(@PathVariable String username) {
//        return userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//    }


    @PutMapping("/{id}")
    public User updateUser(@PathVariable UUID id, @RequestBody User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setBio(updatedUser.getBio());
            user.setAvatarUrl(updatedUser.getAvatarUrl());
            user.setTheme(updatedUser.getTheme());

            // 👇 Add these to save social links
            user.setGithub(updatedUser.getGithub());
            user.setLinkedin(updatedUser.getLinkedin());
            user.setInstagram(updatedUser.getInstagram());
            user.setTwitter(updatedUser.getTwitter());
            user.setButtonShape(updatedUser.getButtonShape());
            user.setButtonShape(updatedUser.getButtonShape());
            user.setButtonSize(updatedUser.getButtonSize());
            user.setButtonColor(updatedUser.getButtonColor());
            user.setFontStyle(updatedUser.getFontStyle());
            user.setBackgroundGradient(updatedUser.getBackgroundGradient());

            user.setLogoUrl(updatedUser.getLogoUrl());
            user.setBackgroundImageUrl(updatedUser.getBackgroundImageUrl());
            user.setCustomCss(updatedUser.getCustomCss());



            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }


    @GetMapping("/{username}")
    public ResponseEntity<User> getUser(@PathVariable String username) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }





}
