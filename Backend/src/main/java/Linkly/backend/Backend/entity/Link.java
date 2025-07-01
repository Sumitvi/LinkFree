package Linkly.backend.Backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Link {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String title;
    private String url;
    private String type; // link, video, social, tip, affiliate, product
    private boolean isActive;
    private int positionOrder;

    @Column
    private int clickCount;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")

    @JsonIgnoreProperties("links")
    private User user;

    @Column(name = "link_password")
    private String password;

}
