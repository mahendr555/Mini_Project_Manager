using Microsoft.EntityFrameworkCore;
using MiniProjectManager.Data;
using MiniProjectManager.DTOs;
using MiniProjectManager.Models;

namespace MiniProjectManager.Services
{
    public class TaskService
    {
        private readonly AppDbContext _context;

        public TaskService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<TaskDto>> GetProjectTasksAsync(int userId, int projectId)
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null) return new List<TaskDto>();

            return await _context.Tasks
                .Where(t => t.ProjectId == projectId)
                .Select(t => new TaskDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    DueDate = t.DueDate,
                    IsCompleted = t.IsCompleted,
                    CreatedAt = t.CreatedAt,
                    ProjectId = t.ProjectId
                })
                .ToListAsync();
        }

        public async Task<TaskDto?> CreateTaskAsync(int userId, int projectId, CreateTaskDto createTaskDto)
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null) return null;

            var task = new ProjectTask
            {
                Title = createTaskDto.Title,
                DueDate = createTaskDto.DueDate,
                ProjectId = projectId
            };

            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();

            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                CreatedAt = task.CreatedAt,
                ProjectId = task.ProjectId
            };
        }

        public async Task<TaskDto?> UpdateTaskAsync(int userId, int projectId, int taskId, UpdateTaskDto updateTaskDto)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.ProjectId == projectId && t.Project.UserId == userId);

            if (task == null) return null;

            task.Title = updateTaskDto.Title;
            task.DueDate = updateTaskDto.DueDate;
            task.IsCompleted = updateTaskDto.IsCompleted;

            await _context.SaveChangesAsync();

            return new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                DueDate = task.DueDate,
                IsCompleted = task.IsCompleted,
                CreatedAt = task.CreatedAt,
                ProjectId = task.ProjectId
            };
        }

        public async Task<bool> DeleteTaskAsync(int userId, int projectId, int taskId)
        {
            var task = await _context.Tasks
                .Include(t => t.Project)
                .FirstOrDefaultAsync(t => t.Id == taskId && t.ProjectId == projectId && t.Project.UserId == userId);

            if (task == null) return false;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

    public async Task<TaskScheduleResponseDto> ScheduleTasksAsync(int userId, int projectId, TaskScheduleRequestDto request)
        {
            var project = await _context.Projects
                .FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

            if (project == null)
                return new TaskScheduleResponseDto { Message = "Project not found" };

            var scheduledTasks = new List<TaskScheduledItem>();
            var currentDate = DateTime.Now.Date;

            // Simple scheduling algorithm: sort by priority and due date
            var sortedTasks = request.Tasks
                .OrderByDescending(t => t.Priority)
                .ThenBy(t => t.DueDate ?? DateTime.MaxValue)
                .ToList();

            foreach (var task in sortedTasks)
            {
                var suggestedStart = currentDate;
                var suggestedEnd = currentDate.AddDays(1); // Assume 1 day per task

                // If task has due date, try to schedule before it
                if (task.DueDate.HasValue && task.DueDate.Value > currentDate)
                {
                    var daysUntilDue = (task.DueDate.Value - currentDate).Days;
                    if (daysUntilDue > 0)
                    {
                        suggestedStart = task.DueDate.Value.AddDays(-1);
                        suggestedEnd = task.DueDate.Value;
                    }
                }

                scheduledTasks.Add(new TaskScheduledItem
                {
                    TaskId = task.TaskId,
                    Title = task.Title,
                    SuggestedStartDate = suggestedStart,
                    SuggestedEndDate = suggestedEnd,
                    Reason = $"Priority: {task.Priority}, Due: {task.DueDate?.ToString("yyyy-MM-dd") ?? "No due date"}"
                });

                currentDate = suggestedEnd.AddDays(1);
            }

            return new TaskScheduleResponseDto
            {
                Schedule = scheduledTasks,
                Message = $"Generated schedule for {scheduledTasks.Count} tasks"
            };
        }
    }
}
