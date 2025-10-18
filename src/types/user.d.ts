export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'parent' | 'instructor' | 'admin';
  createdAt: string;
  updatedAt: string;
}
