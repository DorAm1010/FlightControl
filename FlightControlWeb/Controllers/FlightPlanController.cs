using FlightControlWeb.DataBase;
using FlightControlWeb.Model;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace FlightControlWeb.Controllers
{
    [Route("api/FlightPlan")]
    [ApiController]
    public class FlightPlanController : ControllerBase
    {
        //MockFlightPlanDB mdb = new MockFlightPlanDB();
        private IDataBase<string, FlightPlan> _dataBase;
        private IIdToServer<string, string> _idToServer;
        
        public FlightPlanController(IDataBase<string, FlightPlan> dataBase,IIdToServer<string, string> idToServer)
        {
            _dataBase = dataBase;
            _idToServer = idToServer;
        }

        // GET: api/FlightPlan/{flight_id_format}
        [HttpGet("{id}", Name = "Get")]
        public async Task<FlightPlan> Get(string id)
        {
            //return mdb.Get(id);
            FlightPlan plan = _dataBase.GetById(id);
            if (plan != null)
                return plan;
            string externalUrl = _idToServer.Get(id);
            plan = await GetExternalFlightPlan(id, externalUrl);
            return plan;
        }

        private async Task<FlightPlan> GetExternalFlightPlan(string id, string serverUrl)
        {
            HttpClient client = new HttpClient();
            string url = serverUrl + "/api/FlightPlan/" + id;
            HttpResponseMessage response = await client.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                string flightsString = await response.Content.ReadAsStringAsync();
                FlightPlan plan = JsonConvert.DeserializeObject<FlightPlan>(flightsString);
                return plan;
            }
            return null;
        }

        // GET: api/FlightPlan/id/locations
        [HttpGet("locations/{id}", Name = "GetDestinationAndLandingTime")]
        public async Task<List<string>> GetDestinationAndLandingTime(string id)
        {
            List<string> locations = new List<string>();
            int totalFlightInSeconds = 0;
            FlightPlan plan = _dataBase.GetById(id);
            if (plan == null)
                plan = await GetExternalFlightPlan(id, _idToServer.Get(id));
            if (plan == null)
                return null;

            List<Segment> segments = plan.Segments;
            int lastSegment = segments.Count() - 1;
            
            locations.Add(segments[lastSegment].Longitude.ToString());
            locations.Add(segments[lastSegment].Latitude.ToString());


            for (int i = 0; i < segments.Count; i++)
                totalFlightInSeconds += segments[i].TimeSpan;

            DateTime landingTime = plan.InitialLocation.DateTime.AddSeconds(totalFlightInSeconds);
            
            locations.Add(landingTime.ToString("yyyy-MM-ddTHH:mm:ssZ"));

            return locations;
        }

        // POST: api/FlightPlan
        [HttpPost]
        public IActionResult Post(Object value)
        {
            var json = value.ToString();
            FlightPlan flightPlan = JsonConvert.DeserializeObject<FlightPlan>(json);
            try
            {
                _dataBase.Add(flightPlan);
            } catch (NullReferenceException)
            {
                return BadRequest("Please Check Input File!");
            }
            return Ok("Flight Plan With ID " + flightPlan.HashId() + " Has Been Added To DataBase");
        }
    }
}
