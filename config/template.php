<?php

// Di-generate oleh php artisan template:zip - hanya berisi flavor "landing-ecommerce".
// Ganti brand/warna di bawah, atau set TEMPLATE_FLAVOR di .env.

return [
    'flavor' => env('TEMPLATE_FLAVOR', 'landing-ecommerce'),

    'flavors' => array (
  'landing-ecommerce' => 
  array (
    'label' => 'NUSAMART — Ecommerce',
    'brand_name' => 'NUSAMART',
    'brand_tagline' => 'Belanja online tiap hari',
    'brand_initials' => 'NM',
    'accent' => '#06b6d4',
    'category' => 'teknologi',
    'home' => 'landings.ecommerce',
    'nav' => 
    array (
      'sections' => 
      array (
        0 => 
        array (
          'label' => 'Menu',
          'items' => 
          array (
            0 => 
            array (
              'label' => 'Landing',
              'to' => '/landings/ecommerce',
              'icon' => 'Home',
            ),
            1 => 
            array (
              'label' => 'Dashboard',
              'to' => '/dashboard',
              'icon' => 'LayoutDashboard',
            ),
            2 => 
            array (
              'label' => 'Pengaturan',
              'to' => '/settings',
              'icon' => 'Settings',
            ),
          ),
        ),
      ),
    ),
  ),
),
];
