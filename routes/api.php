<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\RememberMeCookieController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\SocialiteController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CsrfCookieController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::controller(AuthController::class)->group(function(){
    Route::post('/register', 'register');

    Route::post('/login', 'login');
});

Route::post('/password/email', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('/password/reset/{token}', [ResetPasswordController::class, 'showResetForm'])->name('password.reset');
Route::post('/password/reset', [ResetPasswordController::class, 'reset']);

Route::patch('/auth/facebook/redirect', [SocialiteController::class, 'facebookredirect']);
Route::post('/auth/facebook/callback', [SocialiteController::class, 'facebookcallback']);

Route::patch('/auth/github/redirect', [SocialiteController::class, 'githubredirect']);
Route::post('/auth/github/callback', [SocialiteController::class, 'githubcallback']);

Route::patch('/auth/google/redirect', [SocialiteController::class, 'googleredirect']);
Route::post('/auth/google/callback', [SocialiteController::class, 'googlecallback']);

Route::middleware(['auth:sanctum', 'verified'])->group(function(){
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])->name('verification.verify')->middleware('signed');
    Route::post('/email/resend', [VerificationController::class, 'resend']);
    Route::post('/remove-remember-me', [RememberMeCookieController::class, 'remove']);

    Route::patch('/{type_profile}/update-email', [ProfileController::class, 'update_email']);
    Route::patch('/{type_profile}/update-password', [ProfileController::class, 'update_password']);
    Route::patch('/{type_profile}/update-picture', [ProfileController::class, 'update_picture']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::patch('/{type_profile}/facebook/connect', [SocialiteController::class, 'facebookredirect']);
    Route::patch('/{type_profile}/facebook/remove', [SocialiteController::class, 'facebookremove']);

    Route::patch('/{type_profile}/github/connect', [SocialiteController::class, 'githubredirect']);
    Route::patch('/{type_profile}/github/remove', [SocialiteController::class, 'githubremove']);

    Route::patch('/{type_profile}/google/connect', [SocialiteController::class, 'googleredirect']);
    Route::patch('/{type_profile}/google/remove', [SocialiteController::class, 'googleremove']);
});

Route::get('/refresh-csrf-token', [CsrfCookieController::class, 'show']);
