<?php

namespace App\Http\Repository;

use App\Http\Interfaces\OrderRepositoryInterface;
use App\Models\Order;
use Illuminate\Support\Str;

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
        $limit = $filter['limit'] ?? 20;
        $offset = $filter['offset'] ?? 0;
        $shippingDate = $filter['shipping_date'] ?? null;
        $numberOrder = $filter['number_order'] ?? null;
        $customerName = $filter['customer_name'] ?? null;

        $order = Order::limit($limit)->offset($offset);
        if ($shippingDate) {
            $order->where('shipping_date', '=',  $shippingDate);
        }
        if ($numberOrder) {
            $order->where('number_order', 'LIKE', "%{$numberOrder}%");
        }
        if ($customerName) {
            $nameSlug = Str::slug($customerName, '_');
            $order->whereIn('customer_id', function ($query) use ($nameSlug) {
                $query->select('id')
                      ->from('users')
                      ->where('name_slug', 'LIKE', "%{$nameSlug}%");
            });
        }

        return $order->with(['user', 'orderDetails.product'])->get();
    }

    public function findById($id) {
        return Order::where('id', $id)->first();
    }

    public function countByFilter($filter)
    {
        $shippingDate = $filter['shipping_date'] ?? 0;
        $numberOrder = $filter['number_order'] ?? null;
        $customerName = $filter['customer_name'] ?? null;

        $total = Order::all();
        if ($shippingDate != 0) {
            $total->where('shipping_date', '=', $shippingDate);
        }
        if ($numberOrder) {
            $total->where('number_order', 'LIKE', "%{$numberOrder}%");
        }
        if ($customerName) {
            $nameSlug = Str::slug($customerName, '_');
            $total->whereIn('customer_id', function ($query) use ($nameSlug) {
                $query->select('id')
                      ->from('users')
                      ->where('name_slug', 'LIKE', "%{$nameSlug}%");
            });
        }

        return $total->count();
    }
}