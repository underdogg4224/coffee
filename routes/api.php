<?php

use App\Http\Controllers\GiftBuilderController;
use App\Http\Controllers\GiftRegistryController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Gift Builder & Registry API Routes
|--------------------------------------------------------------------------
|
| Here are the API routes for the Gift Builder and Gift Registry features
|
*/

// Gift Builder Routes
Route::prefix('gifts')->group(function () {
    // Products for gifting
    Route::get('/products', [GiftBuilderController::class, 'getAvailableProducts']);

    // Gift CRUD operations
    Route::post('/', [GiftBuilderController::class, 'createGift']);
    Route::get('/user', [GiftBuilderController::class, 'getUserGifts']);
    Route::get('/code/{code}', [GiftBuilderController::class, 'getGiftByCode']);
    Route::get('/{giftId}', [GiftBuilderController::class, 'getGift']);
    Route::put('/{giftId}', [GiftBuilderController::class, 'updateGift']);
    Route::delete('/{giftId}', [GiftBuilderController::class, 'deleteGift']);

    // Gift items management
    Route::post('/{giftId}/items', [GiftBuilderController::class, 'addItemsToGift']);
    Route::put('/{giftId}/items/{itemId}', [GiftBuilderController::class, 'updateGiftItem']);
    Route::delete('/{giftId}/items/{itemId}', [GiftBuilderController::class, 'removeGiftItem']);

    // Gift checkout and payment
    Route::post('/{giftId}/checkout', [GiftBuilderController::class, 'checkoutGift']);
    Route::post('/{giftId}/confirm-payment', [GiftBuilderController::class, 'confirmPayment']);
});

// Gift Registry Routes
Route::prefix('registries')->group(function () {
    // Registry CRUD operations
    Route::post('/', [GiftRegistryController::class, 'createRegistry']);
    Route::get('/user', [GiftRegistryController::class, 'getUserRegistries']);
    Route::get('/search', [GiftRegistryController::class, 'searchRegistries']);
    Route::get('/code/{code}', [GiftRegistryController::class, 'getRegistryByCode']);
    Route::get('/{registryId}', [GiftRegistryController::class, 'getRegistry']);
    Route::put('/{registryId}', [GiftRegistryController::class, 'updateRegistry']);
    Route::delete('/{registryId}', [GiftRegistryController::class, 'deleteRegistry']);

    // Registry activation
    Route::post('/{registryId}/activate', [GiftRegistryController::class, 'activateRegistry']);

    // Registry items management
    Route::post('/{registryId}/items', [GiftRegistryController::class, 'addCuratedItems']);
    Route::put('/{registryId}/items/{itemId}', [GiftRegistryController::class, 'updateRegistryItem']);
    Route::delete('/{registryId}/items/{itemId}', [GiftRegistryController::class, 'deleteRegistryItem']);

    // Registry purchases
    Route::post('/{registryId}/purchase', [GiftRegistryController::class, 'purchaseFromRegistry']);
    Route::post('/purchases/{purchaseId}/confirm', [GiftRegistryController::class, 'confirmRegistryPurchase']);
});
