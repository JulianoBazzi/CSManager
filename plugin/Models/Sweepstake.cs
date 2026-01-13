using System.Text.Json.Serialization;

namespace CSManagerPlugin.Models;

public class Sweepstake
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("departure_at")]
    public string DepartureAt { get; set; } = string.Empty;

    [JsonPropertyName("team_start_from_terrorist")]
    public string TeamStartFromTerrorist { get; set; } = string.Empty;

    [JsonPropertyName("maps")]
    public List<SweepstakeMap> Maps { get; set; } = new();
}