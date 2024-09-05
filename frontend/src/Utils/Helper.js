export const checkValidData = (email, pass) => {
    const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email);
    const isPassValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{5,}$/.test(pass);

    if(!isEmailValid) return "Email not valid";
    if(!isPassValid) return "Password not valid"

    return null;
}
