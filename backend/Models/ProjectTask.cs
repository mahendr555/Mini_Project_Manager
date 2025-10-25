using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Models
{
    public class ProjectTask
    {
        public int Id { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        public DateTime? DueDate { get; set; }
        
        public bool IsCompleted { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Foreign key
        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;
    }
}
