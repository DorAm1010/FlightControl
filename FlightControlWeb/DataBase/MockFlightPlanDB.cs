using FlightControlWeb.Model;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using System;
using System.Collections.Generic;

namespace FlightControlWeb.DataBase
{
    public class MockFlightPlanDB
    {
        List<FlightPlan> flightPlans = new List<FlightPlan> {
            new FlightPlan {
                Passengers = 1,
                CompanyName = "AirAmrani",
                InitialLocation = new InitialLocation {
                    Longitude = 10.10,
                    Latitude = 19.94,
                    DateTime = DateTime.Parse("2020-01-01T22:00:01Z").ToUniversalTime()
                },
                Segments = new List<Segment>{
                    new Segment {
                        Longitude = 13.234,
                        Latitude = 12.18,
                        TimeSpan = 500
                    },
                    new Segment {
                        Longitude = 35.334,
                        Latitude = 32.43523563,
                        TimeSpan = 1000
                    },
                    new Segment {
                        Longitude = 60.234,
                        Latitude = 50.18,
                        TimeSpan = 2500
                    }
                }
            },
            new FlightPlan
            {
                Passengers = 19,
                CompanyName = "MosheCorp",
                InitialLocation = new InitialLocation {
                    Longitude = 16.7,
                    Latitude = 19.93,
                    DateTime = DateTime.Parse("2020-01-01T21:00:01Z").ToUniversalTime()
                },
                Segments = new List<Segment>{
                    new Segment {
                        Longitude = 12.234,
                        Latitude = 27.58,
                        TimeSpan = 600
                    },
                    new Segment {
                        Longitude = 25.334,
                        Latitude = 32.43523563,
                        TimeSpan = 800
                    },
                    new Segment {
                        Longitude = 30.234,
                        Latitude = 35.18,
                        TimeSpan = 500
                    }
                }
            },
            new FlightPlan
            {
                Passengers = 666,
                CompanyName = "FlatEarthSociety",
                InitialLocation = new InitialLocation {
                    Longitude = 0.0,
                    Latitude = 0,
                    DateTime = DateTime.Parse("2020-01-01T21:30:01Z").ToUniversalTime()
                },
                Segments = new List<Segment>{
                    new Segment {
                        Longitude = 23.4,
                        Latitude = 27.58,
                        TimeSpan = 1000
                    },
                    new Segment {
                        Longitude = 100.334,
                        Latitude = 80.43523563,
                        TimeSpan = 800
                    },
                    new Segment {
                        Longitude = 0,
                        Latitude = 0,
                        TimeSpan = 2500
                    }
                }
            }
        };
        
        public void Post(FlightPlan plan)
        {
            flightPlans.Add(plan);
        }

        public FlightPlan Get(string id)
        {
            foreach (FlightPlan plan in flightPlans)
            {
                if (plan.HashId() == id)
                    return plan;
            }
            return null;
        }
    }
}
