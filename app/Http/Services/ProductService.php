<?php

namespace App\Http\Services;

use App\Http\Interfaces\ProductServiceInterface;
use App\Http\Repository\ProductRepository;

class ProductService implements ProductServiceInterface 
{
    protected $productRepo;

    public function __construct(ProductRepository $productRepo) 
    {
        $this->productRepo = $productRepo;
    }

    public function getProducts()
    {
        
    }
}