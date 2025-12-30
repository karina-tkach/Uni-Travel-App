package org.uni.unitravel.user;

import org.springframework.stereotype.Component;
import org.uni.unitravel.exception.validation.UserValidationException;

import java.util.regex.Pattern;

@Component
@SuppressWarnings({"java:S1192", "java:S5998"})
public class UserValidator {
    public void validate(User user) {
        validateUserIsNotNull(user);
        validateName(user.getName(), "Ім'я");
        validateName(user.getSurname(), "Прізвище");
        validatePassword(user.getPassword());
        validateEmail(user.getEmail());
        validateRole(user.getRole());
    }

    public void validateUserToDelete(User user) {
        validateRole(user.getRole());
        if (user.getRole() == Role.ADMIN) {
            throw new UserValidationException("Користувач має роль 'ADMIN'");
        }
    }

    public void validateUsersForUpdate(User userToUpdate, User user) {
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            user.setPassword("User1234!");
        }


        if(user.getName() == null) {
            user.setName(userToUpdate.getName());
        }
        if(user.getEmail() == null) {
            user.setEmail(userToUpdate.getEmail());
        }
        if(user.getRole() == null) {
            user.setRole(userToUpdate.getRole());
        }

        validate(user);
    }

    private void validateUserIsNotNull(User user) {
        if (user == null) {
            throw new UserValidationException("Користувач відсутній");
        }
    }

    private void validateRole(Role role) {
        if (role == null) {
            throw new UserValidationException("Роль користувача відсутня");
        }
    }

    private void validateName(String name, String fieldName) {
        if (name == null) {
            throw new UserValidationException(fieldName + " користувача відсутнє");
        }
        if (name.isBlank()) {
            throw new UserValidationException(fieldName + " користувача порожнє");
        }
        if (name.length() > 30 || name.length() < 2) {
            throw new UserValidationException(fieldName + " користувача має неправильну довжину (має бути від 2 до 30 символів)");
        }
        Pattern pattern = Pattern.compile("^[A-ZА-ЯЄЇҐІ][a-zа-яєґії]+(?: [A-ZА-ЯҐЄЇІ][a-zа-яєґїі]*)?$");
        if (!pattern.matcher(name).find()) {
            throw new UserValidationException(fieldName + " користувача має неправильні символи");
        }
    }

    private void validateEmail(String email) {
        if (email == null) {
            throw new UserValidationException("Пошта відсутня");
        }
        if (email.isBlank()) {
            throw new UserValidationException("Пошта порожня");
        }
        validateEmailHasProperStructure(email);
    }

    private void validatePassword(String password) {
        if (password == null) {
            throw new UserValidationException("Пароль відсутній");
        }
        if (password.isBlank()) {
            throw new UserValidationException("Пароль порожній");
        }
        if (password.length() > 20 || password.length() < 8) {
            throw new UserValidationException("Пароль має бути від 8 до 20 символів");
        }
        if (!validateSymbols(password)) {
            throw new UserValidationException("Пароль має містити 1 велику літеру, 1 малу літеру, 1 цифру та 1 спеціальний символ");
        }
    }

    private boolean validateSymbols(String str) {
        int upperCase = 0;
        int lowerCase = 0;
        int digits = 0;
        int specialSymbols = 0;
        for (char symbol : str.toCharArray()) {
            if (symbol >= 'A' && symbol <= 'Z') {
                upperCase++;
            } else if (symbol >= 'a' && symbol <= 'z') {
                lowerCase++;
            } else if (symbol >= '0' && symbol <= '9') {
                digits++;
            }
            else if (symbol == '!' || symbol == '@' || symbol == '#' || symbol == '$' ||
                    symbol == '%' || symbol == '^' || symbol == '&' || symbol == '*') {
                specialSymbols++;
            }
        }
        return upperCase != 0
            && lowerCase != 0
            && digits != 0
            && specialSymbols != 0;
    }

    private void validateEmailHasProperStructure(String email) {
        Pattern characters = Pattern.compile("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
        if (!characters.matcher(email).find()) {
            throw new UserValidationException("Пошта має неправильну структуру");
        }
    }
}
