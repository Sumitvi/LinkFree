package Linkly.backend.Backend.repositories;

import Linkly.backend.Backend.entity.ShortLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ShortLinkRepository extends JpaRepository<ShortLink, UUID> {
    Optional<ShortLink> findByShortCode(String code);
}
