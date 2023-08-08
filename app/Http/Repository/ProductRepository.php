<?php

namespace App\Http\Repository;

use App\Http\Interfaces\ProductRepositoryInterface;
use App\Models\Product;

class ProductRepository implements ProductRepositoryInterface
{
    public function findAll()
    {
        $products = Product::findAll();
        return $products;
    }
}