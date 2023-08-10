<?php

namespace App\Http\Services;

use App\Helpers\ApiResponse;
use App\Http\Interfaces\MessageRepositoryInterface;
use App\Http\Interfaces\MessageServiceInterface;

class MessageService implements MessageServiceInterface 
{
    protected $messageRepo;

    public function __construct(MessageRepositoryInterface $messageRepo) 
    {
        $this->messageRepo = $messageRepo;
    }

    public function getUserMessages($data)
    {
        $user = auth('api')->user();
        $senderId= $user->id;
        $receiverId = $data['receiver_id'];

        $messages = $this->messageRepo->findUserMessages($senderId, $receiverId);
        
        return ApiResponse::success($messages, null);
    }

    public function createMessage($data)
    {
        $user = auth('api')->user();

        $message = [
            'sender_id' => $user['id'],
            'receiver_id' => $data['receiver_id'],
            'message' => $data['message'],
        ];
        $message = $this->messageRepo->create($message);

        return ApiResponse::success(null, null);
    }
}