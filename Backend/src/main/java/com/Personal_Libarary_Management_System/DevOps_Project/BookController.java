package com.Personal_Libarary_Management_System.DevOps_Project;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private static final Logger logger = LoggerFactory.getLogger(BookController.class);

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping
    public ResponseEntity<?> addBook(@RequestHeader(value = "Authorization", required = false) String token,
                                   @RequestParam("title") String title,
                                   @RequestParam("author") String author,
                                   @RequestParam(value = "description", required = false) String description,
                                   @RequestParam(value = "image", required = false) MultipartFile image,
                                   @RequestParam(value = "pagesTotal", required = false) Integer pagesTotal,
                                   @RequestParam(value = "pagesRead", required = false) Integer pagesRead) {
        try {
            if (token == null || token.isEmpty()) {
                return ResponseEntity.status(401).body(new ApiResponse("Missing Authorization header"));
            }

            String jwt = token.replace("Bearer ", "");
            if (!jwtUtil.isTokenValid(jwt)) {
                return ResponseEntity.status(401).body(new ApiResponse("Invalid token"));
            }

            Long userId = jwtUtil.extractUserId(jwt);
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(404).body(new ApiResponse("User not found"));
            }

            Book book = new Book();
            book.setTitle(title);
            book.setAuthor(author);
            book.setDescription(description);
            book.setUser(userOpt.get());

            // Pages validation and defaulting
            int total = pagesTotal != null ? pagesTotal : 0;
            int read = pagesRead != null ? pagesRead : 0;
            if (total < 0 || read < 0) {
                return ResponseEntity.badRequest().body(new ApiResponse("pagesTotal and pagesRead must be non-negative"));
            }
            if (read > total) {
                return ResponseEntity.badRequest().body(new ApiResponse("pagesRead cannot exceed pagesTotal"));
            }
            book.setPagesTotal(total);
            book.setPagesRead(read);

            if (image != null && !image.isEmpty()) {
                String imagePath = saveImage(image);
                book.setImagePath(imagePath);
            }

            Book savedBook = bookRepository.save(book);
            return ResponseEntity.ok(BookDto.fromEntity(savedBook));
        } catch (Exception e) {
            logger.error("Error in addBook", e);
            return ResponseEntity.status(500).body(new ApiResponse("Error adding book: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserBooks(@RequestHeader(value = "Authorization", required = false) String token) {
        try {
            if (token == null || token.isEmpty()) {
                return ResponseEntity.status(401).body(new ApiResponse("Missing Authorization header"));
            }

            String jwt = token.replace("Bearer ", "");
            if (!jwtUtil.isTokenValid(jwt)) {
                return ResponseEntity.status(401).body(new ApiResponse("Invalid token"));
            }

            Long userId = jwtUtil.extractUserId(jwt);
            List<Book> books = bookRepository.findByUserId(userId);
            List<BookDto> dtos = books.stream().map(BookDto::fromEntity).toList();
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse("Error fetching books"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBook(@RequestHeader("Authorization") String token,
                                      @PathVariable Long id,
                                      @RequestParam("title") String title,
                                      @RequestParam("author") String author,
                                      @RequestParam(value = "description", required = false) String description,
                                      @RequestParam(value = "image", required = false) MultipartFile image,
                                      @RequestParam(value = "pagesTotal", required = false) Integer pagesTotal,
                                      @RequestParam(value = "pagesRead", required = false) Integer pagesRead) {
    try {
            String jwt = token.replace("Bearer ", "");
            if (!jwtUtil.isTokenValid(jwt)) {
                return ResponseEntity.status(401).body(new ApiResponse("Invalid token"));
            }

            Long userId = jwtUtil.extractUserId(jwt);
            Optional<Book> bookOpt = bookRepository.findById(id);
            
            if (!bookOpt.isPresent()) {
                return ResponseEntity.status(404).body(new ApiResponse("Book not found"));
            }

            Book book = bookOpt.get();
            if (!book.getUser().getId().equals(userId)) {
                return ResponseEntity.status(403).body(new ApiResponse("Access denied"));
            }

            book.setTitle(title);
            book.setAuthor(author);
            book.setDescription(description);

            // Compute new pages values from provided params or existing values
            int existingTotal = book.getPagesTotal() != null ? book.getPagesTotal() : 0;
            int existingRead = book.getPagesRead() != null ? book.getPagesRead() : 0;
            int newTotal = pagesTotal != null ? pagesTotal : existingTotal;
            int newRead = pagesRead != null ? pagesRead : existingRead;
            if (newTotal < 0 || newRead < 0) {
                return ResponseEntity.badRequest().body(new ApiResponse("pagesTotal and pagesRead must be non-negative"));
            }
            if (newRead > newTotal) {
                return ResponseEntity.badRequest().body(new ApiResponse("pagesRead cannot exceed pagesTotal"));
            }
            book.setPagesTotal(newTotal);
            book.setPagesRead(newRead);

            if (image != null && !image.isEmpty()) {
                String imagePath = saveImage(image);
                book.setImagePath(imagePath);
            }

            Book updatedBook = bookRepository.save(book);
            return ResponseEntity.ok(BookDto.fromEntity(updatedBook));
        } catch (Exception e) {
            logger.error("Error in updateBook", e);
            return ResponseEntity.status(500).body(new ApiResponse("Error updating book"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        try {
            String jwt = token.replace("Bearer ", "");
            if (!jwtUtil.isTokenValid(jwt)) {
                return ResponseEntity.status(401).body(new ApiResponse("Invalid token"));
            }

            Long userId = jwtUtil.extractUserId(jwt);
            Optional<Book> bookOpt = bookRepository.findById(id);
            
            if (!bookOpt.isPresent()) {
                return ResponseEntity.status(404).body(new ApiResponse("Book not found"));
            }

            Book book = bookOpt.get();
            if (!book.getUser().getId().equals(userId)) {
                return ResponseEntity.status(403).body(new ApiResponse("Access denied"));
            }

            bookRepository.delete(book);
            return ResponseEntity.ok(new ApiResponse("Book deleted successfully"));
        } catch (Exception e) {
            logger.error("Error in deleteBook", e);
            return ResponseEntity.status(500).body(new ApiResponse("Error deleting book"));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchBooks(@RequestHeader("Authorization") String token,
                                       @RequestParam(required = false) String title,
                                       @RequestParam(required = false) String author) {
        try {
            String jwt = token.replace("Bearer ", "");
            if (!jwtUtil.isTokenValid(jwt)) {
                return ResponseEntity.status(401).body(new ApiResponse("Invalid token"));
            }

            List<Book> books;
            if (title != null && !title.isEmpty()) {
                books = bookRepository.findByTitleContainingIgnoreCase(title);
            } else if (author != null && !author.isEmpty()) {
                books = bookRepository.findByAuthorContainingIgnoreCase(author);
            } else {
                books = bookRepository.findAll();
            }
            // Return DTOs for consistency and to avoid lazy-loading issues
            List<BookDto> dtos = books.stream().map(BookDto::fromEntity).toList();
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse("Error searching books"));
        }
    }

    private String saveImage(MultipartFile image) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);
        Files.copy(image.getInputStream(), filePath);

        return fileName;
    }
}