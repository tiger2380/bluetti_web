<?php

declare(strict_types=1);

namespace Swidly\Core;

use Swidly\Core\Attributes\Column;
use Swidly\Core\Attributes\Table;

class Model {
    public $app;
    protected string $class;
    private array $vars = [];
    protected const ATTRIBUTE_NAME = 'Column';
    /**
     * @var null
     */
    private $result;
    private \ReflectionClass $reflectionClass;
    private mixed $idField;
    private array $props;


    public function __construct()
    {
        global $app;
        $this->class = get_called_class();
        $this->app = $app;
        $this->result = null;
        $this->reflectionClass = new \ReflectionClass($this->class);

        $this->table = $this->getTableProperty();
        $functions = $this->getFunctionsInClass();
        $this->idField = $this->getColumnProperty()['idField'];
        $this->props = $functions;
    }

    function find(array $criteria) {
        $result = DB::Table($this->table)->Select()->WhereOnce($criteria);
        
        if (!$result) {
            return null;
        }
        $class = new $this->class();

        foreach ($result as $column => $variable) {
            if ($column === $this->idField) {
                $class->{$column} = $variable;
            } else {
                if(method_exists($class, 'set'.ucfirst($column))) {
                    $class->{'set'.ucfirst($column)}($variable);
                } else {
                    continue;
                    //throw new \Swidly\Core\SwidlyException('Missing method: '.'set'.ucfirst($column), 500);
                }
            }
        }

        $class->{'doUpdate'} = true;

        return $class;
    }

    function findAll(): array
    {
        $result = DB::Table($this->table)->Select()->All();
        $results = [];

        $idField = $this->idField;

        foreach ($result as $key => $value) {
            $class = new $this->class();
            foreach ($value as $column => $variable) {
                if ($column === $idField) {
                    $class->id = $variable;
                } else {
                    if(method_exists($class, 'set'.ucfirst($column))) {
                        $class->{'set'.ucfirst($column)}($variable);
                    } else {
                        continue;
                    }
                }
            }
            
            $class->{'doUpdate'} = true;
            $results[] = $class;
        }
        
        return $results;
    }

    function save(): bool
    {
        $entity = $this->table;
        $data = [];
        $idField = $this->idField;
        $props = array_flip($this->getColumnProperty());

        foreach ($this->props as $key => $prop) {
            $name = strtolower(substr($key, 3, strlen($key)));
            $field = $this->{$prop}();
            if (!isset($field) || empty($field)) {
                continue;
            }
            $data[$props[$name]] = $field;
        }

        try {
            if((int) $data[$idField] === 0) {
                unset($data[$idField]);
                DB::Table($entity)->Insert($data);
            } else {
                DB::Table($entity)->Update($data)->WhereOnce([$idField => $data[$this->idField]]);
            }

            return true;
        } catch(SwidlyException $ex) {
            dump($ex->getMessage());
            return false;
        }
    }

    public function getFunctionsInClass() {
        $class = $this->reflectionClass;
        $methods = $class->getMethods(\ReflectionMethod::IS_PUBLIC);
        $functions = [];

        foreach ($methods as $method) {
            $name = $method->getName();
            if ($class->getName() !== $method->getDeclaringClass()->getName() || substr($name, 0, 3) !== 'get') {
                continue;
            }
            
            $functions[$name] = $name;
        }

        return $functions;
    }

    public function getColumnProperty(): array
    {
        $data = [];
        $reflectionProperties = $this->reflectionClass->getProperties();

        foreach ($reflectionProperties as $reflectionProperty) {
            $attributes = $reflectionProperty->getAttributes(Column::class);

            foreach ($attributes as $attribute) {
                $name = $reflectionProperty->getName() ?? '';
                $instance = $attribute->newInstance();
                if($instance->isPrimary) {
                    $data['idField'] = $name;
                }

                $data[$name] = strtolower(str_replace('_', '', $name));
            }
        }

        return $data;
    }

    public function getTableProperty() {
        $class = $this->reflectionClass;
        $attribute = $class->getAttributes(Table::class)[0];
        
        if ($attribute) {
            $instance = $attribute->newInstance();

            return $instance->name;
        }
        return null;
    }

    public function __set($name, $value) {
        $this->vars[$name] = $value;
    }

    public function __get($name) {
        if (array_key_exists($name, $this->vars)) {
            return $this->vars[$name];
        }
        return null;
    }
}