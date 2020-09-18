import React from "react";
import { useAppState, useDispatch } from "../store";

export function Order() {
  const { order } = useAppState();
  const dispatch = useDispatch();

  return (
    <div>
      <span>Order</span>
      <div>
        {order.order.map(item => (
            <div key={item.menuId}>{item.menuId} {item.quantity}</div>
        ))}
        <span>
          {order.price} {order.isDeal ? order.deal?.name : 'No deal'}
        </span>
      </div>
      <button onClick={() => dispatch({ type: "addOrderItem", payload: { menuId: 1, quantity: 1 } })}>Add 1</button>
      <button onClick={() => dispatch({ type: "addOrderItem", payload: { menuId: 5, quantity: 1 } })}>Add 5</button>
      <button onClick={() => dispatch({ type: "addOrderItem", payload: { menuId: 11, quantity: 1 } })}>Add 11</button>
    </div>
  );
}
