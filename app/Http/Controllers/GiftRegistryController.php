<?php

namespace App\Http\Controllers;

use App\Models\GiftRegistry;
use App\Models\GiftRegistryItem;
use App\Models\GiftRegistryPurchase;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class GiftRegistryController extends Controller
{
    /**
     * Create a new gift registry
     */
    public function createRegistry(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:wedding,holiday,corporate,birthday,anniversary,other',
            'event_name' => 'required|string|max:255',
            'event_date' => 'nullable|date',
            'registry_owner_name' => 'required|string|max:255',
            'co_owner_name' => 'nullable|string|max:255',
            'contact_email' => 'required|email',
            'contact_phone' => 'nullable|string',
            'shipping_address' => 'required|array',
            'is_public' => 'nullable|boolean',
            'allow_custom_amounts' => 'nullable|boolean',
            'show_purchased_items' => 'nullable|boolean',
            'target_amount' => 'nullable|numeric|min:0',
            'thank_you_message' => 'nullable|string',
            'registry_start_date' => 'nullable|date',
            'registry_end_date' => 'nullable|date|after:registry_start_date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $registry = GiftRegistry::create([
            'user_id' => $request->user()->id ?? 1,
            'title' => $request->title,
            'description' => $request->description,
            'type' => $request->type,
            'event_name' => $request->event_name,
            'event_date' => $request->event_date,
            'registry_owner_name' => $request->registry_owner_name,
            'co_owner_name' => $request->co_owner_name,
            'contact_email' => $request->contact_email,
            'contact_phone' => $request->contact_phone,
            'shipping_address' => $request->shipping_address,
            'is_public' => $request->is_public ?? true,
            'allow_custom_amounts' => $request->allow_custom_amounts ?? true,
            'show_purchased_items' => $request->show_purchased_items ?? false,
            'target_amount' => $request->target_amount,
            'thank_you_message' => $request->thank_you_message,
            'registry_start_date' => $request->registry_start_date,
            'registry_end_date' => $request->registry_end_date,
            'status' => 'draft',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Registry created successfully',
            'data' => $registry,
        ], 201);
    }

    /**
     * Add curated items to registry
     */
    public function addCuratedItems(Request $request, $registryId)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'nullable|exists:products,id',
            'items.*.item_name' => 'required|string',
            'items.*.item_description' => 'nullable|string',
            'items.*.item_price' => 'nullable|numeric|min:0',
            'items.*.quantity_requested' => 'required|integer|min:1',
            'items.*.priority' => 'nullable|integer|in:1,2,3',
            'items.*.allow_partial' => 'nullable|boolean',
            'items.*.notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $registry = GiftRegistry::findOrFail($registryId);

        DB::beginTransaction();
        try {
            foreach ($request->items as $itemData) {
                $product = null;
                if (isset($itemData['product_id'])) {
                    $product = Product::find($itemData['product_id']);
                }

                GiftRegistryItem::create([
                    'gift_registry_id' => $registry->id,
                    'product_id' => $itemData['product_id'] ?? null,
                    'item_name' => $itemData['item_name'],
                    'item_description' => $itemData['item_description'] ?? null,
                    'item_price' => $itemData['item_price'] ?? ($product ? $product->price : null),
                    'quantity_requested' => $itemData['quantity_requested'],
                    'priority' => $itemData['priority'] ?? 1,
                    'is_curated' => true,
                    'allow_partial' => $itemData['allow_partial'] ?? true,
                    'notes' => $itemData['notes'] ?? null,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Items added to registry successfully',
                'data' => $registry->load('items.product'),
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
     * Get registry by code (public access)
     */
    public function getRegistryByCode($code)
    {
        $registry = GiftRegistry::byCode($code)
            ->with(['items.product', 'items' => function ($query) {
                $query->orderBy('priority', 'asc');
            }])
            ->firstOrFail();

        if (!$registry->is_public && !$registry->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Registry not available',
            ], 403);
        }

        // Hide purchased items if setting is enabled
        if (!$registry->show_purchased_items) {
            $registry->items = $registry->items->filter(function ($item) {
                return !$item->isFullyPurchased();
            });
        }

        return response()->json([
            'success' => true,
            'data' => $registry,
        ]);
    }

    /**
     * Get registry details (owner access)
     */
    public function getRegistry($registryId)
    {
        $registry = GiftRegistry::with([
            'items.product',
            'items.purchases',
            'purchases.purchaser',
        ])->findOrFail($registryId);

        return response()->json([
            'success' => true,
            'data' => $registry,
        ]);
    }

    /**
     * Update registry
     */
    public function updateRegistry(Request $request, $registryId)
    {
        $registry = GiftRegistry::findOrFail($registryId);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'nullable|date',
            'contact_email' => 'sometimes|email',
            'contact_phone' => 'nullable|string',
            'shipping_address' => 'sometimes|array',
            'is_public' => 'nullable|boolean',
            'allow_custom_amounts' => 'nullable|boolean',
            'show_purchased_items' => 'nullable|boolean',
            'target_amount' => 'nullable|numeric|min:0',
            'thank_you_message' => 'nullable|string',
            'registry_end_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $registry->update($request->only([
            'title',
            'description',
            'event_date',
            'contact_email',
            'contact_phone',
            'shipping_address',
            'is_public',
            'allow_custom_amounts',
            'show_purchased_items',
            'target_amount',
            'thank_you_message',
            'registry_end_date',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Registry updated successfully',
            'data' => $registry,
        ]);
    }

    /**
     * Activate registry
     */
    public function activateRegistry($registryId)
    {
        $registry = GiftRegistry::findOrFail($registryId);

        $registry->update([
            'status' => 'active',
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Registry activated successfully',
            'data' => $registry,
        ]);
    }

    /**
     * Purchase from registry
     */
    public function purchaseFromRegistry(Request $request, $registryId)
    {
        $validator = Validator::make($request->all(), [
            'registry_item_id' => 'nullable|exists:gift_registry_items,id',
            'purchaser_name' => 'required|string|max:255',
            'purchaser_email' => 'required|email',
            'quantity' => 'required|integer|min:1',
            'amount' => 'required|numeric|min:0',
            'message_to_recipient' => 'nullable|string',
            'is_anonymous' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $registry = GiftRegistry::findOrFail($registryId);

        if (!$registry->is_active || $registry->isExpired()) {
            return response()->json([
                'success' => false,
                'message' => 'Registry is not available for purchases',
            ], 400);
        }

        DB::beginTransaction();
        try {
            $registryItem = null;
            if ($request->registry_item_id) {
                $registryItem = GiftRegistryItem::where('gift_registry_id', $registryId)
                    ->findOrFail($request->registry_item_id);

                // Check if quantity exceeds remaining
                if (!$registryItem->allow_partial &&
                    $request->quantity > $registryItem->remaining_quantity) {
                    throw new \Exception('Requested quantity exceeds remaining quantity');
                }
            }

            $purchase = GiftRegistryPurchase::create([
                'gift_registry_id' => $registry->id,
                'gift_registry_item_id' => $request->registry_item_id,
                'purchaser_user_id' => $request->user()->id ?? null,
                'purchaser_name' => $request->purchaser_name,
                'purchaser_email' => $request->purchaser_email,
                'quantity' => $request->quantity,
                'amount' => $request->amount,
                'message_to_recipient' => $request->message_to_recipient,
                'is_anonymous' => $request->is_anonymous ?? false,
                'status' => 'pending',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Purchase initiated successfully',
                'data' => $purchase,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Confirm registry purchase payment
     */
    public function confirmRegistryPurchase(Request $request, $purchaseId)
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

        $purchase = GiftRegistryPurchase::findOrFail($purchaseId);
        $purchase->transaction_id = $request->transaction_id;
        $purchase->markAsCompleted();

        return response()->json([
            'success' => true,
            'message' => 'Purchase confirmed successfully',
            'data' => $purchase->load(['registry', 'registryItem']),
        ]);
    }

    /**
     * Get user's registries
     */
    public function getUserRegistries(Request $request)
    {
        $userId = $request->user()->id ?? 1;

        $registries = GiftRegistry::where('user_id', $userId)
            ->with(['items', 'purchases'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $registries,
        ]);
    }

    /**
     * Search public registries
     */
    public function searchRegistries(Request $request)
    {
        $query = GiftRegistry::public()->active();

        if ($request->type) {
            $query->where('type', $request->type);
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('event_name', 'like', "%{$request->search}%")
                  ->orWhere('registry_owner_name', 'like', "%{$request->search}%");
            });
        }

        $registries = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $registries,
        ]);
    }

    /**
     * Delete registry
     */
    public function deleteRegistry($registryId)
    {
        $registry = GiftRegistry::findOrFail($registryId);

        if ($registry->purchases()->completed()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete registry with completed purchases',
            ], 400);
        }

        $registry->delete();

        return response()->json([
            'success' => true,
            'message' => 'Registry deleted successfully',
        ]);
    }

    /**
     * Update registry item
     */
    public function updateRegistryItem(Request $request, $registryId, $itemId)
    {
        $validator = Validator::make($request->all(), [
            'quantity_requested' => 'sometimes|integer|min:1',
            'priority' => 'sometimes|integer|in:1,2,3',
            'item_name' => 'sometimes|string',
            'item_description' => 'nullable|string',
            'item_price' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $item = GiftRegistryItem::where('gift_registry_id', $registryId)
            ->findOrFail($itemId);

        $item->update($request->only([
            'quantity_requested',
            'priority',
            'item_name',
            'item_description',
            'item_price',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Registry item updated successfully',
            'data' => $item,
        ]);
    }

    /**
     * Delete registry item
     */
    public function deleteRegistryItem($registryId, $itemId)
    {
        $item = GiftRegistryItem::where('gift_registry_id', $registryId)
            ->findOrFail($itemId);

        if ($item->quantity_purchased > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete item with purchases',
            ], 400);
        }

        $item->delete();

        return response()->json([
            'success' => true,
            'message' => 'Registry item deleted successfully',
        ]);
    }
}
