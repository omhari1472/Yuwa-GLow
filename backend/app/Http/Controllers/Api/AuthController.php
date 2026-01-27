<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdminUser;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponse;

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = AdminUser::where('email', $request->email)->first();

        if (! $user || $request->password !== $user->password) {
            return $this->errorResponse('The provided credentials are incorrect.', 401);
        }

        $token = $user->createToken('admin-token')->plainTextToken;

        return $this->successResponse([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ], 'Login successful');
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return $this->successResponse([], 'Logged out successfully');
    }

    public function me(Request $request)
    {
        return $this->successResponse($request->user());
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:6|confirmed',
        ]);

        $user = $request->user();

        // Plain text comparison as per user request
        if ($request->current_password !== $user->password) {
            return $this->errorResponse('Current password does not match', 400);
        }

        // Store plain text as per user request
        $user->password = $request->new_password;
        $user->save();

        return $this->successResponse([], 'Password updated successfully');
    }
}
