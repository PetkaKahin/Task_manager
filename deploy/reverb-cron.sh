#!/bin/bash
# Проверяет, запущен ли Reverb, и запускает если нет.
# Добавить в crontab:
# * * * * * /path/to/project/deploy/reverb-cron.sh >> /path/to/project/storage/logs/reverb.log 2>&1

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LOCK_FILE="$PROJECT_DIR/storage/logs/reverb.pid"

if [ -f "$LOCK_FILE" ] && kill -0 "$(cat "$LOCK_FILE")" 2>/dev/null; then
    exit 0
fi

cd "$PROJECT_DIR"
nohup php artisan reverb:start --host=0.0.0.0 --port=8080 > /dev/null 2>&1 &
echo $! > "$LOCK_FILE"