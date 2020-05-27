﻿using FlightControlWeb.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlightControlWeb.DataBase
{
    public class MockFlightsDB
    {
        public Flight GetFlightById(uint id)
        {
            switch (id)
            {
                case 205927916:
                    return new Flight
                    {
                        Id = "DA1010",
                        CompanyName = "DorAmraniAir",
                        DateTime = DateTime.Parse("1994-10-10T10:10:10Z"),
                        IsExternal = false,
                        Latitude = 32.345,
                        Longitude = 34.654,
                        Passangers = 233
                    };
                case 123456789:
                    return new Flight
                    {
                        Id = "YM1111",
                        CompanyName = "YakirMosheCorp",
                        DateTime = DateTime.Parse("1994-06-08T12:34:56Z"),
                        IsExternal = false,
                        Latitude = 29.4564573,
                        Longitude = 36.63568658,
                        Passangers = 144
                    };
                case 987654321:
                    return new Flight
                    {
                        Id = "SA1212",
                        CompanyName = "FlatEarthSociety",
                        DateTime = DateTime.Parse("0000-04-20T23:12:33Z"),
                        IsExternal = false,
                        Latitude = 2.333345,
                        Longitude = 38.9,
                        Passangers = 256
                    };
                default:
                    return new Flight
                    {
                        Id = "EL0909",
                        CompanyName = "YallaMaccabi",
                        DateTime = DateTime.Parse("1906-08-08T12:10:99Z"),
                        IsExternal = false,
                        Latitude = 69.420,
                        Longitude = 7.77,
                        Passangers = 1
                    };
            }
        }

        public IEnumerable<Flight> GetFlights()
        {
            var flights = new List<Flight> {
            new Flight
            {
                Id = "DA1010",
                CompanyName = "DorAmraniAir",
                DateTime = DateTime.Parse("1994-10-10T10:10:10Z"),
                IsExternal = false,
                Latitude = 32.345,
                Longitude = 34.654,
                Passangers = 233
            },
            new Flight
            {
                Id = "YM1111",
                CompanyName = "YakirMosheCorp",
                DateTime = DateTime.Parse("1994-06-08T12:34:56Z"),
                IsExternal = false,
                Latitude = 29.4564573,
                Longitude = 36.63568658,
                Passangers = 144
            },
            new Flight
            {
                Id = "SA1212",
                CompanyName = "FlatEarthSociety",
                DateTime = DateTime.Parse("0000-04-20T23:12:33Z"),
                IsExternal = false,
                Latitude = 2.333345,
                Longitude = 38.9,
                Passangers = 256
            },
            new Flight
            {
                Id = "EL0909",
                CompanyName = "YallaMaccabi",
                DateTime = DateTime.Parse("1906-08-08T12:10:99Z"),
                IsExternal = false,
                Latitude = 69.420,
                Longitude = 7.77,
                Passangers = 1
            },
        };
            return flights;
        }
    }
}