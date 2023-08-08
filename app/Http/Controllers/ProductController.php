<?php

namespace App\Http\Controllers;

use App\Http\Interfaces\ProductServiceInterface;
use App\Http\Requests\LoginRequest;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductServiceInterface $productService)
    {
        $this->productService = $productService;   
        $this->middleware('auth:api');     
    }

    public function getProducts()
    {
        // Call the ProductService to create a new product
        $data = $this->productService->getProducts();

        // Handle the response or redirect as needed
        if ($data['success'] == false) {
            return response()->json($data, 500);
        }

        return response()->json($data, 200);
    }
}
