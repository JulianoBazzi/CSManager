using System.Text.Json.Serialization;

namespace CSManagerPlugin.Models;

public class SweepstakeMap
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("map_type")]
    public string MapType { get; set; } = string.Empty;

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("team_one_score_1")]
    public int TeamOneScore1 { get; set; }

    [JsonPropertyName("team_one_score_2")]
    public int TeamOneScore2 { get; set; }

    [JsonPropertyName("team_two_score_1")]
    public int TeamTwoScore1 { get; set; }

    [JsonPropertyName("team_two_score_2")]
    public int TeamTwoScore2 { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; } = "pending";

    public string GetMapPrefix()
    {
        return MapType switch
        {
            "bomb" => "de_",
            "hostage" => "cs_",
            _ => ""
        };
    }

    public string GetMapIcon()
    {
        return MapType == "bomb" ? "💣" : "👥";
    }
}