SELECT 
    o.order_id,
    t.table_number,
    o.order_time,
    ARRAY_AGG(
        jsonb_build_object(
            'item_name', mi.name,
            'quantity', oi.quantity,
            'customizations', oi.customizations
        )
    ) AS items
FROM Orders o
JOIN Tables t ON o.table_id = t.table_id
JOIN Order_Items oi ON o.order_id = oi.order_id
JOIN Menu_Items mi ON oi.item_id = mi.item_id
WHERE o.order_time >= NOW() - INTERVAL '1 hour'
GROUP BY o.order_id, t.table_number, o.order_time
ORDER BY o.order_time DESC;
