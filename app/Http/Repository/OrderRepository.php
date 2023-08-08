<?php

namespace App\Http\Repository;

use App\Http\Interfaces\OrderRepositoryInterface;
use App\Models\Order;

class OrderRepository implements OrderRepositoryInterface
{
    public function create($data)
    {
        return Order::create($data);
    }

    public function updateById(Order $data)
    {
        return $data->save(); 
    }

    public function findAllByFilter($filter)
    {
        
    }
}