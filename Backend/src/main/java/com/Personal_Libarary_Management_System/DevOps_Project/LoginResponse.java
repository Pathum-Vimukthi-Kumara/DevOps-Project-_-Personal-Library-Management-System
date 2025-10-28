package com.Personal_Libarary_Management_System.DevOps_Project;

public class LoginResponse {
    private String message;
    private String token;
    private Long userId;
    private String username;

    public LoginResponse(String message) {
        this.message = message;
    }

    public LoginResponse(String message, String token, Long userId, String username) {
        this.message = message;
        this.token = token;
        this.userId = userId;
        this.username = username;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}

