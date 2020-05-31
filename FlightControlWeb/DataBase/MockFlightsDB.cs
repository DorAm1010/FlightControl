using FlightControlWeb.Model;
using System;
using System.Collections.Generic;

namespace FlightControlWeb.DataBase
{
    public class MockFlightsDB
    {
        public Flight GetFlightById(int id)
        {
            switch (id)
            {
                case 205927916:
                    return new Flight
                    {
                        FlightId = "DA1010",
                        CompanyName = "DorAmraniAir",
                        DateTime = DateTime.Parse("1994-10-10T10:10:10Z").ToUniversalTime(),
                        IsExternal = false,
                        Latitude = 32.345,
                        Longitude = 34.654,
                        Passengers = 233
                    };
                case 123456789:
                    return new Flight
                    {
                        FlightId = "YM1111",
                        CompanyName = "YakirMosheCorp",
                        DateTime = DateTime.Parse("1994-06-08T12:34:56Z").ToUniversalTime(),
                        IsExternal = false,
                        Latitude = 29.4564573,
                        Longitude = 36.63568658,
                        Passengers = 144
                    };
                case 987654321:
                    return new Flight
                    {
                        FlightId = "SA1212",
                        CompanyName = "FlatEarthSociety",
                        DateTime = DateTime.Parse("0001-04-20T23:12:33Z").ToUniversalTime(),
                        IsExternal = false,
                        Latitude = 2.333345,
                        Longitude = 38.9,
                        Passengers = 256
                    };
                default:
                    return new Flight
                    {
                        FlightId = "EL0909",
                        CompanyName = "YallaMaccabi",
                        DateTime = DateTime.Parse("1906-08-08T12:10:09Z").ToUniversalTime(),
                        IsExternal = false,
                        Latitude = 69.420,
                        Longitude = 7.77,
                        Passengers = 1
                    };
            }
        }

        public IEnumerable<Flight> GetFlights()
        {
            var flights = new List<Flight> {
            new Flight
            {
                FlightId = "DA1010",
                CompanyName = "DorAmraniAir",
                DateTime = DateTime.Parse("1994-10-10T10:10:10Z").ToUniversalTime(),
                IsExternal = false,
                Latitude = 32.345,
                Longitude = 34.654,
                Passengers = 233
            },
            new Flight
            {
                FlightId = "YM1111",
                CompanyName = "YakirMosheCorp",
                DateTime = DateTime.Parse("1994-06-08T12:34:56Z").ToUniversalTime(),
                IsExternal = false,
                Latitude = 29.4564573,
                Longitude = 36.63568658,
                Passengers = 144
            },
            new Flight
            {
                FlightId = "SA1212",
                CompanyName = "FlatEarthSociety",
                DateTime = DateTime.Parse("1234-04-20T23:12:33Z").ToUniversalTime(),
                IsExternal = false,
                Latitude = 2.333345,
                Longitude = 38.9,
                Passengers = 256
            },
            new Flight
            {
                FlightId = "EL0909",
                CompanyName = "YallaMaccabi",
                DateTime = DateTime.Parse("1906-08-08T12:10:45Z").ToUniversalTime(),
                IsExternal = false,
                Latitude = 69.420,
                Longitude = 7.77,
                Passengers = 1
            },
        };
            return flights;
        }
    }
}
