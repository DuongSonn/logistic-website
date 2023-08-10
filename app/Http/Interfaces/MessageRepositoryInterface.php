<?php

namespace App\Http\Interfaces;

interface MessageRepositoryInterface
{
    public function findUserMessages($senderId, $receiverId);
    public function create($data);
}
