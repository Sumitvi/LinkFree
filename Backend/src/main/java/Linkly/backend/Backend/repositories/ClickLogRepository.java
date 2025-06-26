package Linkly.backend.Backend.repositories;

import Linkly.backend.Backend.entity.ClickLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.UUID;

public interface ClickLogRepository extends JpaRepository<ClickLog, Long> {
    @Query("SELECT COUNT(c) FROM ClickLog c WHERE c.linkId = :linkId AND c.clickedAt >= :from")
    long countClicksSince(@Param("linkId") UUID linkId, @Param("from") LocalDateTime from);
}