using System;
using Microsoft.AspNetCore.Mvc;
using FlightControlWeb.Model;
using FlightControlWeb.DataBase;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;
using System.IO;

namespace FlightControlWeb.Controllers
{
    [ApiController]
    [Route("api/Flights")]
    public class FlightsController : ControllerBase
    {
        private IDataBase<string, FlightPlan> _flightPlansDataBase;
        private IDataBase<string, Server> _serversDataBase;

        private MockFlightsDB mock = new MockFlightsDB();
        public FlightsController(IDataBase<string, FlightPlan> flightPlansDataBase, IDataBase<string, Server> serversDataBase)
        {
            _flightPlansDataBase = flightPlansDataBase;
            _serversDataBase = serversDataBase;
        }

        // GET: api/Flights?relative_to=<DATE_TIME>
        // get internal or internal and external flights active relative to time of request
        [HttpGet]
        public async Task<IEnumerable<Flight>> Get([FromQuery] DateTime relative_to)
        {
            bool isExternal = Request.QueryString.Value.Contains("sync_all");
            DateTime universal = relative_to;
            List<Flight> flights = new List<Flight>();
            List<string> flightsIDs = (List<string>)_flightPlansDataBase.GetAllKeys();
            foreach (string id in flightsIDs)
            {
                FlightPlan plan = _flightPlansDataBase.GetById(id);
                if (plan.InFlightRelativeTo(universal))
                {
                    var tuple = plan.Interpolate(universal);
                    Flight flight = new Flight(id, tuple.Item1, tuple.Item2,
                        plan.Passengers, plan.CompanyName, universal, false);
                    flights.Add(flight);
                }
            }
            if (isExternal)
                flights.AddRange(await GetExternalFlights(universal));
            //return mock.GetFlights();
            return flights;
        }

        public async Task<List<Flight>> GetExternalFlights(DateTime relative_to)
        {
            HttpClient client = new HttpClient();
            List<Flight> flights = new List<Flight>();
            foreach(Server server in _serversDataBase.GetAllValues())
            {
                string uri = server.Url + "/api/Flights?relative_to=" + relative_to.ToString("yyyy-MM-ddTHH:mm:ssZ");
                HttpResponseMessage response = await client.GetAsync(uri);
                if (response.IsSuccessStatusCode)
                {
                    string flightsString = await response.Content.ReadAsStringAsync();
                    flights.AddRange(JsonConvert.DeserializeObject<List<Flight>>(flightsString));
                }
            }
            return flights;
        }

        // DELETE: api/Flights/id
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            _flightPlansDataBase.DeleteById(id);
            return Ok("Flight With ID: " + id + " Has Been Deleted");
        }
    }
}
