using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.DTOs
{
    public class SchedulerTaskDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        
        [Range(0.5, 100)]
        public double EstimatedHours { get; set; }
        
        public DateTime? DueDate { get; set; }
        
        public List<string> Dependencies { get; set; } = new();
    }

    public class ScheduleRequestDto
    {
        [Required]
        public List<SchedulerTaskDto> Tasks { get; set; } = new();
        
        [Range(1, 12)]
        public int WorkHoursPerDay { get; set; } = 8;
    }

    public class ScheduleResponseDto
    {
        public List<string> RecommendedOrder { get; set; } = new();
        public List<ScheduledTaskDetail> Timeline { get; set; } = new();
        public string Message { get; set; } = string.Empty;
    }

    public class ScheduledTaskDetail
    {
        public string Title { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public double EstimatedHours { get; set; }
        public List<string> Dependencies { get; set; } = new();
        public string Status { get; set; } = "Scheduled";
    }
}
