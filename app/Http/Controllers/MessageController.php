<?php

namespace App\Http\Controllers;

use App\Http\Interfaces\MessageServiceInterface;
use App\Http\Requests\CreateMessageRequest;
use App\Http\Requests\GetMessageRequest;

class MessageController extends Controller
{
    protected $messageService;

    public function __construct(MessageServiceInterface $messageService)
    {
        $this->messageService = $messageService;   
        $this->middleware('auth:api');     
    }

    public function getUserMessages(GetMessageRequest $request)
    {   
        $data = $request->validated();

        // Call the MessageService to create a new message
        $data = $this->messageService->getUserMessages($data);

        // Handle the response or redirect as needed
        if ($data['success'] == false) {
            return response()->json($data, 500);
        }

        return response()->json($data, 200);
    }

    public function createMessage(CreateMessageRequest $request)
    {   
        $data = $request->validated();

        // Call the MessageService to create a new message
        $data = $this->messageService->createMessage($data);

        // Handle the response or redirect as needed
        if ($data['success'] == false) {
            return response()->json($data, 500);
        }

        return response()->json($data, 200);
    }
}
