<?php

namespace App\Http\Services;

use App\Helpers\ApiResponse;
use App\Http\Interfaces\OrderDetailRepositoryInterface;
use App\Http\Interfaces\OrderRepositoryInterface;
use App\Http\Interfaces\OrderServiceInterface;
use App\Http\Interfaces\ProductRepositoryInterface;
use App\Models\Role;
use App\Models\Status;
use Carbon\Carbon;
use Illuminate\Support\Str;

class OrderService implements OrderServiceInterface 
{
    protected $orderRepo, $productRepo, $orderDetailRepo;

    public function __construct(
        OrderRepositoryInterface $orderRepo, 
        ProductRepositoryInterface $productRepo,
        OrderDetailRepositoryInterface $orderDetailRepo,
    ) 
    {
        $this->orderRepo = $orderRepo;
        $this->productRepo = $productRepo;
        $this->orderDetailRepo = $orderDetailRepo;
    }

    public function create($data)
    {
        $user = auth('api')->user();
        if ($user['role'] != Role::Customer->value) {
            return ApiResponse::error('Unauthorized', null);
        }

        $timezone = 'Asia/Ho_Chi_Minh';
        $currentTime = Carbon::now()->tz($timezone)->startOfDay()->timestamp;

        // Get all products data
        $productDBs = $this->productRepo->findAll();
        $productMemo = [];
        for ($i=0; $i < count($productDBs); $i++) { 
            $product = $productDBs[$i];
            $id = $product['id'];
            $productMemo[$id] = $product;
        }

        // Validate data
        $shippingDate = $data['shipping_date'];
        $deliveryDate = $data['delivery_date'];
        $products = $data['products'];
        $shippingAddress = $data['shipping_address'];
        $deliveryAddress = $data['delivery_address'];
        $totalPrice = 0;

        if ($shippingDate < $currentTime) {
            return ApiResponse::error('Invalid shipping date', null);
        }
        if ($deliveryDate < $shippingDate) {
            return ApiResponse::error('Invalid delivery date', null);
        }
        for ($i=0; $i < count($products); $i++) { 
            $product = $products[$i];
            $id = $product['id'];
            $amount = $product['amount'];

            if (!array_key_exists($id, $productMemo)) {
                return ApiResponse::error('Product not found', null);
            }
            if ($amount <= 0) {
                return ApiResponse::error('Invalid amount', null);
            }

            $productDB = $productMemo[$id];
            $price = $productDB['price'];

            $totalPrice += ($amount * $price);
        }

        $order = [
            'customer_id' => $user['id'],
            'shipping_date' => $shippingDate,
            'delivery_date' => $deliveryDate,
            'shipping_address' => $shippingAddress,
            'delivery_address' => $deliveryAddress,
            'total_price' => $totalPrice,
        ];
        $order = $this->orderRepo->create($order);
        $orderId = $order['id'];

        $orderDetails = [];
        for ($i=0; $i < count($products); $i++) { 
            $product = $products[$i];
            $id = $product['id'];

            $orderDetail = [
                'order_id' => $orderId,
                'product_id' =>$product['id'],
                'amount' => $product['amount'],
                'price' => $productMemo[$id]['price'],
                'id' => Str::uuid(),
            ];
            array_push($orderDetails, $orderDetail);
        }

        $this->orderDetailRepo->bulkCreate($orderDetails);

        return ApiResponse::success(null, null);
    }

    public function update($data)
    {
        $id = $data['id'];
        $status = $data['status'];

        $order = $this->orderRepo->findById($id);
        if (!$order) {
            return ApiResponse::error('Order not found', null); 
        }

        switch ($status) {
            case Status::Canceled->value:
            case Status::Completed->value:
            case Status::Delivering->value:
            case Status::Pending->value:
                break;
            default:
                return ApiResponse::error('Invalid status', null); 
        }

        $order['status'] = $status;

        $this->orderRepo->updateById($order);

        return ApiResponse::success(null, null); 
    }

    public function getOrders($filter)
    {
        $orders = $this->orderRepo->findAllByFilter($filter);
        $count = $this->orderRepo->countByFilter($filter);

        $res = ['orders' => $orders, 'count'=> $count];
        return ApiResponse::success($res, null);
    }
}