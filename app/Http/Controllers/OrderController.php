<?php

namespace App\Http\Controllers;

use App\Http\Interfaces\OrderServiceInterface;
use App\Http\Requests\CreateOrderRequest;
use App\Http\Requests\GetOrderDetailRequest;
use App\Http\Requests\GetOrderRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\UpdateOrderRequest;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderServiceInterface $orderService)
    {
        $this->orderService = $orderService;   
        $this->middleware('auth:api');     
    }

    public function getOrders(GetOrderRequest $request)
    {
        $data = $request->validated();

        // Call the OrderService to create a new order
        $data = $this->orderService->getOrders($data);

        // Handle the response or redirect as needed
        if ($data['success'] == false) {
            return response()->json($data, 500);
        }

        return response()->json($data, 200);
    }

    public function create(CreateOrderRequest $request)
    {
        $data = $request->validated();

        // Call the OrderService to create a new order
        $data = $this->orderService->create($data);
        if ($data['success'] == false) {
            return response()->json($data, 500);
        }

        return response()->json($data, 200);
    }

    public function update(UpdateOrderRequest $request)
    {
        $data = $request->validated();

        // Call the OrderService to create a new order
        $data = $this->orderService->update($data);
        if ($data['success'] == false) {
            return response()->json($data, 500);
        }

        return response()->json($data, 200);
    }

    public function getOrderDetail(GetOrderDetailRequest $request)
    {
        $data = $request->validated();

        // Call the OrderService to create a new order
        $data = $this->orderService->getOrderDetail($data);
        if ($data['success'] == false) {
            return response()->json($data, 500);
        }

        return response()->json($data, 200);
    }
}
