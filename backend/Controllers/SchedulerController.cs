using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MiniProjectManager.DTOs;
using MiniProjectManager.Services;

namespace MiniProjectManager.Controllers
{
    [ApiController]
    [Route("api/v1")]
    [Authorize]
    public class SchedulerController : ControllerBase
    {
        private readonly SmartSchedulerService _schedulerService;
        private readonly ProjectService _projectService;

        public SchedulerController(SmartSchedulerService schedulerService, ProjectService projectService)
        {
            _schedulerService = schedulerService;
            _projectService = projectService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        /// <summary>
        /// Generate smart schedule for project tasks with dependency resolution
        /// </summary>
        /// <param name="projectId">Project ID</param>
        /// <param name="request">Schedule request with tasks and dependencies</param>
        /// <returns>Optimized task schedule with timeline</returns>
        [HttpPost("projects/{projectId}/schedule")]
        public async Task<IActionResult> GenerateSchedule(int projectId, [FromBody] ScheduleRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // Verify user owns the project
                var projects = await _projectService.GetUserProjectsAsync(GetUserId());
                if (!projects.Any(p => p.Id == projectId))
                {
                    return NotFound("Project not found or access denied");
                }

                // Generate the smart schedule
                var schedule = _schedulerService.GenerateSchedule(request);
                
                return Ok(schedule);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// Get scheduling recommendations for existing project tasks
        /// </summary>
        /// <param name="projectId">Project ID</param>
        /// <returns>Schedule based on existing tasks</returns>
        [HttpGet("projects/{projectId}/schedule/recommendations")]
        public async Task<IActionResult> GetScheduleRecommendations(int projectId)
        {
            try
            {
                // Verify user owns the project
                var projects = await _projectService.GetUserProjectsAsync(GetUserId());
                var project = projects.FirstOrDefault(p => p.Id == projectId);
                
                if (project == null)
                {
                    return NotFound("Project not found or access denied");
                }

                // Convert existing tasks to scheduler format
                var schedulerTasks = project.Tasks.Select(t => new SchedulerTaskDto
                {
                    Title = t.Title,
                    EstimatedHours = 4, // Default estimate
                    DueDate = t.DueDate,
                    Dependencies = new List<string>() // No dependencies for existing tasks
                }).ToList();

                if (!schedulerTasks.Any())
                {
                    return Ok(new ScheduleResponseDto
                    {
                        Message = "No tasks found in project"
                    });
                }

                var request = new ScheduleRequestDto
                {
                    Tasks = schedulerTasks,
                    WorkHoursPerDay = 8
                };

                var schedule = _schedulerService.GenerateSchedule(request);
                return Ok(schedule);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }
}
