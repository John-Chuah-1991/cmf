<?php

namespace ReinVanOyen\Cmf;

use Illuminate\Support\ServiceProvider;
use Intervention\Image\Image;
use ReinVanOyen\Cmf\Console\ClearMediaConversionsCommand;
use ReinVanOyen\Cmf\Console\InstallCommand;
use ReinVanOyen\Cmf\Console\MetaCommand;
use ReinVanOyen\Cmf\Console\ModuleCommand;
use ReinVanOyen\Cmf\Console\UserCommand;
use ReinVanOyen\Cmf\Console\VersionCommand;
use ReinVanOyen\Cmf\Contracts\MediaConverter;
use ReinVanOyen\Cmf\Media\FileAdder;
use ReinVanOyen\Cmf\Media\ImageConverter;

class CmfServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(Cmf::class, Cmf::class);
        $this->app->singleton(MakeableStorage::class, MakeableStorage::class);
        $this->app->bind(PathResolver::class, PathResolver::class);
        $this->app->bind(FileAdder::class, FileAdder::class);

        $this->app->singleton(MediaConverter::class, function () {
            $converter = new ImageConverter();
            $converter->registerConversion('cmf-thumb', function (Image $image) {
                $image->fit(250, 250);
            });
            $converter->registerConversion('cmf-preview', function (Image $image) {
                $image->resize(450, null, function ($constraint) {
                    $constraint->aspectRatio();
                });
            });
            $converter->registerConversion('cmf-contain', function (Image $image) {
                $image->resize(400, 400, function ($constraint) {
                    $constraint->aspectRatio();
                });
                $image->resizeCanvas(400, 400, 'center', false, '#ffffff');
            });
            return $converter;
        });

        $this->commands([
            InstallCommand::class,
            UserCommand::class,
            MetaCommand::class,
            ModuleCommand::class,
            ClearMediaConversionsCommand::class,
            VersionCommand::class,
        ]);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->mergeConfigFrom(__DIR__.'/../config/cmf.php', 'cmf');

        $this->registerPublishes();
        $this->loadRoutes();
        $this->loadViews();
        $this->loadTranslations();
        $this->registerValidationRules();
    }

    /**
     *
     */
    private function registerPublishes()
    {
        $this->publishes([
            __DIR__.'/Console/stubs/CmfServiceProvider.stub' => app_path('Providers/CmfServiceProvider.php'),
        ], 'cmf-provider');

        $this->publishes([
            __DIR__.'/../config/cmf.php' => config_path('cmf.php'),
        ], 'cmf-config');

        $this->publishes([
            __DIR__.'/../public' => public_path('vendor/cmf'),
        ], 'cmf-assets');

        $this->publishes([
            __DIR__.'/../database/migrations' => database_path('migrations'),
        ], 'cmf-migrations');
    }

    private function registerValidationRules()
    {
        //
    }

    /**
     *
     */
    private function loadRoutes()
    {
        $this->loadRoutesFrom(__DIR__ . '/../routes/api.php');
        $this->loadRoutesFrom(__DIR__ . '/../routes/web.php');
    }

    /**
     *
     */
    private function loadViews()
    {
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'cmf');
    }

    /**
     *
     */
    private function loadTranslations()
    {
        $this->loadTranslationsFrom(__DIR__.'/../resources/lang', 'cmf');
    }
}
