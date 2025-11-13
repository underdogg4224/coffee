<?php

namespace App\Http\Controllers;

use App\Models\Gift;
use App\Models\GiftItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class GiftBuilderController extends Controller
{
    /**
     * Get all available products for gifting
     */
    public function getAvailableProducts(Request $request)
    {
        $products = Product::availableForGifting()
            ->when($request->type, function ($query, $type) {
                return $query->where('type', $type);
            })
            ->when($request->roast_level, function ($query, $roast) {
                return $query->where('roast_level', $roast);
            })
            ->when($request->min_price, function ($query, $minPrice) {
                return $query->where('price', '>=', $minPrice);
            })
            ->when($request->max_price, function ($query, $maxPrice) {
                return $query->where('price', '<=', $maxPrice);
            })
            ->get();

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }

    /**
     * Create a new gift (draft)
     */
    public function createGift(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'recipient_name' => 'required|string|max:255',
            'recipient_email' => 'required|email',
            'recipient_phone' => 'nullable|string',
            'personalized_message' => 'nullable|string',
            'occasion' => 'nullable|string',
            'scheduled_delivery_date' => 'nullable|date|after:today',
            'delivery_time_preference' => 'nullable|in:morning,afternoon,evening,anytime',
            'shipping_address' => 'required|array',
            'shipping_address.street' => 'required|string',
            'shipping_address.city' => 'required|string',
            'shipping_address.state' => 'required|string',
            'shipping_address.zip' => 'required|string',
            'shipping_address.country' => 'required|string',
            'packaging_type' => 'nullable|in:standard,premium,luxury',
            'include_greeting_card' => 'nullable|boolean',
            'greeting_card_design' => 'nullable|string',
            'is_surprise' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $gift = Gift::create([
            'user_id' => $request->user()->id ?? 1, // Default to 1 if no auth
            'recipient_name' => $request->recipient_name,
            'recipient_email' => $request->recipient_email,
            'recipient_phone' => $request->recipient_phone,
            'personalized_message' => $request->personalized_message,
            'occasion' => $request->occasion,
            'scheduled_delivery_date' => $request->scheduled_delivery_date,
            'delivery_time_preference' => $request->delivery_time_preference ?? 'anytime',
            'shipping_address' => $request->shipping_address,
            'packaging_type' => $request->packaging_type ?? 'standard',
            'include_greeting_card' => $request->include_greeting_card ?? false,
            'greeting_card_design' => $request->greeting_card_design,
            'is_surprise' => $request->is_surprise ?? false,
            'status' => 'draft',
            'total_amount' => 0,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Gift created successfully',
            'data' => $gift,
        ], 201);
    }

    /**
     * Add items to gift
     */
    public function addItemsToGift(Request $request, $giftId)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.custom_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $gift = Gift::findOrFail($giftId);

        DB::beginTransaction();
        try {
            foreach ($request->items as $itemData) {
                $product = Product::findOrFail($itemData['product_id']);

                // Check stock
                if (!$product->isInStock($itemData['quantity'])) {
                    throw new \Exception("Product {$product->name} is out of stock");
                }

                GiftItem::create([
                    'gift_id' => $gift->id,
                    'product_id' => $product->id,
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $product->price,
                    'custom_notes' => $itemData['custom_notes'] ?? null,
                ]);
            }

            // Recalculate total
            $gift->calculateTotal();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Items added to gift successfully',
                'data' => $gift->load('items.product'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Update gift item quantity
     */
    public function updateGiftItem(Request $request, $giftId, $itemId)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $gift = Gift::findOrFail($giftId);
        $item = GiftItem::where('gift_id', $giftId)->findOrFail($itemId);

        // Check stock
        if (!$item->product->isInStock($request->quantity)) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient stock',
            ], 400);
        }

        $item->update(['quantity' => $request->quantity]);
        $gift->calculateTotal();

        return response()->json([
            'success' => true,
            'message' => 'Item updated successfully',
            'data' => $gift->load('items.product'),
        ]);
    }

    /**
     * Remove item from gift
     */
    public function removeGiftItem($giftId, $itemId)
    {
        $gift = Gift::findOrFail($giftId);
        $item = GiftItem::where('gift_id', $giftId)->findOrFail($itemId);

        $item->delete();
        $gift->calculateTotal();

        return response()->json([
            'success' => true,
            'message' => 'Item removed successfully',
            'data' => $gift->load('items.product'),
        ]);
    }

    /**
     * Get gift details
     */
    public function getGift($giftId)
    {
        $gift = Gift::with(['items.product', 'user'])->findOrFail($giftId);

        return response()->json([
            'success' => true,
            'data' => $gift,
        ]);
    }

    /**
     * Get gift by code
     */
    public function getGiftByCode($code)
    {
        $gift = Gift::where('gift_code', $code)
            ->with(['items.product'])
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => $gift,
        ]);
    }

    /**
     * Update gift details
     */
    public function updateGift(Request $request, $giftId)
    {
        $gift = Gift::findOrFail($giftId);

        $validator = Validator::make($request->all(), [
            'recipient_name' => 'sometimes|string|max:255',
            'recipient_email' => 'sometimes|email',
            'recipient_phone' => 'nullable|string',
            'personalized_message' => 'nullable|string',
            'occasion' => 'nullable|string',
            'scheduled_delivery_date' => 'nullable|date|after:today',
            'delivery_time_preference' => 'nullable|in:morning,afternoon,evening,anytime',
            'shipping_address' => 'sometimes|array',
            'packaging_type' => 'nullable|in:standard,premium,luxury',
            'include_greeting_card' => 'nullable|boolean',
            'greeting_card_design' => 'nullable|string',
            'is_surprise' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $gift->update($request->only([
            'recipient_name',
            'recipient_email',
            'recipient_phone',
            'personalized_message',
            'occasion',
            'scheduled_delivery_date',
            'delivery_time_preference',
            'shipping_address',
            'packaging_type',
            'include_greeting_card',
            'greeting_card_design',
            'is_surprise',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Gift updated successfully',
            'data' => $gift,
        ]);
    }

    /**
     * Process gift checkout
     */
    public function checkoutGift(Request $request, $giftId)
    {
        $gift = Gift::with('items.product')->findOrFail($giftId);

        if ($gift->items->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot checkout empty gift',
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Reduce stock for each item
            foreach ($gift->items as $item) {
                if (!$item->product->reduceStock($item->quantity)) {
                    throw new \Exception("Insufficient stock for {$item->product->name}");
                }
            }

            // Mark as pending payment
            $gift->update(['status' => 'pending']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Gift checkout initiated',
                'data' => [
                    'gift' => $gift,
                    'payment_required' => $gift->total_amount,
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Confirm payment and finalize gift
     */
    public function confirmPayment(Request $request, $giftId)
    {
        $validator = Validator::make($request->all(), [
            'transaction_id' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $gift = Gift::findOrFail($giftId);
        $gift->markAsPaid();

        return response()->json([
            'success' => true,
            'message' => 'Payment confirmed, gift will be processed',
            'data' => $gift,
        ]);
    }

    /**
     * Get user's gifts
     */
    public function getUserGifts(Request $request)
    {
        $userId = $request->user()->id ?? 1;

        $gifts = Gift::where('user_id', $userId)
            ->with(['items.product'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $gifts,
        ]);
    }

    /**
     * Delete gift (soft delete)
     */
    public function deleteGift($giftId)
    {
        $gift = Gift::findOrFail($giftId);

        if (in_array($gift->status, ['paid', 'processing', 'shipped', 'delivered'])) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete gift in current status',
            ], 400);
        }

        $gift->delete();

        return response()->json([
            'success' => true,
            'message' => 'Gift deleted successfully',
        ]);
    }
}
