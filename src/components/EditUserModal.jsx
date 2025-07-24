import React, { useState } from "react";

const EditUserModal = ({ users, editingUser, setEditingUser, updateUser }) => {
  const [formData, setFormData] = useState({
    name: editingUser?.name || '',
    email: editingUser?.email || '',
    username: editingUser?.username || '',
    password: editingUser?.password || '',
    role: editingUser?.role || 'project_manager',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const existingUser = users.find(
      (u) => u.username === formData.username && u.id !== editingUser.id && u.status === 'activo'
    );
    if (existingUser) {
      setError('El nombre de usuario ya existe');
      return;
    }

    const existingEmail = users.find(
      (u) => u.email === formData.email && u.id !== editingUser.id && u.status === 'activo'
    );
    if (existingEmail) {
      setError('El email ya está registrado');
      return;
    }

    if (formData.role === 'project_manager' && editingUser.role !== 'project_manager') {
      const pmCount = users.filter((u) => u.role === 'project_manager' && u.status === 'activo').length;
      if (pmCount >= 4) {
        setError('No se pueden tener más de 4 Project Managers');
        return;
      }
    }

    await updateUser(editingUser.id, formData);
    setEditingUser(null);
    setError('');
    alert(`Usuario "${formData.name}" actualizado exitosamente`);
  };

  const pmCount = users.filter((u) => u.role === 'project_manager' && u.status === 'activo').length;

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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Contraseña"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={editingUser?.role === 'administrador'}
            >
              {editingUser?.role === 'administrador' && <option value="administrador">Administrador</option>}
              <option value="project_manager">Project Manager</option>
              <option value="gestor_seguimiento">Gestor de Seguimiento</option>
            </select>
            {formData.role === 'project_manager' && editingUser.role !== 'project_manager' && pmCount >= 4 && (
              <p className="text-xs text-red-600 mt-1">Ya existen 4 Project Managers activos (máximo permitido)</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
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

export default EditUserModal;
