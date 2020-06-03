using FlightControlWeb.Model;
using System;
using System.Collections.Generic;

namespace FlightControlWeb.DataBase
{
    public class MockFlightsDB
    {
        MockFlightPlanDB mock = new MockFlightPlanDB();

        public IEnumerable<Flight> GetFlights()
        {
            List<Flight> flights = new List<Flight>();
            DateTime universal = DateTime.UtcNow.AddMinutes(20);

            foreach (FlightPlan plan in mock.flightPlans)
            {
                var tuple = plan.Interpolate(universal);
                Flight flight = new Flight(plan.HashId(), tuple.Item1, tuple.Item2,
                        plan.Passengers, plan.CompanyName, universal, false);
                flights.Add(flight);
            }
            return flights;
        }
    }
}
