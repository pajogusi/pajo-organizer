#!/bin/bash

set -e

cd ~/pajo-organizer || exit 1

echo "🔧 A preparar branch main..."
git branch -M main

echo "🔧 A remover origin antigo, se existir..."
git remote remove origin 2>/dev/null || true

echo "🔗 A adicionar origin correto..."
git remote add origin https://github.com/pajogusi/pajo-organizer.git

echo "📦 A verificar commit..."
git add .
git commit -m "Primeira versão do Pàjó Organizer" || echo "⚠️ Nada novo para commit."

echo
echo "⚠️ IMPORTANTE:"
echo "Antes do push, confirma que já criaste no GitHub um repositório vazio chamado:"
echo "pajo-organizer"
echo
read -p "Já criaste o repositório no GitHub? (s/n): " resposta

if [ "$resposta" != "s" ]; then
    echo "❌ Cria primeiro o repositório no GitHub e volta a correr este script."
    exit 1
fi

echo "🚀 A enviar para GitHub..."
git push -u origin main

echo "✅ Publicado no GitHub."
