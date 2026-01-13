echo "🔨 Compilando CSManagerPlugin..."

# Limpar builds anteriores
rm -rf bin obj publish

# Restaurar dependências
dotnet restore

# Build em Release
dotnet build -c Release

# Publicar
dotnet publish -c Release -o ./publish

echo "✅ Build concluído! DLL em: ./publish/CSManagerPlugin.dll"
echo ""
echo "📋 Para instalar:"
echo "1. Copie ./publish/CSManagerPlugin.dll para game/csgo/addons/counterstrikesharp/plugins/CSManagerPlugin/"
echo "2. Copie ./Config/config.json para o mesmo diretório"
echo "3. Reinicie o servidor"
