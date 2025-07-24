import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const CreateProject = ({ currentUser, setProjects, setShowCreateProject, setSelectedProject, setCurrentView }) => {
  const [formData, setFormData] = useState({
    name: '',
    charter: {
      description: '',
      objectives: '',
      scope: '',
      duration: '',
      startDate: '',
      endDate: '',
    },
  });

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
      overallProgress: 0,
    };

    const { error } = await supabase.from('projects').insert(newProject);
    if (error) {
      console.error('Error creating project', error);
      return;
    }

    setProjects((prevProjects) => [...prevProjects, newProject]);
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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingresa el nombre del proyecto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <textarea
              required
              value={formData.charter.description}
              onChange={(e) => setFormData({ ...formData, charter: { ...formData.charter, description: e.target.value } })}
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
              onChange={(e) => setFormData({ ...formData, charter: { ...formData.charter, objectives: e.target.value } })}
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
              onChange={(e) => setFormData({ ...formData, charter: { ...formData.charter, scope: e.target.value } })}
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
                onChange={(e) => setFormData({ ...formData, charter: { ...formData.charter, duration: e.target.value } })}
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
                onChange={(e) => setFormData({ ...formData, charter: { ...formData.charter, startDate: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
              <input
                type="date"
                required
                value={formData.charter.endDate}
                onChange={(e) => setFormData({ ...formData, charter: { ...formData.charter, endDate: e.target.value } })}
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
            <button type="submit" className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Crear Proyecto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
