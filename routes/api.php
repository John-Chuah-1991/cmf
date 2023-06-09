<?php

use ReinVanOyen\Cmf\Http\Controllers\{
    ModulesController,
    ComponentsController,
    AuthController,
    MediaController
};

use \ReinVanOyen\Cmf\Http\Middleware\{
    Gate,
    Authenticate,
    DispatchServingCmfEvent,
    SetLocale
};

use \Illuminate\Cookie\Middleware\EncryptCookies;
use \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use \Illuminate\Session\Middleware\StartSession;
use \Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;

Route::middleware([
    EncryptCookies::class,
    AddQueuedCookiesToResponse::class,
    StartSession::class,
    VerifyCsrfToken::class,
    Gate::class,
    SetLocale::class,
    Authenticate::class,
    DispatchServingCmfEvent::class,
])
    ->namespace('ReinVanOyen\Cmf\Http\Controllers')
    ->prefix('cmf/api')
    ->group(function() {

        Route::get('modules', [ModulesController::class, 'index']);
        Route::get('modules/{module}/{action}', [ModulesController::class, 'action']);
        Route::get('modules/{module}/{action}/{execute}', [ModulesController::class, 'execute']);
        Route::post('modules/{module}/{action}/{execute}', [ModulesController::class, 'execute']);

        Route::get('modules/{module}/{action}/{id}/{execute}', [ComponentsController::class, 'execute'])->where('id', '[0-9]+');
        Route::post('modules/{module}/{action}/{id}/{execute}', [ComponentsController::class, 'execute'])->where('id', '[0-9]+');

        // Auth
        Route::get('auth/user', [AuthController::class, 'user']);
        Route::get('auth/logout', [AuthController::class, 'logout']);
        Route::post('auth/csrf-keep-alive', [AuthController::class, 'csrfKeepAlive']);
        Route::get('auth/session-info', [AuthController::class, 'sessionInfo']);

        // Media
        Route::get('media/path', [MediaController::class, 'path']);
        Route::get('media/load-directories', [MediaController::class, 'loadDirectories']);
        Route::get('media/load-files', [MediaController::class, 'loadFiles']);

        Route::post('media/rename-directory', [MediaController::class, 'renameDirectory']);
        Route::post('media/delete-directory', [MediaController::class, 'deleteDirectory']);
        Route::post('media/create-directory', [MediaController::class, 'createDirectory']);
        Route::post('media/move-directory', [MediaController::class, 'moveDirectory']);

        Route::post('media/upload', [MediaController::class, 'upload']);
        Route::post('media/upload-chunk', [MediaController::class, 'uploadChunk']);
        Route::post('media/rename-file', [MediaController::class, 'renameFile']);
        Route::post('media/label-file', [MediaController::class, 'labelFile']);

        Route::post('media/update-file-description', [MediaController::class, 'updateFileDescription']);
        Route::post('media/update-file-copyright', [MediaController::class, 'updateFileCopyright']);
        Route::post('media/update-file-visibility', [MediaController::class, 'updateFileVisibility']);
        Route::post('media/update-files-description', [MediaController::class, 'updateFilesDescription']);
        Route::post('media/update-files-copyright', [MediaController::class, 'updateFilesCopyright']);

        Route::post('media/move-file', [MediaController::class, 'moveFile']);
        Route::post('media/move-files', [MediaController::class, 'moveFiles']);

        Route::post('media/delete-file', [MediaController::class, 'deleteFile']);
        Route::post('media/delete-files', [MediaController::class, 'deleteFiles']);

    });

Route::post('cmf/api/auth/login', [AuthController::class, 'login'])
    ->middleware([
        EncryptCookies::class,
        AddQueuedCookiesToResponse::class,
        StartSession::class,
        VerifyCsrfToken::class,
        Gate::class,
        SetLocale::class
    ]);

