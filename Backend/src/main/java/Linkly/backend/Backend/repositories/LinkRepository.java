package Linkly.backend.Backend.repositories;

import Linkly.backend.Backend.entity.Link;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LinkRepository extends JpaRepository<Link, UUID> {

    List<Link> findAllByUser_UsernameOrderByPositionOrder(String username);

    List<Link> findAllByUser_UsernameAndIsActiveTrueOrderByPositionOrder(String username);

//    List<Link> findByUserId(UUID userId);
      Optional<Link> findById(UUID id);


}
