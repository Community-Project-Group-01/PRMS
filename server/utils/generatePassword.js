const generatePassword = async (name, nic, email) => {
    const namePart = name.slice(0, 3).toLowerCase();
    const agePart = String(nic).slice(-2);
    const emailPart = email.slice(0, 3).toLowerCase();
    const randomPart = Math.floor(10 + Math.random() * 90); // 2-digit number
    const rawPassword = `${namePart}${agePart}${emailPart}#${randomPart}`;

    return rawPassword
}

module.exports = { generatePassword }