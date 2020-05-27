using System;
using Microsoft.AspNetCore.Mvc;
using FlightControlWeb.Model;
using FlightControlWeb.DataBase;
using System.Collections.Generic;

namespace FlightControlWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightsController : ControllerBase
    {
        private IDataBase<string, FlightPlan> _dataBase;
        public FlightsController(IDataBase<string, FlightPlan> dataBase)
        {
            _dataBase = dataBase;
        }

        // GET: api/Flights?relative_to=<DATE_TIME>
        // get internal or internal and external flights active relative to time of request
        [HttpGet]
        public IEnumerable<Flight> Get([FromQuery] DateTime relative_to)
        {
            bool isExternal = Request.QueryString.Value.Contains("sync_all");
            List<Flight> flights = new List<Flight>();
            List<FlightPlan> flightPlans = (List<FlightPlan>)_dataBase.GetAllValues();
            foreach (FlightPlan plan in flightPlans)
            {
                if (plan.InFlightRelativeTo(relative_to))
                {
                    var tuple = plan.Interpolate(relative_to);
                    Flight flight = new Flight(plan.HashId(), tuple.Item1, tuple.Item2,
                        plan.Passengers, plan.CompanyName, plan.GetCurrentDateTime(), false);
                    flights.Add(flight);
                }
            }

            return null;
        }

        // DELETE: api/ApiWithActions/id
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            return Ok();
        }
    }
}
