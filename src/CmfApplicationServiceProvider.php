<?php

namespace ReinVanOyen\Cmf;

use Illuminate\Support\ServiceProvider;
use ReinVanOyen\Cmf\Events\ServingCmf;

class CmfApplicationServiceProvider extends ServiceProvider
{
    /**
     * @throws \Illuminate\Contracts\Container\BindingResolutionException
     */
    public function boot()
    {
        $cmf = $this->app->make(Cmf::class);

        $cmf->serving(function (ServingCmf $event) use ($cmf) {
            $cmf->registerModules($this->modules());
            $cmf->registerComponents($this->components());
        });
    }

    /**
     * @return array
     */
    public function modules(): array
    {
        return [];
    }

    /**
     * @return array
     */
    public function components(): array
    {
        return [];
    }
}
