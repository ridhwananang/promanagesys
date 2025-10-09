<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use App\Models\Project;
use App\Models\Sprint;


class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, $projectId)
    {
        $tasks = Task::where('project_id', $projectId)
            ->orderByDesc('created_at')
            ->get();
        return inertia('Project/Task/Index', [
            'project' => $request->route('project'),
            'tasks' => $tasks,
        ]);
    }
public function create($projectId)
{
    $project = Project::with('sprints')->findOrFail($projectId);

    $sprints = $project->sprints()->orderBy('start_date')->get();

    return inertia('Project/Task/Create', [
        'project' => $project,
        'sprints' => $sprints, // <-- Pastikan ini ada
    ]);
}

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        $validated = $request->validate([
    'project_id' => 'required|exists:projects,id',
    'sprint_id' => 'nullable|exists:sprints,id',
    'assigned_to' => 'nullable|exists:users,id',
    'title' => 'required|string|max:255',
    'description' => 'nullable|string',
    'module_type' => 'in:backend,frontend,uiux,project_manager,marketing,fullstack',
    'priority' => 'in:low,medium,high,critical',
    'status' => 'in:todo,in_progress,review,done',
    'progress_percentage' => 'numeric|min:0|max:100',
    'due_date' => 'nullable|date',
]);


        $validated['created_by'] = Auth::id();
        $validated['progress_percentage'] = 0;

        Task::create($validated);
        return back()->with('success', 'Task created.');
    }
    public function show(Task $task)
    {
        return inertia('Project/Task/Show', [
            'project' => $task->project,
            'task' => $task,
        ]);
    }

public function edit($projectId, $taskId)
{
    $task = Task::findOrFail($taskId);
    $projects = Project::all(); // untuk select project
    $sprints = Sprint::where('project_id', $task->project_id)->get(); // hanya sprint project terkait

    return inertia('Project/Task/Edit', [
        'task' => $task,
        'projects' => $projects,
        'sprints' => $sprints,
    ]);
}

public function update(Request $request, Project $project, Task $task)
{
    $validated = $request->validate([
        'project_id' => 'required|exists:projects,id',
        'sprint_id' => 'nullable|exists:sprints,id',
        'assigned_to' => 'nullable|exists:users,id',
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'module_type' => 'in:backend,frontend,uiux,project_manager,marketing,fullstack',
        'priority' => 'in:low,medium,high,critical',
        'status' => 'in:todo,in_progress,review,done',
        'progress_percentage' => 'numeric|min:0|max:100',
        'due_date' => 'nullable|date',
    ]);

    $task->update($validated);

    return back()->with('success', 'Task updated.');
}



    public function destroy(Task $task)
    {
        $task->delete();
        return back()->with('success', 'Task deleted.');
    }
}
