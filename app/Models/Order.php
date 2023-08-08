<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

enum Status: string
{
    case Pending = 'pending';
    case Delivering = 'delivering';
    case Completed = 'completed';
    case Canceled = 'canceled';
}

class Order extends BaseModel
{
    protected $table = 'orders';

    protected $fillable = ['status', 'customer_id', 'total_price', 'shipping_date', 'delivery_date', 'shipping_address', 'delivery_address'];

    public function orderDetails(): HasMany
    {
        return $this->hasMany(OrderDetail::class);
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'customer_id');
    }
}
