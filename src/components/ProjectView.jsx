import React from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ProjectView = ({
  selectedProject,
  setCurrentView,
  calculateOverallProgress,
  calculateProgressMetrics,
  generateSCurveData,
}) => {
  if (!selectedProject) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <button onClick={() => setCurrentView('dashboard')} className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2">
              ← Volver al Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-800">{selectedProject.name}</h1>
            <p className="text-gray-600">Progreso general: {calculateOverallProgress(selectedProject)}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Estado</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedProject.status === 'completado'
                  ? 'bg-green-100 text-green-800'
                  : selectedProject.status === 'en_progreso'
                  ? 'bg-blue-100 text-blue-800'
                  : selectedProject.status === 'rechazado'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {selectedProject.status?.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>

        {/* Información del Proyecto */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Información del Proyecto</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Descripción</h3>
                <p className="text-gray-600">{selectedProject.charter?.description}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Objetivos</h3>
                <p className="text-gray-600">{selectedProject.charter?.objectives}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Alcance</h3>
                <p className="text-gray-600">{selectedProject.charter?.scope}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Duración y Fechas</h3>
                <p className="text-gray-600">{selectedProject.charter?.duration} días</p>
                <p className="text-sm text-gray-500">
                  {selectedProject.charter?.startDate} - {selectedProject.charter?.endDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Métricas de Progreso */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {(() => {
            const { milestoneProgress, budgetProgress, timeProgress } = calculateProgressMetrics(selectedProject);

            return [
              { title: 'Progreso de Hitos', progress: milestoneProgress, color: 'bg-blue-50', textColor: 'text-blue-800' },
              { title: 'Progreso Presupuestal', progress: budgetProgress, color: 'bg-green-50', textColor: 'text-green-800' },
              { title: 'Progreso Temporal', progress: timeProgress, color: 'bg-purple-50', textColor: 'text-purple-800' },
            ].map((metric, index) => (
              <div key={index} className={`${metric.color} p-6 rounded-lg`}>
                <h3 className={`font-semibold ${metric.textColor} mb-2`}>{metric.title}</h3>
                <p className={`text-2xl font-bold ${metric.textColor}`}>{metric.progress}%</p>
                <div className="mt-3">
                  <div className="w-full bg-white bg-opacity-70 rounded-full h-2">
                    <div className="bg-current h-2 rounded-full transition-all duration-500" style={{ width: `${metric.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>

        {/* Hitos del Proyecto */}
        {selectedProject.milestones && selectedProject.milestones.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Hitos del Proyecto</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {selectedProject.milestones.map((milestone) => (
                  <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{milestone.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                        <p className="text-sm text-gray-500">Fecha: {milestone.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            milestone.completed && milestone.approved
                              ? 'bg-green-100 text-green-800'
                              : milestone.completed
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {milestone.completed && milestone.approved ? 'Completado' : milestone.completed ? 'Pendiente Aprobación' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Presupuesto del Proyecto */}
        {selectedProject.monthlyBudget && selectedProject.monthlyBudget.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Presupuesto del Proyecto</h2>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Mes</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Planificado</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ejecutado</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Variación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedProject.monthlyBudget.map((budget) => (
                      <tr key={budget.id}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{budget.month}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">${budget.planned?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">${budget.executed?.toLocaleString()}</td>
                        <td className={`px-4 py-3 text-sm font-medium ${budget.executed || 0 > budget.planned || 0 ? 'text-red-600' : 'text-green-600'}`}>${(
                          (budget.executed || 0) - (budget.planned || 0)
                        ).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Curva S */}
        {selectedProject.monthlyBudget && selectedProject.monthlyBudget.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Curva S - Progreso del Proyecto</h2>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={generateSCurveData(selectedProject)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="planificado" stroke="#3B82F6" strokeWidth={3} name="Planificado" />
                  <Line type="monotone" dataKey="ejecutado" stroke="#10B981" strokeWidth={3} name="Ejecutado" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectView;
