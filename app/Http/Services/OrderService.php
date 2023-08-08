<?php

namespace App\Http\Services;

use App\Http\Interfaces\OrderServiceInterface;
use App\Http\Repository\OrderRepository;

class OrderService implements OrderServiceInterface 
{
    protected $orderRepo;

    public function __construct(OrderRepository $orderRepo) 
    {
        $this->orderRepo = $orderRepo;
    }

    public function create($data)
    {
        
    }

    public function update($data)
    {
        
    }

    public function getOrders($filter)
    {
        
    }
}