<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends BaseModel
{
    protected $table = 'products';

    protected $fillable = ['name' , 'price'];

    public function orderDetails(): HasMany
    {
        return $this->hasMany(OrderDetail::class);
    }
}
