<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Project;
use App\Models\ProjectImage;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Minimal payload for SPA index page
        return Inertia::render('Projects/Index', [
            'projects' => [
                'data' => [],
                'links' => [],
                'from' => 0,
                'to' => 0,
                'total' => 0,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
    return Inertia::render('Projects/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'required|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'required|string',
            'total_units' => 'nullable|integer',
            'floors' => 'nullable|integer',
            'images.*' => 'nullable|image|max:4096',
        ]);

        $project = Project::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'location' => $data['location'],
            'start_date' => $data['start_date'] ?? null,
            'expected_completion' => $data['end_date'] ?? null,
            'status' => $data['status'],
            'total_units' => $data['total_units'] ?? 0,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $idx => $file) {
                $path = $file->store('projects/'.$project->id, 'public');
                ProjectImage::create([
                    'project_id' => $project->id,
                    'path' => $path,
                    'position' => $idx,
                ]);
            }
        }

        return redirect()->route('projects.show', $project)->with('success', 'Project created');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $project = Project::findOrFail($id);
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'required|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'status' => 'required|string',
            'total_units' => 'nullable|integer',
            'floors' => 'nullable|integer',
            'images.*' => 'nullable|image|max:4096',
        ]);

        $project->update([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'location' => $data['location'],
            'start_date' => $data['start_date'] ?? null,
            'expected_completion' => $data['end_date'] ?? null,
            'status' => $data['status'],
            'total_units' => $data['total_units'] ?? $project->total_units,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $idx => $file) {
                $path = $file->store('projects/'.$project->id, 'public');
                ProjectImage::create([
                    'project_id' => $project->id,
                    'path' => $path,
                    'position' => $idx,
                ]);
            }
        }

        return redirect()->route('projects.show', $project)->with('success', 'Project updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $project = Project::findOrFail($id);
        // delete storage files
        foreach ($project->images as $img) {
            Storage::disk('public')->delete($img->path);
        }
        $project->delete();
        return redirect()->route('projects.index')->with('success', 'Project deleted');
    }

    public function uploadImages(Request $request, Project $project)
    {
        $request->validate(['images.*' => 'required|image|max:4096']);
        foreach ($request->file('images', []) as $idx => $file) {
            $path = $file->store('projects/'.$project->id, 'public');
            ProjectImage::create([
                'project_id' => $project->id,
                'path' => $path,
                'position' => $project->images()->max('position') + 1,
            ]);
        }
        return back()->with('success', 'Images uploaded');
    }

    public function deleteImage(Project $project, ProjectImage $image)
    {
        if ($image->project_id !== $project->id) abort(404);
        Storage::disk('public')->delete($image->path);
        $image->delete();
        return back()->with('success', 'Image deleted');
    }
}
