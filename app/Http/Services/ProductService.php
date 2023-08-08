<?php

namespace App\Http\Services;

use App\Helpers\ApiResponse;
use App\Http\Interfaces\ProductRepositoryInterface;
use App\Http\Interfaces\ProductServiceInterface;

class ProductService implements ProductServiceInterface 
{
    protected $productRepo;

    public function __construct(ProductRepositoryInterface $productRepo) 
    {
        $this->productRepo = $productRepo;
    }

    public function getProducts()
    {
        $data = $this->productRepo->findAll();
        return ApiResponse::success($data, null);
    }
}