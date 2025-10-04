
// NIC validator
export const validateSriLankanNIC = (nic) => {
    const oldNicRegex = /^[0-9]{9}[VXvx]$/;
    const newNicRegex = /^[0-9]{12}$/;

    return oldNicRegex.test(nic) || newNicRegex.test(nic);
}

// Email validator

export const emailValidator = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email)
}

// Password Validator
// (min 8 chars, 1 letter, 1 number)
export const passwordValidator = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    return passwordRegex.test(password)
}

// mobile number validator
export const mobileNumberValidator = (number) => {
    const contactRegex = /^\d{10}$/;

    return contactRegex.test(number)
}

