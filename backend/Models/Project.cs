using System.ComponentModel.DataAnnotations;

namespace MiniProjectManager.Models
{
    public class Project
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Foreign key
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        
        // Navigation property
        public ICollection<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
    }
}
