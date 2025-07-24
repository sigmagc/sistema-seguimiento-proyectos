import React from "react";
import { BarChart3, CheckCircle, LogOut, Target, Users } from "lucide-react";

const NavigationHeader = ({
  currentUser,
  currentView,
  setCurrentView,
  getPendingApprovalsCount,
  hasPermission,
  setCurrentUser,
  setSelectedProject,
}) => (
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

          {(hasPermission('canApproveProjects') ||
            hasPermission('canApproveMilestones') ||
            hasPermission('canApproveBudgets')) && (
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

export default NavigationHeader;
