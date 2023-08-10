<?php

namespace App\Http\Interfaces;

interface MessageServiceInterface
{
    public function getUserMessages($data);
    public function createMessage($data);
}
