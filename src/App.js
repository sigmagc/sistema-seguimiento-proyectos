import React, { useState, useEffect } from 'react';
import { Plus, Calendar, DollarSign, CheckCircle, BarChart3, FileText, TrendingUp, Clock, Target, Users, Settings, LogOut, Eye, Edit, Trash2, Shield, UserCheck, UserPlus, Save, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from './supabaseClient';

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
  // Cargar datos desde Supabase o localStorage
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
    const loadData = async () => {
      const defaultUsers = [
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

      const defaultProjects = [
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

      try {
        const { data: supaUsers, error: usersError } = await supabase.from('users').select('*');
        const { data: supaProjects, error: projectsError } = await supabase.from('projects').select('*');

        const loadedUsers = usersError || !supaUsers ? null : supaUsers;
        const loadedProjects = projectsError || !supaProjects ? null : supaProjects;

        setUsers(loadedUsers ?? JSON.parse(localStorage.getItem('users')) ?? defaultUsers);
        setProjects(loadedProjects ?? JSON.parse(localStorage.getItem('projects')) ?? defaultProjects);
      } catch (err) {
        setUsers(JSON.parse(localStorage.getItem('users')) ?? defaultUsers);
        setProjects(JSON.parse(localStorage.getItem('projects')) ?? defaultProjects);
      }
    ];
    };

    setUsers(initialUsers);
    setProjects(initialProjects);
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
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
@@ -152,106 +176,131 @@ const ProjectTrackerApp = () => {
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

  const createUser = (userData) => {
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

    setUsers(prevUsers => [...prevUsers, newUser]);

    try {
      await supabase.from('users').insert([newUser]);
    } catch (err) {
      console.error('Error saving user to Supabase', err);
    }

    return true;
  };

  const updateUser = (userId, userData) => {
    setUsers(prevUsers => prevUsers.map(user => 
  const updateUser = async (userId, userData) => {
    setUsers(prevUsers => prevUsers.map(user =>
      user.id === userId ? { ...user, ...userData } : user
    ));

    try {
      await supabase.from('users').update(userData).eq('id', userId);
    } catch (err) {
      console.error('Error updating user in Supabase', err);
    }
  };

  const deleteUser = (userId) => {
  const deleteUser = async (userId) => {
    if (userId === currentUser.id) {
      alert('No puedes eliminarte a ti mismo');
      return;
    }
    
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      setUsers(prevUsers => prevUsers.map(user => 
      setUsers(prevUsers => prevUsers.map(user =>
        user.id === userId ? { ...user, status: 'inactivo' } : user
      ));

      try {
        await supabase.from('users').update({ status: 'inactivo' }).eq('id', userId);
      } catch (err) {
        console.error('Error deleting user in Supabase', err);
      }
    }
  };

  const deleteProject = (projectId) => {
  const deleteProject = async (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    if (!hasPermission('canDeleteProjects') && project.createdBy !== currentUser.id) {
      alert('No tienes permisos para eliminar este proyecto');
      return;
    }

    if (window.confirm(`¿Estás seguro de que deseas eliminar el proyecto "${project.name}"? Esta acción no se puede deshacer.`)) {
      setProjects(prevProjects => prevProjects.filter(p => p.id !== projectId));
      

      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(null);
        setCurrentView('dashboard');
      }

      try {
        await supabase.from('projects').delete().eq('id', projectId);
      } catch (err) {
        console.error('Error deleting project in Supabase', err);
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
@@ -414,65 +463,65 @@ const ProjectTrackerApp = () => {
                  setCurrentView('login');
                  setSelectedProject(null);
                }}
                className="text-gray-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );

  const CreateUserModal = () => {
    const [formData, setFormData] = useState({
      username: '',
      password: '',
      name: '',
      email: '',
      role: 'project_manager'
    });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');

      if (users.some(u => u.username === formData.username && u.status === 'activo')) {
        setError('El nombre de usuario ya existe');
        return;
      }

      if (users.some(u => u.email === formData.email && u.status === 'activo')) {
        setError('El email ya está registrado');
        return;
      }

      if (createUser(formData)) {
      if (await createUser(formData)) {
        setShowCreateUser(false);
        setFormData({ username: '', password: '', name: '', email: '', role: 'project_manager' });
        setError('');
        alert(`Usuario "${formData.name}" creado exitosamente`);
      }
    };

    const pmCount = users.filter(u => u.role === 'project_manager' && u.status === 'activo').length;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Crear Nuevo Usuario</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
@@ -553,75 +602,75 @@ const ProjectTrackerApp = () => {
              </button>
              <button
                type="submit"
                disabled={formData.role === 'project_manager' && pmCount >= 4}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Crear Usuario
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const EditUserModal = () => {
    const [formData, setFormData] = useState({
      name: editingUser?.name || '',
      email: editingUser?.email || '',
      username: editingUser?.username || '',
      password: editingUser?.password || '',
      role: editingUser?.role || 'project_manager'
    });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');

      const existingUser = users.find(u => u.username === formData.username && u.id !== editingUser.id && u.status === 'activo');
      if (existingUser) {
        setError('El nombre de usuario ya existe');
        return;
      }

      const existingEmail = users.find(u => u.email === formData.email && u.id !== editingUser.id && u.status === 'activo');
      if (existingEmail) {
        setError('El email ya está registrado');
        return;
      }

      if (formData.role === 'project_manager' && editingUser.role !== 'project_manager') {
        const pmCount = users.filter(u => u.role === 'project_manager' && u.status === 'activo').length;
        if (pmCount >= 4) {
          setError('No se pueden tener más de 4 Project Managers');
          return;
        }
      }

      updateUser(editingUser.id, formData);
      await updateUser(editingUser.id, formData);
      setEditingUser(null);
      setError('');
      alert(`Usuario "${formData.name}" actualizado exitosamente`);
    };

    const pmCount = users.filter(u => u.role === 'project_manager' && u.status === 'activo').length;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Editar Usuario</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre completo del usuario"
              />
@@ -1251,65 +1300,71 @@ const ProjectTrackerApp = () => {
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CreateProject = () => {
    const [formData, setFormData] = useState({
      name: '',
      charter: {
        description: '',
        objectives: '',
        scope: '',
        duration: '',
        startDate: '',
        endDate: ''
      }
    });

    const handleSubmit = (e) => {
    const handleSubmit = async (e) => {
      e.preventDefault();
      const newProject = {
        id: Date.now().toString(),
        ...formData,
        status: 'planificacion',
        createdAt: new Date().toISOString(),
        createdBy: currentUser.id,
        needsApproval: currentUser.role === 'project_manager',
        milestones: [],
        monthlyBudget: [],
        overallProgress: 0
      };
      
      setProjects(prevProjects => [...prevProjects, newProject]);

      try {
        await supabase.from('projects').insert([newProject]);
      } catch (err) {
        console.error('Error saving project to Supabase', err);
      }
      setShowCreateProject(false);
      setSelectedProject(newProject);
      setCurrentView('project');
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Nuevo Proyecto</h2>
            <p className="text-gray-600">Acta de Constitución del Proyecto</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Proyecto</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingresa el nombre del proyecto"
              />
            </div>
