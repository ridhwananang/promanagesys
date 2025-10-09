<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Tampilkan halaman dashboard utama.
     */
    public function index(): Response
    {
        return Inertia::render('Dashboard/Index', [
            'title' => 'Dashboard',
            'description' => 'Halaman utama sistem manajemen proyek',
        ]);
    }
}
