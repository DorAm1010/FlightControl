using Newtonsoft.Json;
using System;

namespace FlightControlWeb.Model
{
    public class Flight
    {
        public Flight() { }

        public Flight(string id, double longitude, double latitude,
            int passangers, string companyName, DateTime dateTime, bool isExternal)
        {
            FlightId = id;
            Longitude = longitude;
            Latitude = latitude;
            Passengers = passangers;
            CompanyName = companyName;
            DateTime = dateTime;
            IsExternal = isExternal;
        }
        [JsonProperty(PropertyName ="flight_id")]
        public string FlightId { get; set; }
        [JsonProperty(PropertyName = "longitude")]
        public double Longitude { get; set; }
        [JsonProperty(PropertyName = "latitude")]
        public double Latitude { get; set; }
        [JsonProperty(PropertyName = "passengers")]
        public int Passengers { get; set; }
        [JsonProperty(PropertyName = "company_name")]
        public string CompanyName { get; set; }
        [JsonProperty(PropertyName = "date_time")]
        public DateTime DateTime { get; set; }
        [JsonProperty(PropertyName = "is_external")]
        public bool IsExternal { get; set; }
    }
}
