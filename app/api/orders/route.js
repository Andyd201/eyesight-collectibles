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

    // Create order items
    const orderItems = items.map((item) => ({
      order_id:     order.id,
      product_id:   item.product_id,
      product_type: item.product_type,
      name:         item.name,
      price:        item.price,
      quantity:     item.quantity,
      image:        item.image ?? null,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("[createOrder] items error:", itemsError);
      // Order was created, just log the items error
    }

    return NextResponse.json({ success: true, orderId: order.id });

  } catch (err) {
    console.error("[createOrder] unexpected error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
