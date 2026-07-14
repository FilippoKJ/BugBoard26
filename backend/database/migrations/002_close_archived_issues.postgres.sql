UPDATE issues
SET status = 'DONE', updated_at = CURRENT_TIMESTAMP
WHERE archived = TRUE AND status <> 'DONE';
