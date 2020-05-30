using Newtonsoft.Json;

namespace FlightControlWeb.Model
{
    public class Segment
    {
        [JsonProperty("longitude")]
        public double Longitude { get; set; }
        [JsonProperty("latitude")]
        public double Latitude { get; set; }
        [JsonProperty("timespan_seconds")]
        public int TimeSpan { get; set; }
    }
}
