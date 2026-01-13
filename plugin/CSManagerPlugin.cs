using CounterStrikeSharp.API;
using CounterStrikeSharp.API.Core;
using CounterStrikeSharp.API.Core.Attributes.Registration;
using CounterStrikeSharp.API.Modules.Commands;
using CounterStrikeSharp.API.Modules.Timers;
using CounterStrikeSharp.API.Modules.Utils;
using CSManagerPlugin.Models;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using Timer = CounterStrikeSharp.API.Modules.Timers.Timer;

namespace CSManagerPlugin;

public class CSManagerPlugin : BasePlugin
{
    public override string ModuleName => "CSManager Plugin";
    public override string ModuleVersion => "1.0.0";
    public override string ModuleAuthor => "Bazzi Solutions";
    public override string ModuleDescription => "Exibe dados do CSManager no servidor";

    private Sweepstake? _currentData;
    private readonly HttpClient _httpClient = new();

    public override void Load(bool hotReload)
    {
        Console.WriteLine("[CSManager] Plugin carregado!");
    }

    [ConsoleCommand("csm_plugin_chat", "Busca e exibe os dados do mix no chat")]
    [CommandHelper(minArgs: 1, usage: "[sweepstake_id]", whoCanExecute: CommandUsage.CLIENT_AND_SERVER)]
    public void OnRefreshCommand(CCSPlayerController? player, CommandInfo command)
    {
        if (command.ArgCount < 2)
        {
            Server.PrintToChatAll($" {ChatColors.Red}[CSManager Plugin]{ChatColors.Default} Uso: csm_plugin_chat [sweepstake_id]");
            return;
        }

        var sweepstakeId = command.GetArg(1);

        if (string.IsNullOrWhiteSpace(sweepstakeId))
        {
            Server.PrintToChatAll($" {ChatColors.Red}[CSManager Plugin]{ChatColors.Default} ID do sweepstake inválido!");
            return;
        }

        Server.PrintToChatAll($" {ChatColors.Blue}[CSManager Plugin]{ChatColors.Default} Buscando dados...");

        Task.Run(async () =>
        {
            await FetchSweepstakeData(sweepstakeId);

            Server.NextFrame(() =>
            {
                if (_currentData != null)
                {
                    DisplayDataInChat();
                }
                else
                {
                    Server.PrintToChatAll($" {ChatColors.Red}[CSManager Plugin]{ChatColors.Default} Erro ao buscar dados.");
                }
            });
        });
    }

    [ConsoleCommand("csm_plugin_start_mix", "Inicia a partida do mix")]
    [CommandHelper(whoCanExecute: CommandUsage.CLIENT_AND_SERVER)]
    public void OnStartMixCommand(CCSPlayerController? player, CommandInfo command)
    {
        // Executa o arquivo mix.cfg
        Server.ExecuteCommand("exec mix.cfg");

        // Avisos para os jogadores
        Server.PrintToChatAll($" {ChatColors.Green}⚠️ ATENÇÃO: PARTIDA MIX INICIADA ⚠️");
        Server.PrintToChatAll($" {ChatColors.Orange}A partir de agora, a partida está VALENDO!");
        Server.PrintToChatAll($" {ChatColors.LightBlue}Configurações do MIX carregadas.");

        // Log no console
        Console.WriteLine("[CSManager Plugin] Partida do MIX iniciada! Arquivo mix.cfg executado.");
    }

    [ConsoleCommand("csm_plugin_start_x1", "Inicia a partida x1")]
    [CommandHelper(whoCanExecute: CommandUsage.CLIENT_AND_SERVER)]
    public void OnStartX1Command(CCSPlayerController? player, CommandInfo command)
    {
        // Executa o arquivo x1.cfg
        Server.ExecuteCommand("exec x1.cfg");

        // Avisos para os jogadores
        Server.PrintToChatAll($" {ChatColors.Green}⚠️ ATENÇÃO: PARTIDA X1 INICIADA ⚠️");
        Server.PrintToChatAll($" {ChatColors.Orange}A partir de agora, a partida está VALENDO!");
        Server.PrintToChatAll($" {ChatColors.LightBlue}Configurações do X1 carregadas.");

        // Log no console
        Console.WriteLine("[CSManager Plugin] Partida X1 iniciada! Arquivo x1.cfg executado.");
    }

    private async Task FetchSweepstakeData(string sweepstakeId)
    {
        try
        {
            var url = $"https://csmanager.vercel.app/api/sweepstakes/{sweepstakeId}";
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                _currentData = JsonSerializer.Deserialize<Sweepstake>(json);

                Console.WriteLine($"[CSManager Plugin] Dados atualizados para o sweepstake: {sweepstakeId}");
            }
            else
            {
                Console.WriteLine($"[CSManager Plugin] Erro HTTP: {response.StatusCode}");
                _currentData = null;
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[CSManager Plugin] Erro: {ex.Message}");
            _currentData = null;
        }
    }

    private void DisplayDataInChat()
    {
        if (_currentData == null) return;

        var chatText = BuildChatMessages(_currentData);

        // Separa por linhas e envia cada uma
        var lines = chatText.Split('\n');
        foreach (var line in lines)
        {
            if (!string.IsNullOrWhiteSpace(line))
            {
                Server.PrintToChatAll(line);
            }
        }
    }

    private string BuildChatMessages(Sweepstake data)
    {
        var sb = new StringBuilder();
        var teamOneColor = data.TeamStartFromTerrorist == "team_one" ? ChatColors.Red : ChatColors.Blue;
        var teamTwoColor = data.TeamStartFromTerrorist == "team_one" ? ChatColors.Blue : ChatColors.Red;

        // Cabeçalho
        var (trTeam, ctTeam) = data.TeamStartFromTerrorist == "team_one" ? ("Time 1", "Time 2") : ("Time 2", "Time 1");
        sb.AppendLine($" {ChatColors.LightYellow}CS2 MIX {data.DepartureAt} {ChatColors.Default}| {ChatColors.Red}TR: {trTeam} {ChatColors.Default}| {ChatColors.Blue}CT: {ctTeam}");

        // Mapas - cada mapa em uma única linha
        for (int i = 0; i < data.Maps.Count; i++)
        {
            var map = data.Maps[i];
            var mapName = $"{map.GetMapPrefix()}{map.Name.ToLower()}";

            sb.AppendLine($" {ChatColors.Yellow}{mapName} {ChatColors.Default}| {teamOneColor}Time 1: {map.TeamOneScore1} + {map.TeamOneScore2} {GetTrophyText(map.Status, "team_one")} {ChatColors.Default}| {teamTwoColor}Time 2: {map.TeamTwoScore1} + {map.TeamTwoScore2} {GetTrophyText(map.Status, "team_two")}");
        }

        return sb.ToString();
    }

    private string GetTrophyText(string status, string team)
    {
        return status switch
        {
            "pending" => "",
            "draw" => "⚠️",
            _ when status == team => "✅",
            _ => ""
        };
    }

    public override void Unload(bool hotReload)
    {
        _httpClient.Dispose();
    }
}
