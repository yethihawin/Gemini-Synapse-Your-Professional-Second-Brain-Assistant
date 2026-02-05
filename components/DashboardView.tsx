import React from 'react';
import { SynapseData } from '../types';
import { 
  Briefcase, 
  Users, 
  Gavel, 
  CheckSquare, 
  Calendar,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface DashboardViewProps {
  data: SynapseData;
}

const DashboardView: React.FC<DashboardViewProps> = ({ data }) => {
  
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'on track': return 'bg-green-50 text-green-700 border-green-200';
      case 'at risk': return 'bg-red-50 text-red-700 border-red-200';
      case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
      
      {/* Projects Section */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-indigo-700 border-b border-indigo-100 pb-2">
          <Briefcase className="w-5 h-5" />
          <h2 className="text-lg font-bold">Projects</h2>
          <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full font-medium">
            {data.projects.length}
          </span>
        </div>
        <div className="grid gap-3">
          {data.projects.length === 0 && <p className="text-slate-400 text-sm italic">No projects found.</p>}
          {data.projects.map((proj, idx) => (
            <div key={idx} className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-slate-800">{proj.name}</h3>
                <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold border ${getStatusColor(proj.status)}`}>
                  {proj.status}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-3">{proj.description}</p>
              {proj.deadline && (
                <div className="flex items-center text-xs text-slate-400">
                  <Clock className="w-3 h-3 mr-1" />
                  Due: {proj.deadline}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Tasks Section */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-emerald-700 border-b border-emerald-100 pb-2">
          <CheckSquare className="w-5 h-5" />
          <h2 className="text-lg font-bold">Tasks</h2>
          <span className="bg-emerald-100 text-emerald-600 text-xs px-2 py-0.5 rounded-full font-medium">
            {data.tasks.length}
          </span>
        </div>
        <div className="grid gap-3">
          {data.tasks.length === 0 && <p className="text-slate-400 text-sm italic">No tasks found.</p>}
          {data.tasks.map((task, idx) => (
            <div key={idx} className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-slate-800 leading-snug">{task.description}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded border ml-2 ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-50">
                <div className="flex items-center text-slate-500">
                   <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 mr-2">
                     {task.assignee.charAt(0)}
                   </div>
                   {task.assignee}
                </div>
                {task.dueDate && (
                  <div className="flex items-center text-slate-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {task.dueDate}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Decisions Section */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-amber-700 border-b border-amber-100 pb-2">
          <Gavel className="w-5 h-5" />
          <h2 className="text-lg font-bold">Decisions</h2>
          <span className="bg-amber-100 text-amber-600 text-xs px-2 py-0.5 rounded-full font-medium">
            {data.decisions.length}
          </span>
        </div>
        <div className="grid gap-3">
          {data.decisions.length === 0 && <p className="text-slate-400 text-sm italic">No decisions found.</p>}
          {data.decisions.map((dec, idx) => (
            <div key={idx} className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl shadow-sm">
              <div className="flex gap-3">
                <div className="mt-1">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{dec.summary}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="text-xs text-slate-500 font-medium">Impact: <span className="text-slate-800">{dec.impact}</span></span>
                    {dec.dateMade && <span className="text-xs text-slate-400">Date: {dec.dateMade}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* People Section */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2 text-blue-700 border-b border-blue-100 pb-2">
          <Users className="w-5 h-5" />
          <h2 className="text-lg font-bold">People</h2>
          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium">
            {data.people.length}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.people.length === 0 && <p className="text-slate-400 text-sm italic">No people extracted.</p>}
          {data.people.map((person, idx) => (
            <div key={idx} className="bg-white border border-slate-100 p-3 rounded-xl shadow-sm flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-white shadow-sm">
                {person.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-sm font-semibold text-slate-800 truncate">{person.name}</h3>
                <p className="text-xs text-slate-500 truncate">{person.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default DashboardView;