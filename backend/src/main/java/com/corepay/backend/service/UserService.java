package com.corepay.backend.service;

import com.corepay.backend.dto.*;
import com.corepay.backend.exception.InvalidCredentialException;
import com.corepay.backend.exception.UserAlreadyExistsException;
import com.corepay.backend.exception.UserNotFoundException;
import com.corepay.backend.repository.UserRepository;
import com.corepay.backend.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository,  PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;

    }

    public String loginUser(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UserNotFoundException(request.getEmail()));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialException("Username or password is incorrect");
        }

        return jwtService.generateToken(user);
    }

    public String createUser(CreateUserRequest request) {

        Optional<User> existingUser = userRepository.findByEmailOrPhoneNumber(request.getEmail(), request.getPhoneNumber());

        if (existingUser.isPresent()) {
            throw new UserAlreadyExistsException(request.getEmail(), request.getPhoneNumber());
        }
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getFirstName(), request.getLastName(), request.getEmail(), request.getPhoneNumber(), hashedPassword);
        userRepository.save(user);

        return jwtService.generateToken(user);
    }

    public List<UserResponse> findAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(UserResponse::new)
                .toList();
    }

    public UserResponse findUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        return new UserResponse(user);
    }

    public UserResponse findUserByEmail(String email) {

        User user =  userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));

        return new UserResponse(user);
    }

    public UserResponse findUserByPhone(String phone) {
        User user = userRepository.findByPhoneNumber(phone)
                .orElseThrow(() -> new UserNotFoundException(phone));

        return new UserResponse(user);
    }

    public void updateUser(UUID id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }

        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }

        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }

        userRepository.save(user);
    }

    public void changePassword(UUID id, UpdatePasswordRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isPasswordCorrect = passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash());

        if (isPasswordCorrect) {
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
        }
    }

    public void deleteUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        userRepository.delete(user);
    }
}