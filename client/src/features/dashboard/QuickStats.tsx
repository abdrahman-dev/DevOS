import { FolderKanban, BookOpen, Activity, PauseCircle, CheckCircle, Lightbulb } from 'lucide-react';
import StatCard from '../../components/cards/StatCard';
import { useProjectsStore } from '../../store/projectsStore';
import { useLearningStore } from '../../store/learningStore';

export default function QuickStats() {
  const projects = useProjectsStore((s) => s.projects);
  const learningItems = useLearningStore((s) => s.items);

  const active = projects.filter((p) => p.status === 'active').length;
  const paused = projects.filter((p) => p.status === 'paused').length;
  const completed = projects.filter((p) => p.status === 'completed').length;
  const ideas = projects.filter((p) => p.status === 'idea').length;

  return (
    <div
      className="stat-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
        gap: 12,
      }}
    >
      <StatCard label="Total Projects" value={projects.length} icon={FolderKanban} />
      <StatCard label="Active" value={active} icon={Activity} accent />
      <StatCard label="Paused" value={paused} icon={PauseCircle} />
      <StatCard label="Completed" value={completed} icon={CheckCircle} />
      <StatCard label="Ideas" value={ideas} icon={Lightbulb} />
      <StatCard label="Learning Topics" value={learningItems.length} icon={BookOpen} />
    </div>
  );
}
