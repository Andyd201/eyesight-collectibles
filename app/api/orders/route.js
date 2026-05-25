import { NextResponse } from "next/server";
import { createClient, getUser } from "@/lib/supabase/server";

export async function POST(request) {
  try {
    const user    = await getUser();
    const supabase = await createClient();
    const body    = await request.json();

    const { items, subtotal, shipping_cost, total, shipping_address } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    // Create the order
    // user_id is nullable — supports both authenticated and guest checkout.
    // The DB schema allows NULL so guests can still place orders.
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id:          user?.id ?? null,
        status:           "pending",
        subtotal:         subtotal,
        shipping_cost:    shipping_cost,
        tax:              0,
        total:            total,
        shipping_address: shipping_address,
        notes:            shipping_address.notes || null,
      })
      .select()
      .single();

    if (orderError) {
      console.error("[createOrder] order error:", orderError);
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // Create order items.
    // Schema columns: order_id, product_id, single_id, name, price, quantity, image_url
    // product_type from the cart tells us which FK to populate.
    const orderItems = items.map((item) => ({
      order_id:   order.id,
      // Route the ID to the correct FK column based on product type
      product_id: item.product_type === "product" ? (item.product_id ?? null) : null,
      single_id:  item.product_type === "single"  ? (item.product_id ?? null) : null,
      name:       item.name,
      price:      item.price,
      quantity:   item.quantity,
      image_url:  item.image ?? null, // field is image_url in DB, image in cart payload
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("[createOrder] items error:", itemsError);
      // Order was created — log the items error but don't fail the response
    }

    return NextResponse.json({ success: true, orderId: order.id });

  } catch (err) {
    console.error("[createOrder] unexpected error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
