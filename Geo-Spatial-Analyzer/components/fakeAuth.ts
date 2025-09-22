// src/components/fakeAuth.ts
type User = { username: string; email: string; password: string };

const users: User[] = [];

export const registerUser = (username: string, email: string, password: string) => {
  if (users.find(u => u.username === username || u.email === email)) {
    return { success: false, message: 'User already exists' };
  }
  users.push({ username, email, password });
  return { success: true, message: 'Registration successful' };
};

export const loginUser = (username: string, password: string) => {
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return { success: false, message: 'Invalid credentials' };
  return { success: true, message: 'Login successful' };
};
