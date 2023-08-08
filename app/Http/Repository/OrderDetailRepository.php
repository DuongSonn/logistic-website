<?php

namespace App\Http\Repository;

use App\Http\Interfaces\OrderDetailRepositoryInterface;
use App\Models\OrderDetail;

class OrderDetailRepository implements OrderDetailRepositoryInterface
{
    public function bulkCreate($data)
    {
        return OrderDetail::insert($data);
    }
}