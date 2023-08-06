<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class BaseModel extends Model
{
    use HasUuids, HasFactory;

    public $incrementing = false;
    public $keyType = 'string';
    public $dates = ['created_at', 'updated_at'];
    public $timestamps = true;
}
