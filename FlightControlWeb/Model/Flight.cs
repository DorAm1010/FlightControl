using System;

namespace FlightControlWeb.Model
{
    public class Flight
    {
        public Flight() { }

        public Flight(string id, double longitude, double latitude,
            int passangers, string companyName, DateTime dateTime, bool isExternal)
        {
            Id = id;
            Longitude = longitude;
            Latitude = latitude;
            Passengers = passangers;
            CompanyName = companyName;
            DateTime = dateTime;
            IsExternal = isExternal;
        }

        public string Id { get; set; }
        public double Longitude { get; set; }
        public double Latitude { get; set; }
        public int Passengers { get; set; }
        public string CompanyName { get; set; }
        public DateTime DateTime { get; set; }
        public bool IsExternal { get; set; }
    }
}
