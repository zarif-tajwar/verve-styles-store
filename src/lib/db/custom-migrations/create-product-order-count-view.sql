-- DECLARING THE VIEW
CREATE MATERIALIZED VIEW IF NOT EXISTS product_sales_count_view AS
SELECT
    pe.product_id,
    SUM(ol.quantity) AS total_sales
FROM
    product_entries pe
    JOIN order_line ol ON pe.id = ol.product_entry_id
GROUP BY
    pe.product_id;

-- DECLARING THE INDEX
CREATE INDEX IF NOT EXISTS idx_product_sales_count_view ON product_sales_count_view (product_id, total_sales);