<?php

namespace ReinVanOyen\Cmf;

class ComponentRegistry
{
    /**
     * @var array $components
     */
    private array $components = [];

    /**
     * @param $component
     * @return void
     */
    public function add($component)
    {
        $this->components[] = $component;
    }
}
