<?php

namespace App\Http\Services;

use App\Events\SendReview;
use App\Helpers\ApiResponse;
use App\Http\Interfaces\ReviewRepositoryInterface;
use App\Http\Interfaces\ReviewServiceInterface;
use App\Models\Role;

class ReviewService implements ReviewServiceInterface 
{
    protected $reviewRepo;

    public function __construct(ReviewRepositoryInterface $reviewRepo) 
    {
        $this->reviewRepo = $reviewRepo;
    }

    public function create($data)
    {
        $user = auth('api')->user();

        $review = [
            'user_id' => $user['id'],
            'comment' => $data['comment'],
            'rating' => $data['rating'],
        ];
        $review = $this->reviewRepo->create($review);

        return ApiResponse::success(null, null);
    }

    public function getReviews($filter)
    {
        $user = auth('api')->user();
        if ($user->role != Role::Admin->value) {
            ApiResponse::error("Unauthorized", null);
        }

        $reviews = $this->reviewRepo->findByFilter($filter);

        return ApiResponse::success($reviews, null);

    }
}