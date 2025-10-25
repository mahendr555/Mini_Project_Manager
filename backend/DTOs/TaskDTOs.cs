using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.DTOs
{
    public class CreateTaskDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        
        public DateTime? DueDate { get; set; }
    }

    public class UpdateTaskDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        
        public DateTime? DueDate { get; set; }
        
        public bool IsCompleted { get; set; }
    }

    public class TaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public int ProjectId { get; set; }
    }
    // Task-scheduler DTOs used by the simple task scheduler in TaskService.
    // These are distinct from the richer scheduler DTOs in SchedulerDTOs.cs
    // (used by the SmartScheduler) to avoid naming collisions.
    public class TaskScheduleRequestDto
    {
        public List<TaskScheduleItem> Tasks { get; set; } = new();
    }

    public class TaskScheduleItem
    {
        public int TaskId { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime? DueDate { get; set; }
        public int Priority { get; set; } = 1; // 1-5 scale
    }

    public class TaskScheduleResponseDto
    {
        public List<TaskScheduledItem> Schedule { get; set; } = new();
        public string Message { get; set; } = string.Empty;
    }

    public class TaskScheduledItem
    {
        public int TaskId { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime SuggestedStartDate { get; set; }
        public DateTime SuggestedEndDate { get; set; }
        public string Reason { get; set; } = string.Empty;
    }
}
