<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Laravel</title>
    @vite(['resources/sass/app.scss', 'resources/js/app.js'])
  </head>
  <body class="antialiased">
    <div id="user">
    </div>
  </body>
</html>