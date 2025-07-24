import React from "react";
import { Edit, Shield, Trash2, UserCheck, UserPlus, Users } from "lucide-react";

const UsersManagement = ({
  users,
  hasPermission,
  setShowCreateUser,
  setEditingUser,
  deleteUser,
  currentUser,
}) => {
  const activeUsers = users.filter((u) => u.status === 'activo');
  const pmCount = activeUsers.filter((u) => u.role === 'project_manager').length;

  const getRoleDisplayName = (role) => {
    const names = {
      administrador: 'Administrador',
      gestor_seguimiento: 'Gestor de Seguimiento',
      project_manager: 'Project Manager',
    };
    return names[role] || role;
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      administrador: 'bg-red-100 text-red-800',
      gestor_seguimiento: 'bg-blue-100 text-blue-800',
      project_manager: 'bg-green-100 text-green-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
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
                  {activeUsers.filter((u) => u.role === 'administrador').length}
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
                  {activeUsers.filter((u) => u.role === 'gestor_seguimiento').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="text-green-600" size={24} />
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
                {activeUsers.map((user) => (
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
                            onClick={() => setEditingUser(user)}
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

export default UsersManagement;
