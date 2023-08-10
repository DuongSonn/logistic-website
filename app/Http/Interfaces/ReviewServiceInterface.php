<?php

namespace App\Http\Interfaces;

interface ReviewServiceInterface
{
    public function getReviews($filter);
    public function create($data);
}
