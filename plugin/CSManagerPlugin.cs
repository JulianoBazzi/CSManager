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
    public override string ModuleVersion => "1.0.4";
    public override string ModuleAuthor => "Bazzi Solutions";
    public override string ModuleDescription => "Exibe dados do CSManager no servidor";

    private Sweepstake? _currentData;
    private readonly HttpClient _httpClient = new();

    private readonly HashSet<ulong> _authorizedSteamIds = new()
    {
        76561197998631986 // Juliano Bazzi
    };

    public override void Load(bool hotReload)
    {
        Console.WriteLine("[CSManager] Plugin carregado!");
    }

    private bool HasPermission(CCSPlayerController? player)
    {
        if (player == null)
            return true;

        if (!player.IsValid || player.AuthorizedSteamID == null)
            return false;

        return _authorizedSteamIds.Contains(player.AuthorizedSteamID.SteamId64);
    }

    [ConsoleCommand("csm_score", "Busca e exibe os dados do mix no chat")]
    [CommandHelper(minArgs: 1, usage: "[sweepstake_id]", whoCanExecute: CommandUsage.CLIENT_AND_SERVER)]
    public void OnRefreshCommand(CCSPlayerController? player, CommandInfo command)
    {
        if (!HasPermission(player))
        {
            if (player != null)
                player.PrintToChat($" {ChatColors.Red}[CSManager Plugin]{ChatColors.Default} Você não tem permissão para usar este comando!");
            return;
        }

        if (command.ArgCount < 2)
        {
            Server.PrintToChatAll($" {ChatColors.Red}[CSManager Plugin]{ChatColors.Default} Uso: csm_score [sweepstake_id]");
            return;
        }

        var sweepstakeId = command.GetArg(1);

        if (string.IsNullOrWhiteSpace(sweepstakeId))
        {
            Server.PrintToChatAll($" {ChatColors.Red}[CSManager Plugin]{ChatColors.Default} ID do sweepstake inválido!");
            return;
        }

        Server.PrintToChatAll($" {ChatColors.Blue}[CSManager Plugin]{ChatColors.Default} SBP - Sistema Bazzi de Pontuação informa:");

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

    [ConsoleCommand("csm_start_mix", "Inicia a partida do mix")]
    [CommandHelper(whoCanExecute: CommandUsage.CLIENT_AND_SERVER)]
    public void OnStartMixCommand(CCSPlayerController? player, CommandInfo command)
    {
        if (!HasPermission(player))
        {
            if (player != null)
                player.PrintToChat($" {ChatColors.Red}[CSManager Plugin]{ChatColors.Default} Você não tem permissão para usar este comando!");
            return;
        }

        Server.ExecuteCommand("exec mix.cfg");
        Server.PrintToChatAll($" {ChatColors.Green}⚠️ ATENÇÃO: PARTIDA MIX INICIADA ⚠️");
        Server.PrintToChatAll($" {ChatColors.Orange}A partir de agora, a partida está VALENDO!");
        Server.PrintToChatAll($" {ChatColors.LightBlue}Configurações do MIX carregadas.");
        Console.WriteLine("[CSManager Plugin] Partida do MIX iniciada! Arquivo mix.cfg executado.");
    }

    [ConsoleCommand("csm_start_x1", "Inicia a partida x1")]
    [CommandHelper(whoCanExecute: CommandUsage.CLIENT_AND_SERVER)]
    public void OnStartX1Command(CCSPlayerController? player, CommandInfo command)
    {
        if (!HasPermission(player))
        {
            if (player != null)
                player.PrintToChat($" {ChatColors.Red}[CSManager Plugin]{ChatColors.Default} Você não tem permissão para usar este comando!");
            return;
        }

        Server.ExecuteCommand("exec x1.cfg");
        Server.PrintToChatAll($" {ChatColors.Green}⚠️ ATENÇÃO: PARTIDA X1 INICIADA ⚠️");
        Server.PrintToChatAll($" {ChatColors.Orange}A partir de agora, a partida está VALENDO!");
        Server.PrintToChatAll($" {ChatColors.LightBlue}Configurações do X1 carregadas.");
        Console.WriteLine("[CSManager Plugin] Partida X1 iniciada! Arquivo x1.cfg executado.");
    }

    [ConsoleCommand("csm_map", "Troca o mapa do servidor")]
    [CommandHelper(minArgs: 1, usage: "[map_name]", whoCanExecute: CommandUsage.CLIENT_AND_SERVER)]
    public void OnChangeMapCommand(CCSPlayerController? player, CommandInfo command)
    {
        if (!HasPermission(player))
        {
            if (player != null)
                player.PrintToChat($" {ChatColors.Red}[CSManager Plugin]{ChatColors.Default} Você não tem permissão para usar este comando!");
            return;
        }

        if (command.ArgCount < 2)
        {
            Server.PrintToChatAll($" {ChatColors.Red}[CSManager Plugin]{ChatColors.Default} Uso: csm_map [map_name]");
            return;
        }

        var mapName = command.GetArg(1);

        if (string.IsNullOrWhiteSpace(mapName))
        {
            Server.PrintToChatAll($" {ChatColors.Red}[CSManager Plugin]{ChatColors.Default} Nome do mapa inválido!");
            return;
        }

        var isNumericOnly = mapName.All(char.IsDigit);

        Server.PrintToChatAll($" {ChatColors.Blue}[CSManager Plugin]{ChatColors.Default} O mapa será trocado em {ChatColors.Yellow}10 segundos{ChatColors.Default}...");
        Server.PrintToChatAll($" {ChatColors.LightBlue}Novo mapa: {ChatColors.Yellow}{mapName}");

        AddTimer(10.0f, () =>
        {
            if (isNumericOnly)
            {
                Server.ExecuteCommand($"host_workshop_map {mapName}");
                Server.PrintToChatAll($" {ChatColors.Green}[CSManager Plugin]{ChatColors.Default} Trocando para mapa da Workshop: {ChatColors.Yellow}{mapName}");
                Console.WriteLine($"[CSManager Plugin] Executando: host_workshop_map {mapName}");
            }
            else
            {
                Server.ExecuteCommand($"map {mapName}");
                Server.PrintToChatAll($" {ChatColors.Green}[CSManager Plugin]{ChatColors.Default} Trocando para mapa: {ChatColors.Yellow}{mapName}");
                Console.WriteLine($"[CSManager Plugin] Executando: map {mapName}");
            }
        });
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
        var (trTeam, ctTeam) = data.TeamStartFromTerrorist == "team_one" ? ("Time 1", "Time 2") : ("Time 2", "Time 1");
        sb.AppendLine($" {ChatColors.LightYellow}CS2 MIX {data.DepartureAt} {ChatColors.Default}| {ChatColors.Red}TR: {trTeam} {ChatColors.Default}| {ChatColors.Blue}CT: {ctTeam}");

        for (int i = 0; i < data.Maps.Count; i++)
        {
            var map = data.Maps[i];
            var mapName = $"{map.GetMapPrefix()}{map.Name.ToLower()}";
            var totalScore = map.TeamOneScore1 + map.TeamOneScore2 + map.TeamTwoScore1 + map.TeamTwoScore2;

            if (totalScore > 0)
            {
                var team1Total = map.TeamOneScore1 + map.TeamOneScore2;
                var team2Total = map.TeamTwoScore1 + map.TeamTwoScore2;

                var team1Color = data.TeamStartFromTerrorist == "team_one" ? ChatColors.Red : ChatColors.Blue;
                var team2Color = data.TeamStartFromTerrorist == "team_one" ? ChatColors.Blue : ChatColors.Red;
                var scoreColor = ChatColors.Yellow;

                if (map.Status == "draw")
                {
                    team1Color = ChatColors.Grey;
                    team2Color = ChatColors.Grey;
                    scoreColor = ChatColors.LightBlue;
                }
                else if (map.Status == "team_one")
                {
                    team1Color = ChatColors.Green;
                    team2Color = ChatColors.Grey;
                }
                else if (map.Status == "team_two")
                {
                    team1Color = ChatColors.Grey;
                    team2Color = ChatColors.Green;
                }

                sb.AppendLine($" {ChatColors.Yellow}{mapName}: {ChatColors.Default}{team1Color}Time 1 {ChatColors.Yellow}[{ChatColors.Default}{scoreColor}{team1Total} {ChatColors.Yellow}x {ChatColors.Default}{scoreColor}{team2Total}{ChatColors.Yellow}] {ChatColors.Default}{team2Color}Time 2");
            }
        }

        return sb.ToString();
    }

    public override void Unload(bool hotReload)
    {
        _httpClient.Dispose();
    }
}
