<?php

return [
    App\Providers\AppServiceProvider::class,
    // TelescopeServiceProvider NÃO é registrado aqui: o Telescope é dependência
    // de dev (não existe em produção com `composer install --no-dev`). O registro
    // é feito condicionalmente em AppServiceProvider::register() apenas quando a
    // classe do Telescope existe (ambiente local).
];
