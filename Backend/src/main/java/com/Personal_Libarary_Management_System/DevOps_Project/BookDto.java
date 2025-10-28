package com.Personal_Libarary_Management_System.DevOps_Project;

import java.time.LocalDateTime;

public class BookDto {
    private Long id;
    private String title;
    private String author;
    private String description;
    private String imagePath;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BookDto() {}

    public BookDto(Long id, String title, String author, String description, String imagePath,
                   LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.description = description;
        this.imagePath = imagePath;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static BookDto fromEntity(Book b) {
        return new BookDto(
            b.getId(),
            b.getTitle(),
            b.getAuthor(),
            b.getDescription(),
            b.getImagePath(),
            b.getCreatedAt(),
            b.getUpdatedAt()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
