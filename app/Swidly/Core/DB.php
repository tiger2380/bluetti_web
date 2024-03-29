<?php
namespace Swidly\Core;
global $app;

$servername = Swidly::getconfig('db::host');
$dbname = Swidly::getconfig('db::database');
$username = Swidly::getconfig('db::username');
$password = Swidly::getconfig('db::password');
$charset = Swidly::getConfig('db::charset');

define('DB_HOST', $servername);
define('DB_NAME', $dbname);
define('DB_USER', $username);
define('DB_PASS', $password);
define('DB_CHAR', $charset);

class DB
{
    protected static $instance = null;
    protected static $conn = null;
    protected static $sql = [];
    protected static $table = null;
    protected $values = [];

    protected function __construct() {}
    protected function __clone() {}

    public static function instance(): ?\PDO
    {
        if (self::$conn === null)
        {
            $opt  = array(
                \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
                \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
                \PDO::ATTR_EMULATE_PREPARES   => FALSE,
            );
            $dsn = 'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset='.DB_CHAR;

            try {
                self::$conn = new \PDO($dsn, DB_USER, DB_PASS, $opt);
            } catch (\PDOException $ex) {
                throw new SwidlyException($ex->getMessage());
            }
        }
        return self::$conn;
    }

    /**
     * @throws SwidlyException
     */
    public function run(array $args = [])
    {
        if (!self::$conn) {
            self::instance();
        }
        $sql = implode('', self::$sql);
        $exp = explode(' ', $sql);
        $type = strtoupper(array_shift($exp));
        $exp = null;

        if ($type == 'UPDATE' || $type == 'INSERT') {
            $args = array_merge($this->values, $args);
        }

        try {
            if (!$args) {
                $stmt = self::$conn->query($sql);
                self::$sql = [];
                return $stmt;
            }

            $stmt = self::$conn->prepare($sql);
            $check = $stmt->execute($args);

            if ($check) {
                $this->values = [];
                return $stmt;
            } else {
                return false;
            }
        } catch (\Exception $ex) {
            echo $sql;
            var_dump($ex->getMessage());
        }

        self::$sql = [];
    }

    public static function Sql($sql = ''): DB
    {
        self::$sql[] = $sql;
        return new self;
    }

    /**
     * @throws SwidlyException
     */
    public function All($args = []): bool|array
    {
        if($result = $this->run($args)) {
            $data = $result->fetchAll(\PDO::FETCH_OBJ);

            if(is_array($data) && count($data) > 0) {
                return $data;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * @throws SwidlyException
     */
    public function Once($args = []): \stdClass | bool
    {
        if($result = $this->run($args)) {
            $data = $result->fetch(\PDO::FETCH_OBJ);

            if($data) {
                return $data;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public function Select($args = []) {
        $columns = implode(',', $args);
        $columns = rtrim($columns, ',');

        if(empty($columns)) {
            $columns = '*';
        }

        self::$sql[] = "SELECT ". $columns ." FROM ". self::$table . " ";
        return self::$instance;
    }

    public function Where($criteria): bool|array
    {
        $keys = array_keys($criteria);
        $whereClause = '';
        foreach($keys as $key) {
            $whereClause .= " $key = ? AND ";
        }
        $whereClause = rtrim($whereClause, 'AND ');
        self::$sql[] = ' WHERE'.$whereClause;
        return $this->All(array_values($criteria));
    }

    public function WhereOnce($criteria): \stdClass | array | bool
    {
        $keys = array_keys($criteria);
        $whereClause = '';
        foreach($keys as $key) {
            $whereClause .= " $key = ? AND ";
        }
        $whereClause = rtrim($whereClause, 'AND ');
        self::$sql[] = ' WHERE'.$whereClause;
        return $this->Once(array_values($criteria));
    }

    public function Delete($args = []) {
        self::$sql[] = "DELETE FROM ". self::$table ." ";
        return self::$instance;
    }

    public function Update($args = []) {
        self::$sql[] = "UPDATE ". self::$table ." SET ";
        $query = '';
        foreach($args as $key => $value) {
            $query .= $key." = ?, ";
            $this->values[] = $value;
        }

        self::$sql[] = rtrim($query, ', ');
        
        return self::$instance;
    }

    /**
     * @throws SwidlyException
     */
    public function Insert(array $args = []): \PDOStatement | bool
    {
        self::$sql[] = "INSERT INTO ". self::$table ." ";
        $values = '(';
        $cols = '(';
        foreach($args as $key => $value) {
            $cols .= $key.", ";
            $values .= '?, ';
            $this->values[] = $value;
        }

        $cols = rtrim($cols, ', '). ") ";
        $values = rtrim($values, ', '). ") ";

        $query = $cols." VALUES ". $values;


        self::$sql[] = rtrim($query, ',');
        return $this->run();
    }

    public static function Table($table = ''): bool|DB|null
    {
        if(empty($table)) return false;

        self::$table = $table;

        if(!self::$instance) {
            self::$instance = new self();
        }

        if(!self::$conn) {
            self::instance();
        }
        self::$sql = [];
        return self::$instance;
    }

    public static function Query($sql, $params = []): array
    {
        return [$sql => $params];
    }

    public static function TableExists($table): bool
    {
        $sql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '".DB_NAME."' AND table_name = '".$table."' LIMIT 1";
        $result = self::instance()->query($sql);
        return $result->fetchColumn() > 0;
    }

    // alter table
    public static function AlterTable($table, $column, $type, $length = null, $default = null, $after = null): bool
    {
        $sql = "ALTER TABLE $table ADD $column $type";
        if($length) {
            $sql .= "($length)";
        }
        if($default) {
            $sql .= " DEFAULT $default";
        }
        if($after) {
            $sql .= " AFTER $after";
        }
        $sql .= ";";
        return self::instance()->exec($sql);
    }
}