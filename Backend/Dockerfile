# ----------- BUILD STAGE -----------
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy all project files into container
COPY . .

# Package the app (skip tests for faster builds)
RUN mvn clean package -DskipTests

# ----------- RUNTIME STAGE -----------
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy the jar built from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Render expects the service to run on port 10000
ENV PORT=10000
EXPOSE 10000

# Start the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
