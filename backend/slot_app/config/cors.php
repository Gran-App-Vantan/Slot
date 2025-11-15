<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:3005',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3005',
        'http://localhost:3001',
        'http://127.0.0.1:3001',
],
    'allow_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    'allow_headers' => ['Content-Type', 'Authorization'],
    'expose_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];