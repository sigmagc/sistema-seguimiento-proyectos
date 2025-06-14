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
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Datos iniciales
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
  }, []);

  // Definición de permisos por rol
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

  // Función para contar aprobaciones pendientes
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

  // Funciones de gestión de usuarios
  const createUser = (userData) => {
    // Validar límite de Project Managers
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

    setUsers([...users, newUser]);
    return true;
  };

  const updateUser = (userId, userData) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, ...userData } : user
    ));
  };

  const deleteUser = (userId) => {
    if (userId === currentUser.id) {
      alert('No puedes eliminarte a ti mismo');
      return;
    }
    
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: 'inactivo' } : user
      ));
    }
  };

  // Funciones auxiliares para cálculos
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

  // Componente: Login
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

          {/* Solo mostrar usuarios de prueba para el administrador después del login */}
          {currentUser?.role === 'administrador' && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2 font-medium">Usuarios de prueba:</p>
              <div className="space-y-1 text-xs text-gray-500">
                <p><strong>Administrador:</strong> admin / admin123</p>
                <p><strong>Gestor Seguimiento:</strong> gestor1 / gestor123</p>
                <p><strong>Project Manager:</strong> pm1 / pm123</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Componente: Header de navegación
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

  // Componente: Crear Usuario
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

      // Validaciones
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

  // Componente: Editar Usuario
  const EditUserModal = () => {
    const [formData, setFormData] = useState({
      username: editingUser?.username || '',
      name: editingUser?.name || '',
      email: editingUser?.email || '',
      role: editingUser?.role || 'project_manager'
    });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      setError('');

      // Validaciones
      if (users.some(u => u.username === formData.username && u.status === 'activo' && u.id !== editingUser.id)) {
        setError('El nombre de usuario ya existe');
        return;
      }

      if (users.some(u => u.email === formData.email && u.status === 'activo' && u.id !== editingUser.id)) {
        setError('El email ya está registrado');
        return;
      }

      updateUser(editingUser.id, formData);
      setShowEditUser(false);
      setEditingUser(null);
    };

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="project_manager">Project Manager</option>
                <option value="gestor_seguimiento">Gestor de Seguimiento</option>
                <option value="administrador">Administrador</option>
              </select>
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
                  setShowEditUser(false);
                  setEditingUser(null);
                  setError('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Actualizar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Componente: Gestión de Usuarios
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
        project_manager: 'bg-green-100 text-green-800'
      };
      return colors[role] || 'bg-gray-100 text-gray-800';
    };

    const handleEditUser = (user) => {
      setEditingUser(user);
      setShowEditUser(true);
    };

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Usuarios</h1>
              <p className="text-gray-600">Administrar usuarios del sistema</p>
            </div>
            {hasPermission('canCreateUsers') && (
              <button
                onClick={() => setShowCreateUser(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-all"
              >
                <UserPlus size={20} />
                Nuevo Usuario
              </button>
            )}
          </div>

          {/* Estadísticas de usuarios */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Usuarios</p>
                  <p className="text-2xl font-bold text-gray-800">{activeUsers.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Shield className="text-red-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Administradores</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {activeUsers.filter(u => u.role === 'administrador').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <UserCheck className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Gestores</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {activeUsers.filter(u => u.role === 'gestor_seguimiento').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Target className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Project Managers</p>
                  <p className="text-2xl font-bold text-gray-800">{pmCount}/4</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de usuarios */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Lista de Usuarios</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activeUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-xs text-gray-400">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                          {getRoleDisplayName(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Activo
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {hasPermission('canEditUsers') && (
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded"
                              title="Editar usuario"
                            >
                              <Edit size={16} />
                            </button>
                          )}
                          {user.id !== currentUser.id && hasPermission('canDeleteUsers') && (
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded"
                              title="Eliminar usuario"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente: Centro de Aprobaciones
  const ApprovalsCenter = () => {
    const pendingProjects = projects.filter(p => p.needsApproval && hasPermission('canApproveProjects'));
    const pendingMilestones = [];
    const pendingBudgets = [];

    // Recopilar hitos pendientes
    projects.forEach(project => {
      project.milestones?.forEach(milestone => {
        if (milestone.needsApproval && hasPermission('canApproveMilestones')) {
          pendingMilestones.push({
            ...milestone,
            projectName: project.name,
            projectId: project.id
          });
        }
      });
    });

    // Recopilar presupuestos pendientes
    projects.forEach(project => {
      project.monthlyBudget?.forEach(budget => {
        if (budget.needsApproval && hasPermission('canApproveBudgets')) {
          pendingBudgets.push({
            ...budget,
            projectName: project.name,
            projectId: project.id
          });
        }
      });
    });

    const approveItem = (type, projectId, itemId) => {
      const updatedProjects = projects.map(project => {
        if (project.id === projectId) {
          const updatedProject = { ...project };
          
          if (type === 'project') {
            updatedProject.needsApproval = false;
            updatedProject.approvedBy = currentUser.id;
            updatedProject.status = 'en_progreso';
          } else if (type === 'milestone') {
            updatedProject.milestones = updatedProject.milestones.map(milestone => 
              milestone.id === itemId 
                ? { ...milestone, needsApproval: false, approved: true, approvedBy: currentUser.id }
                : milestone
            );
          } else if (type === 'budget') {
            updatedProject.monthlyBudget = updatedProject.monthlyBudget.map(budget => 
              budget.id === itemId 
                ? { ...budget, needsApproval: false, approvedBy: currentUser.id }
                : budget
            );
          }
          
          return updatedProject;
        }
        return project;
      });
      
      setProjects(updatedProjects);
    };

    const rejectItem = (type, projectId, itemId) => {
      const updatedProjects = projects.map(project => {
        if (project.id === projectId) {
          const updatedProject = { ...project };
          
          if (type === 'project') {
            updatedProject.needsApproval = false;
            updatedProject.status = 'rechazado';
          } else if (type === 'milestone') {
            updatedProject.milestones = updatedProject.milestones.map(milestone => 
              milestone.id === itemId 
                ? { ...milestone, needsApproval: false, approved: false }
                : milestone
            );
          } else if (type === 'budget') {
            updatedProject.monthlyBudget = updatedProject.monthlyBudget.map(budget => 
              budget.id === itemId 
                ? { ...budget, needsApproval: false }
                : budget
            );
          }
          
          return updatedProject;
        }
        return project;
      });
      
      setProjects(updatedProjects);
    };

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Centro de Aprobaciones</h1>
            <p className="text-gray-600">Gestionar aprobaciones pendientes</p>
          </div>

          {/* Estadísticas de aprobaciones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Target className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Proyectos Pendientes</p>
                  <p className="text-2xl font-bold text-gray-800">{pendingProjects.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Hitos Pendientes</p>
                  <p className="text-2xl font-bold text-gray-800">{pendingMilestones.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <DollarSign className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Presupuestos Pendientes</p>
                  <p className="text-2xl font-bold text-gray-800">{pendingBudgets.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Proyectos pendientes */}
          {pendingProjects.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Proyectos Pendientes de Aprobación</h2>
              </div>
              <div className="p-6 space-y-4">
                {pendingProjects.map(project => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{project.name}</h3>
                        <p className="text-gray-600 text-sm">{project.charter?.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Creado por: {users.find(u => u.id === project.createdBy)?.name}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveItem('project', project.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => rejectItem('project', project.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hitos pendientes */}
          {pendingMilestones.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Hitos Pendientes de Aprobación</h2>
              </div>
              <div className="p-6 space-y-4">
                {pendingMilestones.map(milestone => (
                  <div key={`${milestone.projectId}-${milestone.id}`} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">{milestone.name}</h3>
                        <p className="text-gray-600 text-sm">{milestone.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Proyecto: {milestone.projectName} | Fecha: {milestone.date}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveItem('milestone', milestone.projectId, milestone.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => rejectItem('milestone', milestone.projectId, milestone.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Presupuestos pendientes */}
          {pendingBudgets.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Presupuestos Pendientes de Aprobación</h2>
              </div>
              <div className="p-6 space-y-4">
                {pendingBudgets.map(budget => (
                  <div key={`${budget.projectId}-${budget.id}`} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">{budget.month}</h3>
                        <p className="text-gray-600 text-sm">
                          Planificado: ${budget.planned?.toLocaleString()} | 
                          Ejecutado: ${budget.executed?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Proyecto: {budget.projectName}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveItem('budget', budget.projectId, budget.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => rejectItem('budget', budget.projectId, budget.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sin aprobaciones pendientes */}
          {pendingProjects.length === 0 && pendingMilestones.length === 0 && pendingBudgets.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-12 text-center">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay aprobaciones pendientes</h3>
                <p className="text-gray-600">Todas las solicitudes han sido procesadas</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Componente: Dashboard Principal
  const Dashboard = () => {
    const userProjects = hasPermission('canViewAllProjects') 
      ? projects 
      : projects.filter(p => p.createdBy === currentUser.id);

    return (
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard de Proyectos</h1>
              <p className="text-gray-600">Panel de control y seguimiento integral</p>
            </div>
            {hasPermission('canCreateProjects') && (
              <button
                onClick={() => setShowCreateProject(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg transition-all"
              >
                <Plus size={20} />
                Nuevo Proyecto
              </button>
            )}
          </div>

          {/* Estadísticas Generales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Target className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Proyectos</p>
                  <p className="text-2xl font-bold text-gray-800">{userProjects.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Completados</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {userProjects.filter(p => p.status === 'completado').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Clock className="text-yellow-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">En Progreso</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {userProjects.filter(p => p.status === 'en_progreso').length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <TrendingUp className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Promedio Avance</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {userProjects.length > 0 ? Math.round(userProjects.reduce((acc, p) => acc + (p.overallProgress || 0), 0) / userProjects.length) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Proyectos */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {hasPermission('canViewAllProjects') ? 'Todos los Proyectos' : 'Mis Proyectos'}
              </h2>
            </div>
            <div className="p-6">
              {userProjects.length === 0 ? (
                <div className="text-center py-12">
                  <Target size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">No hay proyectos disponibles</p>
                  {hasPermission('canCreateProjects') && (
                    <button
                      onClick={() => setShowCreateProject(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                      Crear Primer Proyecto
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userProjects.map(project => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                         onClick={() => { setSelectedProject(project); setCurrentView('project'); }}>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-lg text-gray-800">{project.name}</h3>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === 'completado' ? 'bg-green-100 text-green-800' :
                            project.status === 'en_progreso' ? 'bg-blue-100 text-blue-800' :
                            project.status === 'rechazado' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status?.replace('_', ' ').toUpperCase()}
                          </span>
                          {project.needsApproval && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              Pendiente Aprobación
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{project.charter?.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Progreso</span>
                          <span className="font-medium">{project.overallProgress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: `${project.overallProgress || 0}%`}}></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Duración: {project.charter?.duration} días</span>
                          <span>Hitos: {project.milestones?.length || 0}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Creado por: {users.find(u => u.id === project.createdBy)?.name || 'Usuario desconocido'}
                        </div>
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

  // Componente: Crear Proyecto
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
      
      setProjects([...projects, newProject]);
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea
                required
                value={formData.charter.description}
                onChange={(e) => setFormData({...formData, charter: {...formData.charter, description: e.target.value}})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Describe el proyecto..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Objetivos</label>
              <textarea
                required
                value={formData.charter.objectives}
                onChange={(e) => setFormData({...formData, charter: {...formData.charter, objectives: e.target.value}})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Define los objetivos del proyecto..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alcance</label>
              <textarea
                required
                value={formData.charter.scope}
                onChange={(e) => setFormData({...formData, charter: {...formData.charter, scope: e.target.value}})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Define el alcance del proyecto..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duración (días)</label>
                <input
                  type="number"
                  required
                  value={formData.charter.duration}
                  onChange={(e) => setFormData({...formData, charter: {...formData.charter, duration: e.target.value}})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="365"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                <input
                  type="date"
                  required
                  value={formData.charter.startDate}
                  onChange={(e) => setFormData({...formData, charter: {...formData.charter, startDate: e.target.value}})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
                <input
                  type="date"
                  required
                  value={formData.charter.endDate}
                  onChange={(e) => setFormData({...formData, charter: {...formData.charter, endDate: e.target.value}})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateProject(false)}
                className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Crear Proyecto
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Componente: Vista de Proyecto Individual
  const ProjectView = () => {
    const [activeTab, setActiveTab] = useState('overview');

    if (!selectedProject) return null;

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
              >
                ← Volver al Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-800">{selectedProject.name}</h1>
              <p className="text-gray-600">Progreso general: {calculateOverallProgress(selectedProject)}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Estado</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedProject.status === 'completado' ? 'bg-green-100 text-green-800' :
                selectedProject.status === 'en_progreso' ? 'bg-blue-100 text-blue-800' :
                selectedProject.status === 'rechazado' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {selectedProject.status?.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-lg mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex">
                {[
                  { id: 'overview', name: 'Resumen', icon: BarChart3 },
                  { id: 'milestones', name: 'Hitos', icon: CheckCircle },
                  { id: 'budget', name: 'Presupuesto', icon: DollarSign },
                  { id: 'reports', name: 'Reportes', icon: FileText }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium ${
                      activeTab === tab.id
                        ? 'border-b-2 border-blue-500 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon size={20} />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Tab: Resumen */}
              {activeTab === 'overview' && (
                <OverviewTab project={selectedProject} />
              )}

              {/* Tab: Hitos */}
              {activeTab === 'milestones' && (
                <MilestonesTab 
                  project={selectedProject} 
                  onUpdate={(updatedProject) => {
                    const updatedProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
                    setProjects(updatedProjects);
                    setSelectedProject(updatedProject);
                  }}
                />
              )}

              {/* Tab: Presupuesto */}
              {activeTab === 'budget' && (
                <BudgetTab 
                  project={selectedProject} 
                  onUpdate={(updatedProject) => {
                    const updatedProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
                    setProjects(updatedProjects);
                    setSelectedProject(updatedProject);
                  }}
                />
              )}

              {/* Tab: Reportes */}
              {activeTab === 'reports' && (
                <ReportsTab project={selectedProject} />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente: Tab de Resumen
  const OverviewTab = ({ project }) => {
    const { milestoneProgress, budgetProgress, timeProgress } = calculateProgressMetrics(project);
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Progreso de Hitos</h3>
            <p className="text-2xl font-bold text-blue-600">{milestoneProgress}%</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Progreso Presupuestal</h3>
            <p className="text-2xl font-bold text-green-600">{budgetProgress}%</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="font-semibold text-purple-800 mb-2">Progreso Temporal</h3>
            <p className="text-2xl font-bold text-purple-600">{timeProgress}%</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Acta de Constitución</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Descripción</h4>
              <p className="text-gray-600">{project.charter?.description}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Objetivos</h4>
              <p className="text-gray-600">{project.charter?.objectives}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Alcance</h4>
              <p className="text-gray-600">{project.charter?.scope}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Duración</h4>
              <p className="text-gray-600">{project.charter?.duration} días</p>
              <p className="text-sm text-gray-500">
                {project.charter?.startDate} - {project.charter?.endDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente: Tab de Hitos
  const MilestonesTab = ({ project, onUpdate }) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', date: '', description: '' });

    const handleSubmit = (e) => {
      e.preventDefault();
      const updatedProject = { ...project };
      
      if (!updatedProject.milestones) updatedProject.milestones = [];
      
      const newMilestone = {
        id: Date.now().toString(),
        ...formData,
        completed: false,
        approved: false,
        createdBy: currentUser.id,
        needsApproval: currentUser.role === 'project_manager',
        createdAt: new Date().toISOString()
      };
      updatedProject.milestones.push(newMilestone);
      
      onUpdate(updatedProject);
      setShowForm(false);
      setFormData({ name: '', date: '', description: '' });
    };

    const toggleMilestone = (milestoneId, field) => {
      const updatedProject = { ...project };
      const milestone = updatedProject.milestones.find(m => m.id === milestoneId);
      if (milestone) {
        if (field === 'completed') {
          milestone[field] = !milestone[field];
          if (milestone.completed && currentUser.role === 'project_manager') {
            milestone.needsApproval = true;
          }
        } else {
          milestone[field] = !milestone[field];
        }
        onUpdate(updatedProject);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Gestión de Hitos</h3>
          {hasPermission('canAddActivities') && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={16} />
              Agregar Hito
            </button>
          )}
        </div>

        {project.milestones && project.milestones.length > 0 ? (
          <div className="space-y-4">
            {project.milestones.map(milestone => (
              <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{milestone.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                    <p className="text-sm text-gray-500">Fecha: {milestone.date}</p>
                    {milestone.needsApproval && (
                      <span className="inline-block mt-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        Pendiente Aprobación
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    {(hasPermission('canAddActivities') || milestone.createdBy === currentUser.id) && (
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={milestone.completed}
                          onChange={() => toggleMilestone(milestone.id, 'completed')}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">Completado</span>
                      </label>
                    )}
                    <div className="flex items-center gap-2">
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        milestone.approved ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {milestone.approved ? 'Aprobado' : 'No Aprobado'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No hay hitos definidos para este proyecto</p>
          </div>
        )}

        {/* Formulario de Hito */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Nuevo Hito</h3>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del hito"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Descripción del hito"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ name: '', date: '', description: '' });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Crear
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Componente: Tab de Presupuesto
  const BudgetTab = ({ project, onUpdate }) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ month: '', planned: '', executed: '' });

    const handleSubmit = (e) => {
      e.preventDefault();
      const updatedProject = { ...project };
      
      if (!updatedProject.monthlyBudget) updatedProject.monthlyBudget = [];
      
      const newBudgetEntry = {
        id: Date.now().toString(),
        month: formData.month,
        planned: parseFloat(formData.planned) || 0,
        executed: parseFloat(formData.executed) || 0,
        createdBy: currentUser.id,
        needsApproval: currentUser.role === 'project_manager',
        createdAt: new Date().toISOString()
      };
      
      updatedProject.monthlyBudget.push(newBudgetEntry);
      onUpdate(updatedProject);
      setShowForm(false);
      setFormData({ month: '', planned: '', executed: '' });
    };

    const updateBudgetEntry = (entryId, field, value) => {
      const updatedProject = { ...project };
      const entry = updatedProject.monthlyBudget.find(e => e.id === entryId);
      if (entry && (hasPermission('canAddBudgets') || entry.createdBy === currentUser.id)) {
        entry[field] = parseFloat(value) || 0;
        if (currentUser.role === 'project_manager') {
          entry.needsApproval = true;
        }
        onUpdate(updatedProject);
      }
    };

    const totalPlanned = project.monthlyBudget?.reduce((acc, entry) => acc + (entry.planned || 0), 0) || 0;
    const totalExecuted = project.monthlyBudget?.reduce((acc, entry) => acc + (entry.executed || 0), 0) || 0;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Gestión de Presupuesto</h3>
          {hasPermission('canAddBudgets') && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={16} />
              Agregar Mes
            </button>
          )}
        </div>

        {/* Resumen Presupuestal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800">Presupuesto Planificado</h4>
            <p className="text-2xl font-bold text-blue-600">${totalPlanned.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800">Presupuesto Ejecutado</h4>
            <p className="text-2xl font-bold text-green-600">${totalExecuted.toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800">Variación</h4>
            <p className={`text-2xl font-bold ${totalExecuted > totalPlanned ? 'text-red-600' : 'text-green-600'}`}>
              ${(totalExecuted - totalPlanned).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Tabla de Presupuesto */}
        {project.monthlyBudget && project.monthlyBudget.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planificado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ejecutado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% Ejecución</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {project.monthlyBudget.map(entry => (
                  <tr key={entry.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <input
                        type="number"
                        value={entry.planned || ''}
                        onChange={(e) => updateBudgetEntry(entry.id, 'planned', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="0"
                        disabled={!hasPermission('canAddBudgets') && entry.createdBy !== currentUser.id}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <input
                        type="number"
                        value={entry.executed || ''}
                        onChange={(e) => updateBudgetEntry(entry.id, 'executed', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="0"
                        disabled={!hasPermission('canAddBudgets') && entry.createdBy !== currentUser.id}
                      />
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      (entry.executed || 0) > (entry.planned || 0) ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ${((entry.executed || 0) - (entry.planned || 0)).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.planned > 0 ? Math.round((entry.executed / entry.planned) * 100) : 0}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {entry.needsApproval ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                          Pendiente
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Aprobado
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <DollarSign size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No hay datos presupuestales para este proyecto</p>
          </div>
        )}

        {/* Formulario de Presupuesto */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Agregar Mes al Presupuesto</h3>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
                  <input
                    type="text"
                    required
                    value={formData.month}
                    onChange={(e) => setFormData({...formData, month: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enero 2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Presupuesto Planificado</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.planned}
                    onChange={(e) => setFormData({...formData, planned: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Presupuesto Ejecutado</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.executed}
                    onChange={(e) => setFormData({...formData, executed: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ month: '', planned: '', executed: '' });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Agregar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Componente: Tab de Reportes
  const ReportsTab = ({ project }) => {
    const { milestoneProgress, budgetProgress, timeProgress } = calculateProgressMetrics(project);
    
    return (
      <div className="space-y-8">
        {/* Curva S */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Curva S - Progreso del Proyecto</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={generateSCurveData(project)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="planificado" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="Planificado"
                />
                <Line 
                  type="monotone" 
                  dataKey="ejecutado" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Ejecutado"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráficos de Progreso */}
        <div>
          <h3 className="text-lg font-semibold mb-6">Indicadores de Avance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Avance de Hitos',
                progress: milestoneProgress,
                icon: CheckCircle,
                color: 'bg-green-500',
                bgColor: 'bg-green-50',
                iconColor: 'text-green-600'
              },
              {
                title: 'Avance Presupuestal',
                progress: budgetProgress,
                icon: DollarSign,
                color: 'bg-blue-500',
                bgColor: 'bg-blue-50',
                iconColor: 'text-blue-600'
              },
              {
                title: 'Avance Temporal',
                progress: timeProgress,
                icon: Clock,
                color: 'bg-purple-500',
                bgColor: 'bg-purple-50',
                iconColor: 'text-purple-600'
              }
            ].map((metric, index) => (
              <div key={index} className={`${metric.bgColor} rounded-xl p-6 shadow-lg border border-gray-100`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg bg-white shadow-sm`}>
                    <metric.icon className={metric.iconColor} size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{metric.title}</h4>
                    <p className="text-2xl font-bold text-gray-800">{metric.progress}%</p>
                  </div>
                </div>
                
                {/* Barra de Progreso */}
                <div className="relative">
                  <div className="w-full bg-white bg-opacity-70 rounded-full h-6 shadow-inner">
                    <div 
                      className={`${metric.color} h-6 rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2`}
                      style={{width: `${metric.progress}%`}}
                    >
                      {metric.progress > 10 && (
                        <span className="text-white text-xs font-bold">
                          {metric.progress}%
                        </span>
                      )}
                    </div>
                  </div>
                  {metric.progress <= 10 && (
                    <div className="absolute -top-8 text-xs font-bold text-gray-700" style={{left: `${Math.max(metric.progress, 5)}%`}}>
                      {metric.progress}%
                    </div>
                  )}
                </div>
                
                {/* Indicador de estado */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>0%</span>
                    <span className="font-medium">
                      {metric.progress >= 90 ? 'Casi Completo' : 
                       metric.progress >= 70 ? 'Buen Avance' :
                       metric.progress >= 50 ? 'En Progreso' :
                       metric.progress >= 25 ? 'Inicio' : 'Planificación'}
                    </span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Renderizado principal
  if (currentView === 'login') {
    return <LoginComponent />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationHeader />
      {currentView === 'dashboard' && <Dashboard />}
      {currentView === 'users' && <UsersManagement />}
      {currentView === 'approvals' && <ApprovalsCenter />}
      {currentView === 'project' && <ProjectView />}
      {showCreateProject && <CreateProject />}
      {showCreateUser && <CreateUserModal />}
      {showEditUser && <EditUserModal />}
    </div>
  );
};

export default ProjectTrackerApp;