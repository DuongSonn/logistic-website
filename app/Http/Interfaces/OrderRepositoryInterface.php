<?php

namespace App\Http\Interfaces;

use App\Models\Order;

interface OrderRepositoryInterface
{
    public function findAllByFilter($filter);
    public function create($data);
    public function updateById(Order $data);
    public function findById($id);
}
