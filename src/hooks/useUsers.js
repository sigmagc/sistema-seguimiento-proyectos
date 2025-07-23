import { useState, useEffect } from 'react';

const initialUsers = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Administrador Principal',
    email: 'admin@empresa.com',
    role: 'administrador',
    status: 'activo',
    createdAt: '2025-01-01',
    createdBy: '1'
  },
  {
    id: '2',
    username: 'gestor1',
    password: 'gestor123',
    name: 'María González',
    email: 'maria.gonzalez@empresa.com',
    role: 'gestor_seguimiento',
    status: 'activo',
    createdAt: '2025-01-01',
    createdBy: '1'
  },
  {
    id: '3',
    username: 'pm1',
    password: 'pm123',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@empresa.com',
    role: 'project_manager',
    status: 'activo',
    createdAt: '2025-01-01',
    createdBy: '1'
  }
];

export default function useUsers() {
  const [users, setUsers] = useState(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('users') : null;
      return stored ? JSON.parse(stored) : initialUsers;
    } catch {
      return initialUsers;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  return [users, setUsers];
}
