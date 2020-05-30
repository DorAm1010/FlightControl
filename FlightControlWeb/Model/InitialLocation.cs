using System;
using Newtonsoft.Json;
namespace FlightControlWeb.Model
{
    public class InitialLocation
    {
        [JsonProperty("longitude")]
        public double Longitude { get; set; }
        [JsonProperty("latitude")]
        public double Latitude { get; set; }

        // format: yyyy-dd-MMThh:mm:ssZ
        [JsonProperty("date_time")]
        public DateTime DateTime { get; set; }
    }
}
