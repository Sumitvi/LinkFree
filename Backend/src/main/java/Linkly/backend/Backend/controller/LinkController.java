package Linkly.backend.Backend.controller;

import Linkly.backend.Backend.entity.ClickLog;
import Linkly.backend.Backend.entity.Link;
import Linkly.backend.Backend.entity.User;
import Linkly.backend.Backend.repositories.ClickLogRepository;
import Linkly.backend.Backend.repositories.LinkRepository;
import Linkly.backend.Backend.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/links")
@RequiredArgsConstructor
public class LinkController {

    private final LinkRepository linkRepo;
    private final UserRepository userRepo;
    private final ClickLogRepository clickRepo;


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepo.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        user.setId(null); // Let JPA auto-generate
        userRepo.save(user);
        return ResponseEntity.ok("User registered successfully");
    }



    @PostMapping("/{username}/add")
    public ResponseEntity<?> addLink(@PathVariable String username, @RequestBody Link link) {
        User user = userRepo.findByUsername(username).orElseThrow();
        link.setUser(user);
        link.setCreatedAt(LocalDateTime.now());
        linkRepo.save(link);
        return ResponseEntity.ok("Link added");
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<Link>> getLinks(@PathVariable String username) {
        return ResponseEntity.ok(linkRepo.findAllByUser_UsernameOrderByPositionOrder(username));
    }

    @PostMapping("/{linkId}/click")
    public ResponseEntity<?> recordClick(@PathVariable UUID linkId, HttpServletRequest request) {
        ClickLog click = new ClickLog(linkId, LocalDateTime.now(), request.getHeader("User-Agent"));
        clickRepo.save(click);
        return ResponseEntity.ok("Click recorded");
    }

    @GetMapping("/{linkId}/analytics")
    public ResponseEntity<Long> getClicks(@PathVariable UUID linkId) {
        LocalDateTime from = LocalDateTime.now().minusDays(28);
        long count = clickRepo.countClicksSince(linkId, from);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLink(@PathVariable UUID id, @RequestBody Link updatedLink) {
        Optional<Link> optionalLink = linkRepo.findById(id);
        if (optionalLink.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Link link = optionalLink.get();
        link.setTitle(updatedLink.getTitle());
        link.setUrl(updatedLink.getUrl());
//        link.setIcon(updatedLink.getIcon()); // optional, if using

        linkRepo.save(link);
        return ResponseEntity.ok(link);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLink(@PathVariable UUID id) {
        if (!linkRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        linkRepo.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }

}
