UPDATE issues
SET status = 'DONE', updated_at = CURRENT_TIMESTAMP
WHERE archived = 1 AND status <> 'DONE';
