package org.uni.unitravel.user.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.uni.unitravel.exception.not_found.UserNotFoundException;
import org.uni.unitravel.exception.validation.UserValidationException;
import org.uni.unitravel.user.Role;
import org.uni.unitravel.user.User;
import org.uni.unitravel.user.UserValidator;
import org.uni.unitravel.user.repository.UserRepository;

import java.util.List;


@Service
public class UserService {
    private final UserValidator validator;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final UserValidator userValidator;

    public UserService(UserValidator validator, UserRepository userRepository,
                       UserValidator userValidator) {
        this.validator = validator;
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder(12);
        this.userValidator = userValidator;
    }

    public User addUser(User user) {
        try {
            logger.info("Try to add user");
            userValidator.validate(user);
            User existsUser = getUserByEmail(user.getEmail());
            if (existsUser != null) {
                throw new UserValidationException(
                        "Користувач з поштою '" + existsUser.getEmail() + "' вже існує"
                );
            }

            user.setId(null);
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            int id = userRepository.save(user).getId();
            if (id == -1) {
                throw new UserValidationException("Unable to retrieve the generated key");
            }

            user.setId(id);
            logger.info("User was added:\n{}", user);
            return getUserById(id);

        } catch (UserValidationException | DataAccessException exception) {
            logger.warn("User wasn't added: {}\n{}", user, exception.getMessage());
            throw exception;
        }
    }

    public User getUserById(int id) {
        try {
            logger.info("Try to get user by id");
            User user = userRepository.findById(id).orElse(null);
            if (user == null) {
                throw new UserNotFoundException(String.format("Користувач з id %d не був знайдений", id));
            }
            logger.info("User was fetched successfully");
            return user;
        } catch (UserNotFoundException | DataAccessException exception) {
            logger.warn("User wasn't fetched\n{}", exception.getMessage());
            throw exception;
        }
    }

    public User getUserByEmail(String email) {
        try {
            logger.info("Try to get user by email");
            User user = userRepository.findByEmail(email).orElse(null);
            logger.info("User was fetched by email successfully");
            return user;
        } catch (DataAccessException exception) {
            logger.warn("User wasn't fetched by email\n{}", exception.getMessage());
            throw exception;
        }
    }

    public boolean deleteUserById(int id) {
        try {
            User userToDel = getUserById(id);
            logger.info("Try to delete user");
            validator.validateUserToDelete(userToDel);

            userRepository.deleteById(id);
            logger.info("User was deleted:\n{}", userToDel);
            return true;
        } catch (UserNotFoundException | UserValidationException | DataAccessException exception) {
            logger.warn("User wasn't deleted: {}\n{}", id, exception.getMessage());
            throw exception;
        }
    }

    public User updateUserWithoutPasswordChangeById(User user, int id) {
        try {
            User userToUpdate = getUserById(id);
            logger.info("Try to update user without password change");

            validator.validateUsersForUpdate(userToUpdate, user);

            User existsUser = getUserByEmail(user.getEmail());
            if (existsUser != null && !existsUser.getId().equals(id)) {
                throw new UserValidationException(
                        "Користувач з поштою '" + existsUser.getEmail() + "' вже існує"
                );
            }

            userToUpdate.setName(user.getName());
            userToUpdate.setSurname(user.getSurname());
            userToUpdate.setEmail(user.getEmail());

            userRepository.save(userToUpdate);

            logger.info("User was updated without password change:\n{}", user);
            return getUserById(id);
        } catch (UserNotFoundException | UserValidationException | DataAccessException exception) {
            logger.warn("User wasn't updated without password change: {}\n{}", id, exception.getMessage());
            throw exception;
        }
    }

    public User updateUserById(User user, int id) {
        try {
            User userToUpdate = getUserById(id);
            logger.info("Try to update user");

            validator.validateUsersForUpdate(userToUpdate, user);

            User existsUser = getUserByEmail(user.getEmail());
            if (existsUser != null && !existsUser.getId().equals(id)) {
                throw new UserValidationException(
                        "Користувач з поштою '" + existsUser.getEmail() + "' вже існує"
                );
            }

            userToUpdate.setName(user.getName());
            userToUpdate.setSurname(user.getSurname());
            userToUpdate.setEmail(user.getEmail());
            userToUpdate.setPassword(passwordEncoder.encode(user.getPassword()));

            userRepository.save(userToUpdate);

            logger.info("User was updated:\n{}", user);
            return getUserById(id);
        } catch (UserNotFoundException | UserValidationException | DataAccessException exception) {
            logger.warn("User wasn't updated: {}\n{}", id, exception.getMessage());
            throw exception;
        }
    }

    public List<User> getUsersByRole(Role role) {
        try {
            logger.info("Try to get users by role");
            List<User> users = userRepository.findByRole(role);
            logger.info("Users were fetched by role successfully");
            users.forEach(user -> user.setPassword(null));
            return users;
        } catch (DataAccessException exception) {
            logger.warn("Users weren't fetched by role\n{}", exception.getMessage());
            throw exception;
        }
    }

}
