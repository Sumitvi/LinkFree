package Linkly.backend.Backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    private String username;

    private String email;
    private String password;
//    private String theme;
    private String avatarUrl;
    private String bio;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Link> links;

    @Column
    private String theme;

    @Column(name = "github")
    private String github;

    @Column(name = "linkedin")
    private String linkedin;

    @Column(name = "instagram")
    private String instagram;

    @Column(name = "twitter")
    private String twitter;

    @Column(name = "button_shape")
    private String buttonShape;

         // "rounded", "square"
    @Column private String buttonSize;
    @Column private String buttonColor;
    @Column private String fontStyle;
    @Column private String backgroundGradient;

    // User.java
    private String logoUrl;
    private String backgroundImageUrl;
    private String customCss;







}
