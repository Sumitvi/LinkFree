package Linkly.backend.Backend.controller;

import Linkly.backend.Backend.entity.ShortLink;
import Linkly.backend.Backend.entity.User;
import Linkly.backend.Backend.repositories.ShortLinkRepository;
import Linkly.backend.Backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/shorten")
public class ShortLinkController {

    @Autowired
    private ShortLinkRepository shortLinkRepo;

    @Autowired
    private UserRepository userRepo;

    @PostMapping
    public ResponseEntity<?> createShortLink(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String originalUrl = body.get("originalUrl");

        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String code = UUID.randomUUID().toString().substring(0, 6);

        ShortLink shortLink = new ShortLink();
        shortLink.setOriginalUrl(originalUrl);
        shortLink.setShortCode(code);
        shortLink.setCreatedAt(LocalDateTime.now());
        shortLink.setVisitCount(0);
        shortLink.setUser(user);

        shortLinkRepo.save(shortLink);

        return ResponseEntity.ok(Map.of("code", code));

    }

    @GetMapping("/all/{username}")
    public ResponseEntity<List<ShortLink>> getAllForUser(@PathVariable String username) {
        List<ShortLink> all = shortLinkRepo.findAll().stream()
                .filter(link -> link.getUser().getUsername().equals(username))
                .toList();
        return ResponseEntity.ok(all);
    }

    @GetMapping("/s/{code}")
    public ResponseEntity<?> redirectToOriginal(@PathVariable String code) {
        ShortLink shortLink = shortLinkRepo.findByShortCode(code)
                .orElseThrow(() -> new RuntimeException("Short link not found"));

        shortLink.setVisitCount(shortLink.getVisitCount() + 1);
        shortLinkRepo.save(shortLink);

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(shortLink.getOriginalUrl()));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteShortLink(@PathVariable UUID id) {
        try {
            if (!shortLinkRepo.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            shortLinkRepo.deleteById(id);
            return ResponseEntity.ok("Deleted");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }



}
