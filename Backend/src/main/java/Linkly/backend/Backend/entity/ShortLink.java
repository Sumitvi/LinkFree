package Linkly.backend.Backend.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShortLink {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String originalUrl;
    private String shortCode;
    private int visitCount;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
