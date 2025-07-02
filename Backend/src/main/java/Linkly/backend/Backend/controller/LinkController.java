package Linkly.backend.Backend.controller;

import Linkly.backend.Backend.entity.ClickLog;
import Linkly.backend.Backend.entity.Link;
import Linkly.backend.Backend.entity.User;
import Linkly.backend.Backend.repositories.ClickLogRepository;
import Linkly.backend.Backend.repositories.LinkRepository;
import Linkly.backend.Backend.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.*;


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

        user.setId(null); 
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
//        link.setIcon(updatedLink.getIcon()); 

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

    @Transactional
    @GetMapping("/redirect/{linkId}")
    public ResponseEntity<Void> redirectTo(@PathVariable UUID linkId) {
        Optional<Link> linkOpt = linkRepo.findById(linkId);
        if (linkOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Link link = linkOpt.get();
        link.setClickCount(link.getClickCount() + 1);
        linkRepo.save(link);

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(link.getUrl()));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    @GetMapping("/{linkId}/analytics/daily")
    public ResponseEntity<Map<String, Long>> getDailyClicks(@PathVariable UUID linkId) {
        LocalDateTime from = LocalDateTime.now().minusDays(28);
        List<Object[]> results = clickRepo.countClicksByDay(linkId, from);

        Map<String, Long> dailyCounts = new LinkedHashMap<>();
        for (Object[] row : results) {
            String day = row[0].toString();
            Long count = (Long) row[1];
            dailyCounts.put(day, count);
        }

        return ResponseEntity.ok(dailyCounts);
    }


    @GetMapping("/analytics/{linkId}/last28days")
    public ResponseEntity<List<DayClick>> getClicksLast28Days(@PathVariable UUID linkId) {
        LocalDateTime from = LocalDateTime.now().minusDays(27).withHour(0).withMinute(0);
        List<Object[]> rawData = clickRepo.countClicksPerDay(linkId, from);

        List<DayClick> results = rawData.stream()
                .map(row -> new DayClick(row[0].toString(), ((Number) row[1]).longValue()))
                .toList();

        return ResponseEntity.ok(results);
    }

    public record DayClick(String date, Long count) {}



    @GetMapping("/clicks-summary/{username}")
    public ResponseEntity<List<Map<String, Object>>> getClicksSummary(@PathVariable String username) {
        List<Link> links = linkRepo.findAllByUser_UsernameOrderByPositionOrder(username);
        List<Map<String, Object>> summary = links.stream().map(link -> {
            Map<String, Object> map = new HashMap<>();
            map.put("title", link.getTitle());
            map.put("clickCount", link.getClickCount());
            return map;
        }).toList();
        return ResponseEntity.ok(summary);
    }


//    @PutMapping("/{id}/qr")
//    public ResponseEntity<?> toggleQrCode(@PathVariable UUID id, @RequestParam boolean enabled) {
//        Optional<Link> linkOptional = linkRepo.findById(id);
//        if (linkOptional.isPresent()) {
//            Link link = linkOptional.get();
//            link.setQrEnabled(enabled);
//            linkRepo.save(link);
//            return ResponseEntity.ok("QR code " + (enabled ? "enabled" : "disabled") + " for link ID: " + id);
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Link not found");
//        }
//    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> setLinkPassword(@PathVariable UUID id, @RequestBody Map<String, String> body) {
        String password = body.get("password");
        return linkRepo.findById(id).map(link -> {
            link.setPassword(password);
            return ResponseEntity.ok(linkRepo.save(link));
        }).orElse(ResponseEntity.notFound().build());
    }


//    @PostMapping("/{id}/verify-password")
//    public ResponseEntity<?> verifyPassword(@PathVariable UUID id, @RequestBody Map<String, String> body) {
//        String entered = body.get("password");
//        return linkRepo.findById(id).map(link -> {
//            if (link.getPassword() != null && link.getPassword().equals(entered)) {
//                return ResponseEntity.ok("Access granted");
//            } else {
//                return ResponseEntity.status(403).body("Invalid password");
//            }
//        }).orElse(ResponseEntity.notFound().build());
//    }


    @PostMapping("/verify-password/{linkId}")
    public ResponseEntity<?> verifyPassword(
            @PathVariable UUID linkId,
            @RequestBody Map<String, String> body
    ) {
        String password = body.get("password");
        Link link = linkRepo.findById(linkId)
                .orElseThrow(() -> new RuntimeException("Link not found"));

        // Debug
        System.out.println("Stored password: [" + link.getPassword() + "]");
        System.out.println("Entered password: [" + password + "]");
        System.out.println("Match: " + link.getPassword().equals(password));

        if (link.getPassword() == null || link.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("This link is not password protected");
        }

        if (!link.getPassword().equals(password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password");
        }

        return ResponseEntity.ok(Map.of("redirectUrl", link.getUrl()));
    }








}
