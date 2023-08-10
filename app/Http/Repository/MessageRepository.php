<?php

namespace App\Http\Repository;

use App\Http\Interfaces\MessageRepositoryInterface;
use App\Models\Message;

class MessageRepository implements MessageRepositoryInterface
{
    public function findUserMessages($senderId, $receiverId)
    {
        $messages = Message::where(function ($query) use ($senderId, $receiverId) {
                $query->where('receiver_id', $senderId)
                ->where('sender_id', $receiverId);
             })
            ->orWhere(function ($query) use ($senderId, $receiverId) {
                $query->where('sender_id', $senderId)
                ->where('receiver_id', $receiverId);
            })->orderBy('created_at')->limit(10)->get();
        return $messages;
    }

    public function create($data)
    {
        return Message::create($data);
    }
}