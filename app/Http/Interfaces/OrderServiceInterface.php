<?php

namespace App\Http\Interfaces;

interface OrderServiceInterface
{
    public function getOrders($filter);
    public function create($data);
    public function update($data);
    public function getOrderDetail($data);
    public function removeOrder($data);
}
