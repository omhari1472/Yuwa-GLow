<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    /** List all subscribers (admin) */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => NewsletterSubscriber::orderBy('created_at', 'desc')->get()
        ]);
    }

    /** Subscribe (public) */
    public function store(Request $request)
    {
        $request->validate(['email' => 'required|email|max:150']);

        $subscriber = NewsletterSubscriber::firstOrCreate(
        ['email' => strtolower($request->email)]
        );

        return response()->json([
            'success' => true,
            'message' => 'Subscribed successfully!',
            'data' => $subscriber
        ], $subscriber->wasRecentlyCreated ? 201 : 200);
    }

    /** Export CSV (admin) */
    public function export()
    {
        $subscribers = NewsletterSubscriber::orderBy('created_at', 'desc')->get();

        $csv = "Email,Date\n";
        foreach ($subscribers as $sub) {
            $csv .= "{$sub->email},{$sub->created_at->format('Y-m-d')}\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="newsletter_subscribers.csv"',
        ]);
    }

    /** Delete (admin) */
    public function destroy(NewsletterSubscriber $newsletterSubscriber)
    {
        $newsletterSubscriber->delete();
        return response()->json(['success' => true, 'message' => 'Unsubscribed']);
    }
}