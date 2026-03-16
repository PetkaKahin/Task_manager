<?php

$env = file_get_contents('.env');

if (preg_match('/^REVERB_APP_KEY=.+/m', $env)) {
    echo "Reverb keys already set.\n";
    exit;
}

$id = random_int(100000, 999999);
$key = bin2hex(random_bytes(10));
$secret = bin2hex(random_bytes(10));

$env = preg_replace('/^REVERB_APP_ID=.*/m', 'REVERB_APP_ID=' . $id, $env);
$env = preg_replace('/^REVERB_APP_KEY=.*/m', 'REVERB_APP_KEY=' . $key, $env);
$env = preg_replace('/^REVERB_APP_SECRET=.*/m', 'REVERB_APP_SECRET=' . $secret, $env);

file_put_contents('.env', $env);
echo "Reverb keys generated: ID=$id KEY=$key\n";
