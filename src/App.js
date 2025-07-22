import React, { useState, useEffect } from 'react';
import { Plus, Target, Users, CheckCircle, BarChart3, Eye, Trash2, LogOut, Clock, TrendingUp, DollarSign } from 'lucide-react';

const ProjectTrackerApp = () => {
  const [currentView, setCurrentView] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);

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
        status: 'activo'
      },
      {
        id: '2',
        username: 'gestor1',
        password: 'gestor123',
        name: 'María González',
        email: 'maria.gonzalez@empresa.com',
        role: 'gestor_seguimiento',
        status: 'activo'
      },
      {
        id: '3',
        username: 'pm1',
        password: 'pm123',
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@empresa.com',
        role: 'project_manager',
        status: 'activo'
      }
    ];

    const initialProjects = [
      {
        id: '1',
        name: 'Sistema de Gestión Web',
        status: 'en_progreso',
        createdBy: '3',
        charter: {
          description: 'Desarrollo de plataforma web para gestión empresarial',
          objectives: 'Mejorar eficiencia operativa en 40%',
          scope: 'Módulos de ventas, inventario y reportes',
          duration: '180',
          startDate: '2025-01-01',
          endDate: '2025-06-30'
        },
        milestones: [],
        monthlyBudget: [],
        overallProgress: 45
      }
    ];

    setUsers(initialUsers);
    setProjects(initialProjects);
  }, []);

  const permissions = {
    administrador: {
      canCreateProjects: true,
      canViewAllProjects: true,
      canDeleteProjects: true,
      canManageUsers: true
    },
    gestor_seguimiento: {
      canCreateProjects: false,
      canViewAllProjects: true,
      canDeleteProjects: false,
      canManageUsers: false
    },
    project_manager: {
      canCreateProjects: true,
      canViewAllProjects: false,
      canDeleteProjects: true,
      canManageUsers: false
    }
  };

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    return permissions[currentUser.role]?.[permission] || false;
  };

  const handleLogin = (username, password) => {
    const user = users.find(u => 
      u.username === username && 
      u.password === password &&
      u.status === 'activo'
    );
    
    if (user) {
      setCurrentUser(user);
      setCurrentView('dashboard');
    }
    return !!user;
  };

  const deleteProject = (projectId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
    }
  };

  const createProject = (projectData) => {
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      status: 'planificacion',
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      milestones: [],
      monthlyBudget: [],
      overallProgress: 0
    };
    
    setProjects(prev => [...prev, newProject]);
    setShowCreateProject(false);
  };

  // Componente Login
  const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      if (handleLogin(username, password)) {
        setError('');
      } else {
        setError('Credenciales inválidas');
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
            <p className="text-gray-600">Ingresa tus credenciales</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa tu usuario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa tu contraseña"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Iniciar Sesión
            </button>
          </div>


        </div>
      </div>
    );
  };

  // Componente Header
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

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                currentView === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BarChart3 size={18} />
              Dashboard
            </button>

            {hasPermission('canManageUsers') && (
              <button
                onClick={() => setCurrentView('users')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                  currentView === 'users' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Users size={18} />
                Usuarios
              </button>
            )}

            <div className="flex items-center gap-3 ml-6 pl-6 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">{currentUser?.name}</p>
                <p className="text-xs text-gray-500">{currentUser?.role?.replace('_', ' ')}</p>
              </div>
              <button
                onClick={() => {
                  setCurrentUser(null);
                  setCurrentView('login');
                }}
                className="text-gray-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50"
                title="Cerrar Sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Componente Crear Proyecto
  const CreateProjectModal = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [objectives, setObjectives] = useState('');
    const [scope, setScope] = useState('');
    const [duration, setDuration] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = () => {
      if (!name || !description) {
        alert('Por favor completa los campos requeridos');
        return;
      }

      createProject({
        name,
        charter: {
          description,
          objectives,
          scope,
          duration,
          startDate,
          endDate
        }
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Nuevo Proyecto</h2>
            <p className="text-gray-600">Completa la información del proyecto</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Proyecto *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del proyecto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Descripción del proyecto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Objetivos</label>
              <textarea
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Objetivos del proyecto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alcance</label>
              <textarea
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Alcance del proyecto"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duración (días)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="365"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setShowCreateProject(false)}
                className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Crear Proyecto
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente Dashboard
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
              <p className="text-gray-600">Panel de control y seguimiento</p>
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

          {/* Estadísticas */}
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
                    <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-lg text-gray-800">{project.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === 'completado' ? 'bg-green-100 text-green-800' :
                          project.status === 'en_progreso' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status?.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{project.charter?.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Progreso</span>
                          <span className="font-medium">{project.overallProgress || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{width: `${project.overallProgress || 0}%`}}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Duración: {project.charter?.duration || 0} días</span>
                          <span>Hitos: {project.milestones?.length || 0}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => { setSelectedProject(project); setCurrentView('project'); }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1"
                        >
                          <Eye size={14} />
                          Ver
                        </button>
                        {(hasPermission('canDeleteProjects') || project.createdBy === currentUser.id) && (
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center"
                            title="Eliminar proyecto"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
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

  // Componente Vista de Proyecto
  const ProjectView = () => {
    if (!selectedProject) return null;

    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="text-blue-600 hover:text-blue-800 mb-2"
              >
                ← Volver al Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-800">{selectedProject.name}</h1>
              <p className="text-gray-600">Progreso: {selectedProject.overallProgress || 0}%</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Información del Proyecto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Descripción</h4>
                <p className="text-gray-600">{selectedProject.charter?.description}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Objetivos</h4>
                <p className="text-gray-600">{selectedProject.charter?.objectives}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Alcance</h4>
                <p className="text-gray-600">{selectedProject.charter?.scope}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Duración</h4>
                <p className="text-gray-600">{selectedProject.charter?.duration} días</p>
                <p className="text-sm text-gray-500">
                  {selectedProject.charter?.startDate} - {selectedProject.charter?.endDate}
                </p>
              </div>
            </div>
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
      {currentView === 'users' && (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
          <p className="text-gray-600">Funcionalidad en desarrollo...</p>
        </div>
      )}
      {currentView === 'project' && <ProjectView />}
      {showCreateProject && <CreateProjectModal />}
    </div>
  );
};

export default ProjectTrackerApp;
