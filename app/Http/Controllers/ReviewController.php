<?php

namespace App\Http\Controllers;

use App\Http\Interfaces\ReviewServiceInterface;
use App\Http\Requests\CreateReviewRequest;
use App\Http\Requests\GetReviewRequest;

class ReviewController extends Controller
{
    protected $reviewService;

    public function __construct(ReviewServiceInterface $reviewService)
    {
        $this->reviewService = $reviewService;   
        $this->middleware('auth:api');     
    }

    public function getReviews(GetReviewRequest $request)
    {   
        $data = $request->validated();

        // Call the ReviewService to create a new review
        $data = $this->reviewService->getReviews($data);

        // Handle the response or redirect as needed
        if ($data['success'] == false) {
            return response()->json($data, 500);
        }

        return response()->json($data, 200);
    }

    public function create(CreateReviewRequest $request)
    {   
        $data = $request->validated();

        // Call the ReviewService to create a new review
        $data = $this->reviewService->create($data);

        // Handle the response or redirect as needed
        if ($data['success'] == false) {
            return response()->json($data, 500);
        }

        return response()->json($data, 200);
    }
}
