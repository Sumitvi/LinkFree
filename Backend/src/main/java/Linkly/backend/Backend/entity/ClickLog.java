package Linkly.backend.Backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClickLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private UUID linkId;
    private LocalDateTime clickedAt;
    private String deviceInfo;

    public ClickLog(UUID linkId, LocalDateTime clickedAt, String deviceInfo) {
        this.linkId = linkId;
        this.clickedAt = clickedAt;
        this.deviceInfo = deviceInfo;
    }
}
