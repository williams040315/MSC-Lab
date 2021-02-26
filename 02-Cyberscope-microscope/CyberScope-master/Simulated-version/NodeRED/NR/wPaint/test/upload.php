<?php

$image = imagecreatefrompng('test1.png');
$id = uniqid();

imagealphablending($image, false);
imagesavealpha($image, true);
imagepng($image, 'uploads/wPaint-' . $id . '.png');

// return image path
echo '{"img": "/test/uploads/wPaint-' . $id . '.png"}';
