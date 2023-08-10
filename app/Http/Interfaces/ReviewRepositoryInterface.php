<?php

namespace App\Http\Interfaces;

interface ReviewRepositoryInterface
{
    public function findByFilter($filter);
    public function countByFilter($filter);
    public function create($data);
}
