using MiniProjectManager.DTOs;

namespace MiniProjectManager.Services
{
    public class SmartSchedulerService
    {
        public ScheduleResponseDto GenerateSchedule(ScheduleRequestDto request)
        {
            try
            {
                // Step 1: Validate input
                if (!request.Tasks.Any())
                {
                    return new ScheduleResponseDto
                    {
                        Message = "No tasks provided for scheduling"
                    };
                }

                // Step 2: Perform topological sort to resolve dependencies
                var sortedTasks = TopologicalSort(request.Tasks);
                
                if (sortedTasks == null)
                {
                    return new ScheduleResponseDto
                    {
                        Message = "Circular dependency detected in tasks"
                    };
                }

                // Step 3: Generate timeline with start/end dates
                var timeline = GenerateTimeline(sortedTasks, request.WorkHoursPerDay);

                return new ScheduleResponseDto
                {
                    RecommendedOrder = sortedTasks.Select(t => t.Title).ToList(),
                    Timeline = timeline,
                    Message = $"Successfully scheduled {sortedTasks.Count} tasks"
                };
            }
            catch (Exception ex)
            {
                return new ScheduleResponseDto
                {
                    Message = $"Error generating schedule: {ex.Message}"
                };
            }
        }

        private List<SchedulerTaskDto>? TopologicalSort(List<SchedulerTaskDto> tasks)
        {
            // Create adjacency list and in-degree count
            var graph = new Dictionary<string, List<string>>();
            var inDegree = new Dictionary<string, int>();
            var taskMap = tasks.ToDictionary(t => t.Title, t => t);

            // Initialize graph
            foreach (var task in tasks)
            {
                graph[task.Title] = new List<string>();
                inDegree[task.Title] = 0;
            }

            // Build graph and calculate in-degrees
            foreach (var task in tasks)
            {
                foreach (var dependency in task.Dependencies)
                {
                    if (!taskMap.ContainsKey(dependency))
                    {
                        continue; // Skip invalid dependencies
                    }
                    
                    graph[dependency].Add(task.Title);
                    inDegree[task.Title]++;
                }
            }

            // Kahn's algorithm for topological sorting
            var queue = new Queue<string>();
            var result = new List<SchedulerTaskDto>();

            // Add all nodes with no incoming edges
            foreach (var kvp in inDegree)
            {
                if (kvp.Value == 0)
                {
                    queue.Enqueue(kvp.Key);
                }
            }

            while (queue.Count > 0)
            {
                var current = queue.Dequeue();
                result.Add(taskMap[current]);

                // Remove edges from current node
                foreach (var neighbor in graph[current])
                {
                    inDegree[neighbor]--;
                    if (inDegree[neighbor] == 0)
                    {
                        queue.Enqueue(neighbor);
                    }
                }
            }

            // Check for circular dependencies
            if (result.Count != tasks.Count)
            {
                return null; // Circular dependency detected
            }

            // Sort by due date within dependency constraints
            return OptimizeByDueDate(result);
        }

        private List<SchedulerTaskDto> OptimizeByDueDate(List<SchedulerTaskDto> sortedTasks)
        {
            // Group tasks by dependency level and sort by due date within each level
            var levels = new List<List<SchedulerTaskDto>>();
            var processed = new HashSet<string>();
            
            while (processed.Count < sortedTasks.Count)
            {
                var currentLevel = new List<SchedulerTaskDto>();
                
                foreach (var task in sortedTasks)
                {
                    if (processed.Contains(task.Title)) continue;
                    
                    // Check if all dependencies are processed
                    if (task.Dependencies.All(dep => processed.Contains(dep)))
                    {
                        currentLevel.Add(task);
                    }
                }
                
                // Sort current level by due date
                currentLevel = currentLevel
                    .OrderBy(t => t.DueDate ?? DateTime.MaxValue)
                    .ToList();
                
                levels.Add(currentLevel);
                
                foreach (var task in currentLevel)
                {
                    processed.Add(task.Title);
                }
            }
            
            return levels.SelectMany(level => level).ToList();
        }

        private List<ScheduledTaskDetail> GenerateTimeline(List<SchedulerTaskDto> sortedTasks, int workHoursPerDay)
        {
            var timeline = new List<ScheduledTaskDetail>();
            var currentDate = DateTime.Today;

            foreach (var task in sortedTasks)
            {
                var daysNeeded = Math.Ceiling(task.EstimatedHours / workHoursPerDay);
                var startDate = currentDate;
                var endDate = currentDate.AddDays(daysNeeded - 1);

                // Adjust if due date is before calculated end date
                if (task.DueDate.HasValue && endDate > task.DueDate.Value)
                {
                    endDate = task.DueDate.Value;
                    startDate = endDate.AddDays(-(daysNeeded - 1));
                    
                    // If start date is in the past, mark as urgent
                    if (startDate < DateTime.Today)
                    {
                        startDate = DateTime.Today;
                    }
                }

                timeline.Add(new ScheduledTaskDetail
                {
                    Title = task.Title,
                    StartDate = startDate,
                    EndDate = endDate,
                    EstimatedHours = task.EstimatedHours,
                    Dependencies = task.Dependencies,
                    Status = task.DueDate.HasValue && endDate > task.DueDate.Value ? "Urgent" : "Scheduled"
                });

                // Move to next available date
                currentDate = endDate.AddDays(1);
            }

            return timeline;
        }
    }
}
