FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY target/DevOps_Project-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 4000
ENTRYPOINT ["java","-jar","app.jar"]