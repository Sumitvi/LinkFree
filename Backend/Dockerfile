# Use official Java image
FROM openjdk:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy everything from your project into the container
COPY . .

# Give execute permission to mvnw
RUN chmod +x mvnw

# Build the app (skip tests to make build faster)
RUN ./mvnw clean install -DskipTests

# Run the JAR file
CMD ["java", "-jar", "target/*.jar"]
