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

public class CSManagerPluginConfig : BasePluginConfig
{
    public string SweepstakeId { get; set; } = "f8e18acf-c043-4283-8e46-99d4e8c416d1";
}

public class CSManagerPlugin : BasePlugin, IPluginConfig<CSManagerPluginConfig>
{
    public override string ModuleName => "CSManager Plugin";
    public override string ModuleVersion => "1.0.0";
    public override string ModuleAuthor => "Bazzi Solutions";
    public override string ModuleDescription => "Exibe dados do CSManager no servidor";

    public CSManagerPluginConfig Config { get; set; } = new();
    private Sweepstake? _currentData;
    private readonly HttpClient _httpClient = new();
    private bool _isDisplayVisible = false;

    public void OnConfigParsed(CSManagerPluginConfig config)
    {
        Config = config;
    }

    public override void Load(bool hotReload)
    {
        Console.WriteLine($"[CSManager] Plugin carregado! ID: {Config.SweepstakeId}");

        RegisterListener<Listeners.OnTick>(() =>
        {
            if (_isDisplayVisible && _currentData != null)
            {
                UpdateHudForAllPlayers();
            }
        });
    }

    [ConsoleCommand("csm_plugin_open", "Busca e exibe os dados do mix")]
    [CommandHelper(whoCanExecute: CommandUsage.CLIENT_AND_SERVER)]
    public void OnOpenCommand(CCSPlayerController? player, CommandInfo command)
    {
        Server.PrintToChatAll($" {ChatColors.Green}[CSManager]{ChatColors.Default} Buscando dados...");

        Task.Run(async () =>
        {
            await FetchSweepstakeData();

            if (_currentData != null)
            {
                _isDisplayVisible = true;
                Server.NextFrame(() =>
                {
                    Server.PrintToChatAll($" {ChatColors.Green}[CSManager]{ChatColors.Default} Dados carregados! HUD ativado.");
                });
            }
            else
            {
                Server.NextFrame(() =>
                {
                    Server.PrintToChatAll($" {ChatColors.Red}[CSManager]{ChatColors.Default} Erro ao buscar dados.");
                });
            }
        });
    }

    [ConsoleCommand("csm_plugin_refresh", "Atualiza os dados do mix")]
    [CommandHelper(whoCanExecute: CommandUsage.CLIENT_AND_SERVER)]
    public void OnRefreshCommand(CCSPlayerController? player, CommandInfo command)
    {
        Server.PrintToChatAll($" {ChatColors.Green}[CSManager]{ChatColors.Default} Atualizando dados...");

        Task.Run(async () =>
        {
            await FetchSweepstakeData();

            Server.NextFrame(() =>
            {
                if (_currentData != null)
                {
                    Server.PrintToChatAll($" {ChatColors.Green}[CSManager]{ChatColors.Default} Dados atualizados!");
                }
                else
                {
                    Server.PrintToChatAll($" {ChatColors.Red}[CSManager]{ChatColors.Default} Erro ao atualizar dados.");
                }
            });
        });
    }

    [ConsoleCommand("csm_plugin_close", "Oculta os dados do mix")]
    [CommandHelper(whoCanExecute: CommandUsage.CLIENT_AND_SERVER)]
    public void OnCloseCommand(CCSPlayerController? player, CommandInfo command)
    {
        _isDisplayVisible = false;

        // Limpa o HUD de todos os jogadores
        var players = Utilities.GetPlayers().Where(p => p?.IsValid == true && !p.IsBot);
        players.ToList().ForEach(p => p.PrintToCenter(""));

        Server.PrintToChatAll($" {ChatColors.Green}[CSManager]{ChatColors.Default} HUD desativado.");
    }

    private async Task FetchSweepstakeData()
    {
        try
        {
            var url = $"https://csmanager.vercel.app/api/sweepstakes/{Config.SweepstakeId}";
            var response = await _httpClient.GetAsync(url);

            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync();
                _currentData = JsonSerializer.Deserialize<Sweepstake>(json);

                Console.WriteLine($"[CSManager] Dados atualizados! {_currentData?.Maps.Count ?? 0} mapas carregados.");
            }
            else
            {
                Console.WriteLine($"[CSManager] Erro HTTP: {response.StatusCode}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[CSManager] Erro: {ex.Message}");
        }
    }

    private void UpdateHudForAllPlayers()
    {
        if (_currentData == null) return;

        var hudText = BuildHudText(_currentData);

        var players = Utilities.GetPlayers().Where(p => p?.IsValid == true && !p.IsBot);
        players.ToList().ForEach(player => player.PrintToCenter(hudText));
    }

    private string BuildHudText(Sweepstake data)
    {
        var sb = new StringBuilder();

        // Cabeçalho
        sb.AppendLine("═══════════════════════════════");
        sb.AppendLine($"MIX {data.DepartureAt}");
        sb.AppendLine("═══════════════════════════════");        

        // Define times TR e CT
        var (trTeam, ctTeam) = data.TeamStartFromTerrorist == "team_one" ? ("Time 1", "Time 2") : ("Time 2", "Time 1");

        sb.AppendLine($"TR: {trTeam} | CT: {ctTeam}");
        sb.AppendLine("═══════════════════════════════");
        sb.AppendLine("");

        // Mapas
        data.Maps.ForEach(map =>
        {
            var mapName = $"{map.GetMapPrefix()}{map.Name.ToLower()}";
            var icon = map.GetMapIcon();

            sb.AppendLine($"{icon} {mapName}");

            // Time 1
            var team1Trophy = GetTrophyText(map.Status, "team_one");
            var team1Total = map.TeamOneScore1 + map.TeamOneScore2;
            sb.AppendLine($"Time 1: {map.TeamOneScore1} + {map.TeamOneScore2} {team1Trophy}");

            // Time 2
            var team2Trophy = GetTrophyText(map.Status, "team_two");
            var team2Total = map.TeamTwoScore1 + map.TeamTwoScore2;
            sb.AppendLine($"Time 2: {map.TeamTwoScore1} + {map.TeamTwoScore2} {team2Trophy}");

            sb.AppendLine("───────────────────────────────");
        });

        return sb.ToString();
    }

    private string GetTrophyText(string status, string team)
    {
        return status switch
        {
            "pending" => "",
            "draw" => "⚪",
            _ when status == team => "🏆",
            _ => ""
        };
    }

    public override void Unload(bool hotReload)
    {
        _httpClient.Dispose();
    }
}
