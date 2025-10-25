import { useState } from 'react';
import { schedulerApi, type SchedulerTask, type ScheduleRequest, type EnhancedScheduleResponse } from '../services/api';

interface SmartSchedulerProps {
  projectId: number;
  onClose: () => void;
}

export default function SmartScheduler({ projectId, onClose }: SmartSchedulerProps) {
  const [tasks, setTasks] = useState<SchedulerTask[]>([
    { title: '', estimatedHours: 4, dueDate: '', dependencies: [] }
  ]);
  const [workHoursPerDay, setWorkHoursPerDay] = useState(8);
  const [schedule, setSchedule] = useState<EnhancedScheduleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addTask = () => {
    setTasks([...tasks, { title: '', estimatedHours: 4, dueDate: '', dependencies: [] }]);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const updateTask = (index: number, field: keyof SchedulerTask, value: any) => {
    const updatedTasks = [...tasks];
    if (field === 'dependencies') {
      updatedTasks[index][field] = value.split(',').map((dep: string) => dep.trim()).filter((dep: string) => dep);
    } else {
      (updatedTasks[index] as any)[field] = value;
    }
    setTasks(updatedTasks);
  };

  const generateSchedule = async () => {
    setLoading(true);
    setError('');
    
    try {
      const validTasks = tasks.filter(task => task.title.trim());
      
      if (validTasks.length === 0) {
        setError('Please add at least one task with a title');
        return;
      }

      const request: ScheduleRequest = {
        tasks: validTasks,
        workHoursPerDay
      };

      const response = await schedulerApi.generateSchedule(projectId, request);
      setSchedule(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate schedule');
    } finally {
      setLoading(false);
    }
  };

  const getQuickRecommendations = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await schedulerApi.getRecommendations(projectId);
      setSchedule(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Smart Task Scheduler</h2>
        <button onClick={onClose} className="btn btn-gray">✕</button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={getQuickRecommendations}
            className="btn btn-blue"
            disabled={loading}
          >
            📋 Quick Schedule (Existing Tasks)
          </button>
          <div className="flex items-center gap-2">
            <label className="form-label">Work Hours/Day:</label>
            <input
              type="number"
              min="1"
              max="12"
              value={workHoursPerDay}
              onChange={(e) => setWorkHoursPerDay(Number(e.target.value))}
              className="form-input w-20"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">📝 Custom Task Planning</h3>
        
        {tasks.map((task, index) => (
          <div key={index} className="task-item mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="form-label">Task Title *</label>
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => updateTask(index, 'title', e.target.value)}
                  className="form-input"
                  placeholder="e.g., Design API"
                />
              </div>
              
              <div>
                <label className="form-label">Estimated Hours</label>
                <input
                  type="number"
                  min="0.5"
                  max="100"
                  step="0.5"
                  value={task.estimatedHours}
                  onChange={(e) => updateTask(index, 'estimatedHours', Number(e.target.value))}
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  value={task.dueDate}
                  onChange={(e) => updateTask(index, 'dueDate', e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="form-label">Dependencies</label>
                <input
                  type="text"
                  value={task.dependencies.join(', ')}
                  onChange={(e) => updateTask(index, 'dependencies', e.target.value)}
                  className="form-input"
                  placeholder="Task1, Task2"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-2">
              <button
                onClick={() => removeTask(index)}
                className="btn btn-red"
                disabled={tasks.length === 1}
              >
                🗑️ Remove
              </button>
            </div>
          </div>
        ))}
        
        <div className="flex gap-2 mb-4">
          <button onClick={addTask} className="btn btn-green">
            ➕ Add Task
          </button>
          <button
            onClick={generateSchedule}
            className="btn btn-purple"
            disabled={loading}
          >
            {loading ? '⏳ Generating...' : '🚀 Generate Smart Schedule'}
          </button>
        </div>
      </div>

      {schedule && (
        <div className="schedule-container">
          <h3 className="text-xl font-bold mb-4">📊 Generated Schedule</h3>
          <p className="mb-4 text-green-700">{schedule.message}</p>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-2">🎯 Recommended Order:</h4>
            <div className="flex flex-wrap gap-2">
              {schedule.recommendedOrder.map((task, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {index + 1}. {task}
                </span>
              ))}
            </div>
          </div>

          {schedule.timeline.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">📅 Timeline:</h4>
              <div className="space-y-3">
                {schedule.timeline.map((item, index) => (
                  <div key={index} className="schedule-item">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-semibold">{item.title}</h5>
                        <p className="text-sm text-gray-600">
                          📅 {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          ⏱️ {item.estimatedHours} hours
                        </p>
                        {item.dependencies.length > 0 && (
                          <p className="text-sm text-gray-600">
                            🔗 Depends on: {item.dependencies.join(', ')}
                          </p>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.status === 'Urgent' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
