import { useState, useEffect } from 'react';

const initialProjects = [
  {
    id: '1',
    name: 'Sistema de Gestión Web',
    status: 'en_progreso',
    createdBy: '3',
    approvedBy: '2',
    needsApproval: false,
    charter: {
      description: 'Desarrollo de plataforma web para gestión empresarial',
      objectives: 'Mejorar eficiencia operativa en 40%',
      scope: 'Módulos de ventas, inventario y reportes',
      duration: '180',
      startDate: '2025-01-01',
      endDate: '2025-06-30'
    },
    milestones: [
      {
        id: '1',
        name: 'Análisis de Requisitos',
        date: '2025-02-15',
        description: 'Definición completa de requisitos',
        completed: true,
        approved: true,
        createdBy: '3',
        approvedBy: '2',
        needsApproval: false
      },
      {
        id: '2',
        name: 'Diseño de Base de Datos',
        date: '2025-03-15',
        description: 'Modelo de datos final',
        completed: true,
        approved: false,
        createdBy: '3',
        approvedBy: null,
        needsApproval: true
      }
    ],
    monthlyBudget: [
      { id: '1', month: 'Enero 2025', planned: 15000, executed: 14500, createdBy: '3', approvedBy: '2', needsApproval: false },
      { id: '2', month: 'Febrero 2025', planned: 20000, executed: 18200, createdBy: '3', approvedBy: null, needsApproval: true }
    ],
    overallProgress: 45
  }
];

export default function useProjects() {
  const [projects, setProjects] = useState(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('projects') : null;
      return stored ? JSON.parse(stored) : initialProjects;
    } catch {
      return initialProjects;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('projects', JSON.stringify(projects));
    }
  }, [projects]);

  return [projects, setProjects];
}
