package Linkly.backend.Backend.controller;

import Linkly.backend.Backend.entity.ContactSubmission;
import Linkly.backend.Backend.entity.User;
import Linkly.backend.Backend.repositories.ContactSubmissionRepository;
import Linkly.backend.Backend.repositories.UserRepository;
import Linkly.backend.Backend.dto.ContactDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/contact")
public class ContactSubmissionController {

    @Autowired
    private ContactSubmissionRepository repo;

    @Autowired
    private UserRepository userRepo;

    @PostMapping
    public ResponseEntity<?> submit(@RequestBody ContactDTO dto) {
        // findByUsername returns Optional<User>, 
        User user = userRepo.findByUsername(dto.username)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        ContactSubmission submission = new ContactSubmission();
        submission.setUser(user);
        submission.setEmail(dto.email);
        submission.setPhone(dto.phone);

        return ResponseEntity.ok(repo.save(submission));
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<ContactSubmission>> getSubmissions(@PathVariable String username) {
        return ResponseEntity.ok(repo.findByUser_Username(username));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
