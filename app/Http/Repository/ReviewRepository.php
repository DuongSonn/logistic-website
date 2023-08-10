<?php

namespace App\Http\Repository;

use App\Http\Interfaces\ReviewRepositoryInterface;
use App\Models\Review;

class ReviewRepository implements ReviewRepositoryInterface
{
    public function findByFilter($filter)
    {
        $limit = $filter['limit'] ?? 20;
        $offset = $filter['offset'] ?? 0;
        $review = Review::limit($limit)->offset($offset)->with(['users'])->get();

        return $review;
    }

    public function create($data)
    {
        return Review::create($data);
    }
}