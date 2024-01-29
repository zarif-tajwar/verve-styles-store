-- DECLARING THE VIEW
CREATE MATERIALIZED VIEW IF NOT EXISTS product_rating_view AS
SELECT
    pe.product_id AS product_id,
    ROUND(AVG(ur.rating), 1) AS average_rating
FROM
    user_reviews ur
    LEFT JOIN order_line ol ON ur.order_line_id = ol.id
    LEFT JOIN product_entries pe ON ol.product_entry_id = pe.id
GROUP BY
    pe.product_id;

-- DECLARING THE INDEX
CREATE INDEX IF NOT EXISTS idx_product_rating_view ON product_rating_view (product_id, average_rating);