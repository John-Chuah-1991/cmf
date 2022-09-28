<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Support\Str;
use ReinVanOyen\Cmf\Traits\HasLabel;
use ReinVanOyen\Cmf\Traits\HasName;
use ReinVanOyen\Cmf\Traits\HasTooltip;
use ReinVanOyen\Cmf\Traits\HasValidation;

class VideoServiceField extends Component
{
    use HasName;
    use HasValidation;
    use HasLabel;
    use HasTooltip;

    /**
     * @var string $videoServiceField
     */
    private $videoServiceField;

    /**
     * DateTimeField constructor.
     * @param string $name
     */
    public function __construct(string $name, string $videoServiceField)
    {
        $this->name($name);
        $this->label(Str::labelify($name));

        $this->videoServiceField = $videoServiceField;
        $this->export('videoServiceField', $this->videoServiceField);
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'video-service-field';
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        $attributes[$this->getName()] = $model->{$this->getName()};
        $attributes[$this->videoServiceField] = $model->{$this->videoServiceField};
    }

    /**
     * @param Model $model
     * @param Request $request
     */
    public function save(Model $model, Request $request)
    {
        $model->{$this->getName()} = $request->input($this->getName());
        $model->{$this->videoServiceField} = $request->input($this->videoServiceField);
    }

    /**
     * @param array $validationRules
     * @return array
     */
    public function registerValidationRules(array $validationRules): array
    {
        $validationRules[$this->getName()] = $this->validationRules;

        return $validationRules;
    }
}
