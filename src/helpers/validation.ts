export const isEmailValid = (email: string) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  return emailRegex.test(email);
};

export const isNameValid = (name: string) => {
  const nameRegex = /^[A-Za-zА-Яа-я\s]+$/i;
  return nameRegex.test(name) && name.length >= 3 && name.length <= 100;
};

export const isPhoneValid = (phone: string) => {
  const phoneRegex = /^[0-9+\s-]+$/;
  return phoneRegex.test(phone);
}