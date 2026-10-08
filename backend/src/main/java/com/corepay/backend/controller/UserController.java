package com.corepay.backend.controller;

import com.corepay.backend.dto.*;
import com.corepay.backend.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    String createUser(@RequestBody CreateUserRequest request) {
        return userService.createUser(request);
    }

    @PostMapping("/login")
    String loginUser(@RequestBody LoginRequest request) {

        return userService.loginUser(request);
    }

    @GetMapping
    List<UserResponse> all() {
        return userService.findAllUsers();
    }

    @GetMapping("/{id}")
    UserResponse searchById(@PathVariable UUID id) {
        return userService.findUserById(id);
    }

    @GetMapping("/me")
    UserResponse me() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        UUID userId = UUID.fromString(authentication.getName());

        return userService.findUserById(userId);
    }

    @GetMapping(params = "email")
    UserResponse searchByEmail(@RequestParam String email) {
        return userService.findUserByEmail(email);
    }

    @GetMapping(params = "phone")
    UserResponse searchByPhone(@RequestParam String phone) {
        return userService.findUserByPhone(phone);
    }

    @PatchMapping("/{id}")
    String updateUser(@PathVariable UUID id, @RequestBody UpdateUserRequest request) {
        userService.updateUser(id, request);

        return "User updated successfully";
    }

    @PatchMapping("/{id}/password")
    String changePassword(@PathVariable UUID id, @RequestBody UpdatePasswordRequest request) {
        userService.changePassword(id, request);

        return "Password changed successfully";
    }

    @DeleteMapping("/{id}")
    String deleteById(@PathVariable UUID id, @RequestBody DeleteUserRequest request) {
        userService.deleteUser(id, request);

        return "User deleted successfully";
    }



}