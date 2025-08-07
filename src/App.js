import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import LoginComponent from './components/LoginComponent';
import NavigationHeader from './components/NavigationHeader';
import CreateUserModal from './components/CreateUserModal';
import EditUserModal from './components/EditUserModal';
import UsersManagement from './components/UsersManagement';
import ApprovalsCenter from './components/ApprovalsCenter';
import Dashboard from './components/Dashboard';
import CreateProject from './components/CreateProject';
import ProjectView from './components/ProjectView';

const ProjectTrackerApp = () => {
  const [currentView, setCurrentView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
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

    const fetchData = async () => {
      try {
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('*');
        if (usersError) console.error('Error fetching users', usersError);

        let finalUsers;
        if (usersData && usersData.length > 0) {
          const hasAdmin = usersData.some((user) => user.username === 'admin');
          if (!hasAdmin) {
            const adminUser = initialUsers.find(
              (user) => user.username === 'admin'
            );
            if (adminUser) {
              await supabase.from('users').upsert([adminUser]);
              finalUsers = [...usersData, adminUser];
            } else {
              finalUsers = usersData;
            }
          } else {
            finalUsers = usersData;
          }
        } else {
          finalUsers = initialUsers;
        }
        setUsers(finalUsers);

        const { data: projectsData, error: projectsError } = await supabase.from('projects').select('*');
        if (projectsError) console.error('Error fetching projects', projectsError);
        setProjects(projectsData && projectsData.length > 0 ? projectsData : initialProjects);
      } catch (err) {
        console.error('Error loading data from Supabase', err);
        setUsers(initialUsers);
        setProjects(initialProjects);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const syncUsers = async () => {
      if (users.length === 0) return;
      const { error } = await supabase.from('users').upsert(users);
      if (error) console.error('Error saving users', error);
    };

    syncUsers();
  }, [users]);

  useEffect(() => {
    const syncProjects = async () => {
      if (projects.length === 0) return;
      const { error } = await supabase.from('projects').upsert(projects);
      if (error) console.error('Error saving projects', error);
    };

    syncProjects();
  }, [projects]);

  const permissions = {
    administrador: {
      canCreateUsers: true,
      canEditUsers: true,
      canDeleteUsers: true,
      canViewAllUsers: true,
      canApproveProjects: true,
      canApproveMilestones: true,
      canApproveBudgets: true,
      canCreateProjects: true,
      canEditProjects: true,
      canDeleteProjects: true,
      canAddActivities: true,
      canAddBudgets: true,
      canViewAllProjects: true,
      canManageUsers: true
    },
    gestor_seguimiento: {
      canCreateUsers: false,
      canEditUsers: false,
      canDeleteUsers: false,
      canViewAllUsers: false,
      canApproveProjects: true,
      canApproveMilestones: true,
      canApproveBudgets: true,
      canCreateProjects: false,
      canEditProjects: false,
      canDeleteProjects: false,
      canAddActivities: false,
      canAddBudgets: false,
      canViewAllProjects: true,
      canManageUsers: false
    },
    project_manager: {
      canCreateUsers: false,
      canEditUsers: false,
      canDeleteUsers: false,
      canViewAllUsers: false,
      canApproveProjects: false,
      canApproveMilestones: false,
      canApproveBudgets: false,
      canCreateProjects: true,
      canEditProjects: true,
      canDeleteProjects: true,
      canAddActivities: true,
      canAddBudgets: true,
      canViewAllProjects: false,
      canManageUsers: false
    }
  };

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    return permissions[currentUser.role]?.[permission] || false;
  };

  const getPendingApprovalsCount = () => {
    let count = 0;
    projects.forEach(project => {
      if (project.needsApproval && hasPermission('canApproveProjects')) count++;
      
      project.milestones?.forEach(milestone => {
        if (milestone.needsApproval && hasPermission('canApproveMilestones')) count++;
      });
      
      project.monthlyBudget?.forEach(budget => {
        if (budget.needsApproval && hasPermission('canApproveBudgets')) count++;
      });
    });
    return count;
  };

  const createUser = async (userData) => {
    if (userData.role === 'project_manager') {
      const pmCount = users.filter(u => u.role === 'project_manager' && u.status === 'activo').length;
      if (pmCount >= 4) {
        alert('No se pueden crear más de 4 Project Managers');
        return false;
      }
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      status: 'activo',
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id
    };

    const { error } = await supabase.from('users').insert(newUser);
    if (error) {
      console.error('Error creating user', error);
      return false;
    }

    setUsers(prevUsers => [...prevUsers, newUser]);
    return true;
  };

  const updateUser = async (userId, userData) => {
    const { error } = await supabase.from('users').update(userData).eq('id', userId);
    if (error) console.error('Error updating user', error);
    setUsers(prevUsers => prevUsers.map(user =>
      user.id === userId ? { ...user, ...userData } : user
    ));
  };

  const deleteUser = async (userId) => {
    if (userId === currentUser.id) {
      alert('No puedes eliminarte a ti mismo');
      return;
    }

    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      const { error } = await supabase.from('users').delete().eq('id', userId);
      if (error) {
        console.error('Error deleting user', error);
        return;
      }
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    }
  };

  const deleteProject = async (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    if (!hasPermission('canDeleteProjects') && project.createdBy !== currentUser.id) {
      alert('No tienes permisos para eliminar este proyecto');
      return;
    }

    if (window.confirm(`¿Estás seguro de que deseas eliminar el proyecto "${project.name}"? Esta acción no se puede deshacer.`)) {
      const { error } = await supabase.from('projects').delete().eq('id', projectId);
      if (error) {
        console.error('Error deleting project', error);
        return;
      }
      setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
      
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(null);
        setCurrentView('dashboard');
      }
    }
  };

  const calculateProgressMetrics = (project) => {
    const milestoneProgress = project.milestones?.length > 0 
      ? Math.round((project.milestones.filter(m => m.completed && m.approved).length / project.milestones.length) * 100)
      : 0;
    
    const budgetProgress = project.monthlyBudget?.length > 0
      ? Math.round((project.monthlyBudget.reduce((acc, month) => acc + (month.executed || 0), 0) / 
         project.monthlyBudget.reduce((acc, month) => acc + (month.planned || 0), 0)) * 100)
      : 0;

    const timeProgress = project.charter?.startDate && project.charter?.endDate
      ? Math.min(100, Math.round((new Date() - new Date(project.charter.startDate)) / 
          (new Date(project.charter.endDate) - new Date(project.charter.startDate)) * 100))
      : 0;

    return { milestoneProgress, budgetProgress, timeProgress };
  };

  const calculateOverallProgress = (project) => {
    const { milestoneProgress, budgetProgress, timeProgress } = calculateProgressMetrics(project);
    return Math.round((milestoneProgress + budgetProgress + timeProgress) / 3);
  };

  const generateSCurveData = (project) => {
    if (!project.monthlyBudget || project.monthlyBudget.length === 0) return [];
    
    let cumulativePlanned = 0;
    let cumulativeExecuted = 0;
    
    return project.monthlyBudget.map((month, index) => {
      cumulativePlanned += month.planned || 0;
      cumulativeExecuted += month.executed || 0;
      
      return {
        month: `Mes ${index + 1}`,
        planificado: cumulativePlanned,
        ejecutado: cumulativeExecuted
      };
    });
  };


  // Renderizado principal
  if (currentView === 'login') {
    return <LoginComponent />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationHeader />
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'users' && hasPermission('canManageUsers') && <UsersManagement />}
      {currentView === 'approvals' && (hasPermission('canApproveProjects') || hasPermission('canApproveMilestones') || hasPermission('canApproveBudgets')) && <ApprovalsCenter />}
      {currentView === 'project' && <ProjectView />}
      {showCreateProject && <CreateProject />}
      {showCreateUser && <CreateUserModal />}
      {editingUser && <EditUserModal />}
    </div>
  );
};

export default ProjectTrackerApp;
                
