package Linkly.backend.Backend.repositories;

import Linkly.backend.Backend.entity.ContactSubmission;
import Linkly.backend.Backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContactSubmissionRepository extends JpaRepository<ContactSubmission, Long> {
    List<ContactSubmission> findByUser_Username(String username);
//    Optional<User> findByUsername(String username);

}