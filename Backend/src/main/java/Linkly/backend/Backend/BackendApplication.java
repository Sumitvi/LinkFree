package Linkly.backend.Backend;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {

		SpringApplication.run(BackendApplication.class, args);

		System.out.println("DB_URL -> " + System.getenv("DB_URL"));
		System.out.println("DB_USER -> " + System.getenv("DB_USER"));
		System.out.println("DB_PASSWORD -> " + System.getenv("DB_PASSWORD"));
	}


}
