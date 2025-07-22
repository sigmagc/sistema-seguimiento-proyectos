import React, { useState, useEffect } from 'react';
import { Plus, Calendar, DollarSign, CheckCircle, BarChart3, FileText, TrendingUp, Clock, Target, Users, Settings, LogOut, Eye, Edit, Trash2, Shield, UserCheck, UserPlus, Save, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProjectTrackerApp = () => {
  const [currentView, setCurrentView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Datos iniciales
  useEffect(() => {
    if (users.length === 0) {
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

      const mockProjects = [
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

      setUsers(initialUsers);
      setProjects(mockProjects);
    }
  }, [users.length]);

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

  const createUser = (userData) => {
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
    return true;
  };

  const updateUser = (userId, userData) => {
    setUsers(prevUsers => prevUsers.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    ));
  };

  const deleteUser = (userId) => {
    if (userId === currentUser.id) {
      alert('No puedes eliminarte a ti mismo');
      return;
    }
    
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId ? { ...user, status: 'inactivo' } : user
      ));
    }
  };

  const deleteProject = (projectId) => {
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

  const LoginComponent = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleLogin = (e) => {
      e.preventDefault();
      const user = users.find(u => 
        u.username === credentials.username && 
        u.password === credentials.password &&
        u.status === 'activo'
      );
      
      if (user) {
        setCurrentUser(user);
        setCurrentView('dashboard');
        setError('');
      } else {
        setError('Credenciales inválidas o usuario inactivo');
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="text-blue-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Sistema de Proyectos</h1>
            <p className="text-gray-600">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <input
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingresa tu usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingresa tu contraseña"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  };

  const NavigationHeader = () => (
    <div className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Target className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Sistema de Proyectos</h1>
              <p className="text-sm text-gray-600">Bienvenido, {currentUser?.name}</p>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BarChart3 size={18} />
              Dashboard
            </button>

            {hasPermission('canManageUsers') && (
              <button
                onClick={() => setCurrentView('users')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'users' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Users size={18} />
                Usuarios
              </button>
            )}

            {(hasPermission('canApproveProjects') || hasPermission('canApproveMilestones') || hasPermission('canApproveBudgets')) && (
              <button
                onClick={() => setCurrentView('approvals')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors relative ${
                  currentView === 'approvals' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <CheckCircle size={18} />
                Aprobaciones
                {getPendingApprovalsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getPendingApprovalsCount()}
                  </span>
                )}
              </button>
            )}

            <div className="flex items-center gap-3 ml-6 pl-6 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{currentUser?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{currentUser?.role?.replace('_', ' ')}</p>
              </div>
              <button
                onClick={() => {
                  setCurrentUser(null);
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
                placeholder="Nombre completo del usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="email@empresa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre de usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Contraseña"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="project_manager">Project Manager</option>
                <option value="gestor_seguimiento">Gestor de Seguimiento</option>
              </select>
              {formData.role === 'project_manager' && pmCount >= 4 && (
                <p className="text-xs text-red-600 mt-1">
                  Ya existen 4 Project Managers activos (máximo permitido)
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowCreateUser(false);
                  setFormData({ username: '', password: '', name: '', email: '', role: 'project_manager' });
                  setError('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="email@empresa.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre de usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Contraseña"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={editingUser?.role === 'administrador'}
              >
                {editingUser?.role === 'administrador' && (
                  <option value="administrador">Administrador</option>
                )}
                <option value="project_manager">Project Manager</option>
                <option value="gestor_seguimiento">Gestor de Seguimiento</option>
              </select>
              {formData.role === 'project_manager' && editingUser.role !== 'project_manager' && pmCount >= 4 && (
                <p className="text-xs text-red-600 mt-1">
                  Ya existen 4 Project Managers activos (máximo permitido)
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setEditingUser(null);
                  setError('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={formData.role === 'project_manager' && editingUser.role !== 'project_manager' && pmCount >= 4}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const UsersManagement = () => {
    const activeUsers = users.filter(u => u.status === 'activo');
    const pmCount = activeUsers.filter(u => u.role === 'project_manager').length;

    const getRoleDisplayName = (role) => {
      const names = {
        administrador: 'Administrador',
        gestor_seguimiento: 'Gestor de Seguimiento',
        project_manager: 'Project Manager'
      };
      return names[role] || role;
    };

    const getRoleBadgeColor = (role) => {
      const colors = {
        administrador: 'bg-red-100 text-red-800',
        gestor_seguimiento: 'bg-blue-100 text-blue-800',
