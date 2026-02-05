export interface Project {
  name: string;
  status: 'On Track' | 'At Risk' | 'Completed' | 'Pending';
  description: string;
  deadline?: string;
}

export interface Person {
  name: string;
  role: string;
  keyContribution?: string;
}

export interface Decision {
  summary: string;
  impact: 'High' | 'Medium' | 'Low';
  dateMade?: string;
}

export interface Task {
  description: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate?: string;
}

export interface SynapseData {
  projects: Project[];
  people: Person[];
  decisions: Decision[];
  tasks: Task[];
}
