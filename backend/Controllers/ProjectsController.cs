using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using MiniProjectManager.DTOs;
using MiniProjectManager.Services;

namespace MiniProjectManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly ProjectService _projectService;
        private readonly TaskService _taskService;

        public ProjectsController(ProjectService projectService, TaskService taskService)
        {
            _projectService = projectService;
            _taskService = taskService;
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }

        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var projects = await _projectService.GetUserProjectsAsync(GetUserId());
            return Ok(projects);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] CreateProjectDto createProjectDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var project = await _projectService.CreateProjectAsync(GetUserId(), createProjectDto);
            return CreatedAtAction(nameof(GetProjects), new { id = project!.Id }, project);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var success = await _projectService.DeleteProjectAsync(GetUserId(), id);
            
            if (!success)
                return NotFound();

            return NoContent();
        }

        // Task endpoints
        [HttpGet("{projectId}/tasks")]
        public async Task<IActionResult> GetTasks(int projectId)
        {
            var tasks = await _taskService.GetProjectTasksAsync(GetUserId(), projectId);
            return Ok(tasks);
        }

        [HttpPost("{projectId}/tasks")]
        public async Task<IActionResult> CreateTask(int projectId, [FromBody] CreateTaskDto createTaskDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var task = await _taskService.CreateTaskAsync(GetUserId(), projectId, createTaskDto);
            
            if (task == null)
                return NotFound("Project not found");

            return CreatedAtAction(nameof(GetTasks), new { projectId }, task);
        }

        [HttpPut("{projectId}/tasks/{taskId}")]
        public async Task<IActionResult> UpdateTask(int projectId, int taskId, [FromBody] UpdateTaskDto updateTaskDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var task = await _taskService.UpdateTaskAsync(GetUserId(), projectId, taskId, updateTaskDto);
            
            if (task == null)
                return NotFound();

            return Ok(task);
        }

        [HttpDelete("{projectId}/tasks/{taskId}")]
        public async Task<IActionResult> DeleteTask(int projectId, int taskId)
        {
            var success = await _taskService.DeleteTaskAsync(GetUserId(), projectId, taskId);
            
            if (!success)
                return NotFound();

            return NoContent();
        }

        // Smart Scheduler endpoint
        [HttpPost("{projectId}/schedule")]
        public async Task<IActionResult> ScheduleTasks(int projectId, [FromBody] TaskScheduleRequestDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var schedule = await _taskService.ScheduleTasksAsync(GetUserId(), projectId, request);
            return Ok(schedule);
        }
    }
}
