<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderDetail extends BaseModel
{
    protected $table = 'order_details';

    protected $fillable = ['amount', 'product_d', 'order_id', 'price'];
}
