import React from "react";
import { CheckCircle, Clock, Eye, Plus, Target, TrendingUp, Trash2 } from "lucide-react";

const Dashboard = ({
  projects,
  hasPermission,
  currentUser,
  setShowCreateProject,
  setSelectedProject,
  setCurrentView,
  deleteProject,
  users,
}) => {
  const userProjects = hasPermission('canViewAllProjects') ? projects : projects.filter((p) => p.createdBy === currentUser.id);

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
                  {userProjects.filter((p) => p.status === 'completado').length}
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
                  {userProjects.filter((p) => p.status === 'en_progreso').length}
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
                {userProjects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg text-gray-800">{project.name}</h3>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === 'completado'
                              ? 'bg-green-100 text-green-800'
                              : project.status === 'en_progreso'
                              ? 'bg-blue-100 text-blue-800'
                              : project.status === 'rechazado'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
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
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${project.overallProgress || 0}%` }}></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Duración: {project.charter?.duration} días</span>
                        <span>Hitos: {project.milestones?.length || 0}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Creado por: {users.find((u) => u.id === project.createdBy)?.name || 'Usuario desconocido'}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProject(project);
                          setCurrentView('project');
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1"
                      >
                        <Eye size={14} />
                        Ver
                      </button>
                      {(hasPermission('canDeleteProjects') || project.createdBy === currentUser.id) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteProject(project.id);
                          }}
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

export default Dashboard;
