#!/bin/bash

set -e

ENV_FILE=".env.production"
ENV_KEY="VITE_TEACHER_APIKEY"
DEPLOY_SCRIPT="./deploy.sh"

# ===== Colors =====
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error()   { echo -e "${RED}❌ $1${NC}"; }
print_info()    { echo -e "${BLUE}ℹ️  $1${NC}"; }

# ===== sudo check =====
check_sudo() {
    if [ "$EUID" -ne 0 ]; then
        print_error "このスクリプトは sudo で実行する必要があります"
        echo ""
        echo "次のように実行してください:"
        echo "  sudo ./rotate_key_and_deploy.sh"
        exit 1
    fi
}

# ===== change key =====
update_API_key() {
    print_header "教師用認証キーの変更"

    echo "🔑 教師用認証キーを変更します"
    echo ""
    echo "このキーは、"
    echo "🧑‍🏫 新しい教師アカウントを登録する際の認証用キー"
    echo "として使用されます。"
    echo ""
    echo "⚠️  変更後は、古いキーは使用できなくなります。"
    echo ""

    read -p "新しい教師用認証キーを入力してください: " new_key

    if [ -z "$new_key" ]; then
        print_error "認証キーが入力されていません"
        exit 1
    fi

    # .env.production が存在しない場合
    if [ ! -f "$ENV_FILE" ]; then
        print_warning ".env.production が存在しないため、新規作成します"
        echo "$ENV_KEY=$new_key" > "$ENV_FILE"
    else
        if grep -q "^$ENV_KEY=" "$ENV_FILE"; then
            sed -i.bak "s/^$ENV_KEY=.*/$ENV_KEY=$new_key/" "$ENV_FILE"
        else
            echo "$ENV_KEY=$new_key" >> "$ENV_FILE"
        fi
    fi

    print_success "教師用認証キーを更新しました"
}

# ===== deploy =====
run_deploy() {
    print_header "再デプロイ開始"

    if [ ! -f "$DEPLOY_SCRIPT" ]; then
        print_error "deploy.sh が見つかりません"
        exit 1
    fi

    chmod +x "$DEPLOY_SCRIPT"

    print_info "deploy.sh を実行します..."
    sudo "$DEPLOY_SCRIPT"

    print_success "再デプロイが完了しました 🎉"
}

# ===== main =====
main() {
    check_sudo
    update_API_key
    run_deploy
}
1
main
