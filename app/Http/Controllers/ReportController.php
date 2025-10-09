<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Report;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function index(Project $project)
    {
        $reports = $project->reports()->latest()->get();

        return inertia('Reports/Index', [
            'project' => $project,
            'reports' => $reports,
        ]);
    }

    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'summary' => 'nullable|string',
        ]);

        $tasks = $project->tasks()->count();
        $completed = $project->tasks()->where('status', 'done')->count();

        $metrics = [
            'total_tasks' => $tasks,
            'completed_tasks' => $completed,
            'progress' => $tasks > 0 ? round(($completed / $tasks) * 100, 2) : 0,
        ];

        Report::create([
            'project_id' => $project->id,
            'generated_by' => Auth::id(),
            'summary' => $validated['summary'] ?? null,
            'metrics_json' => $metrics,
        ]);

        return back()->with('success', 'Report generated.');
    }
}
