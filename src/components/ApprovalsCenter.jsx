import React from "react";
import { CheckCircle, DollarSign, Target } from "lucide-react";

const ApprovalsCenter = ({ projects, hasPermission, users, setProjects, currentUser }) => {
  const pendingProjects = projects.filter((p) => p.needsApproval && hasPermission('canApproveProjects'));
  const pendingMilestones = [];
  const pendingBudgets = [];

  projects.forEach((project) => {
    project.milestones?.forEach((milestone) => {
      if (milestone.needsApproval && hasPermission('canApproveMilestones')) {
        pendingMilestones.push({ ...milestone, projectName: project.name, projectId: project.id });
      }
    });
  });

  projects.forEach((project) => {
    project.monthlyBudget?.forEach((budget) => {
      if (budget.needsApproval && hasPermission('canApproveBudgets')) {
        pendingBudgets.push({ ...budget, projectName: project.name, projectId: project.id });
      }
    });
  });

  const approveItem = (type, projectId, itemId = null) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          const updatedProject = { ...project };

          if (type === 'project') {
            updatedProject.needsApproval = false;
            updatedProject.approvedBy = currentUser.id;
            updatedProject.status = 'en_progreso';
          } else if (type === 'milestone') {
            updatedProject.milestones = updatedProject.milestones.map((milestone) =>
              milestone.id === itemId ? { ...milestone, needsApproval: false, approved: true, approvedBy: currentUser.id } : milestone
            );
          } else if (type === 'budget') {
            updatedProject.monthlyBudget = updatedProject.monthlyBudget.map((budget) =>
              budget.id === itemId ? { ...budget, needsApproval: false, approvedBy: currentUser.id } : budget
            );
          }

          return updatedProject;
        }
        return project;
      })
    );
  };

  const rejectItem = (type, projectId, itemId = null) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) => {
        if (project.id === projectId) {
          const updatedProject = { ...project };

          if (type === 'project') {
            updatedProject.needsApproval = false;
            updatedProject.status = 'rechazado';
          } else if (type === 'milestone') {
            updatedProject.milestones = updatedProject.milestones.map((milestone) =>
              milestone.id === itemId ? { ...milestone, needsApproval: false, approved: false } : milestone
            );
          } else if (type === 'budget') {
            updatedProject.monthlyBudget = updatedProject.monthlyBudget.map((budget) =>
              budget.id === itemId ? { ...budget, needsApproval: false } : budget
            );
          }

          return updatedProject;
        }
        return project;
      })
    );
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
              {pendingProjects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{project.name}</h3>
                      <p className="text-gray-600 text-sm">{project.charter?.description}</p>
                      <p className="text-xs text-gray-500">Creado por: {users.find((u) => u.id === project.createdBy)?.name}</p>
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

export default ApprovalsCenter;
