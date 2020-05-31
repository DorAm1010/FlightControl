using FlightControlWeb.DataBase;
using FlightControlWeb.Model;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;

namespace FlightControlWeb.Controllers
{
    [Route("api/FlightPlan")]
    [ApiController]
    public class FlightPlanController : ControllerBase
    {
        private IDataBase<string, FlightPlan> _dataBase;
        public FlightPlanController(IDataBase<string, FlightPlan> dataBase)
        {
            _dataBase = dataBase;
        }

        // GET: api/FlightPlan/{flight_id_format}
        [HttpGet("{id}", Name = "Get")]
        public FlightPlan Get(string id)
        {
            return _dataBase.GetById(id);
        }

        // GET: api/FlightPlan/id/locations
        [HttpGet("locations/{id}")]
        public List<double> GetSourceAndDestination(string id)
        {
            List<double> locations = new List<double>();
            FlightPlan plan = _dataBase.GetById(id);
            int lastSegment = plan.Segments.Count() - 1;

            locations.Add(plan.InitialLocation.Longitude);
            locations.Add(plan.InitialLocation.Latitude);
            locations.Add(plan.Segments[lastSegment].Longitude);
            locations.Add(plan.Segments[lastSegment].Latitude);

            return locations;
        }

        // POST: api/FlightPlan
        [HttpPost]
        public IActionResult Post(Object value)
        {
            var json = value.ToString();
            FlightPlan flightPlan = JsonConvert.DeserializeObject<FlightPlan>(json);
            
            _dataBase.Add(flightPlan);
            if (_dataBase.GetById(flightPlan.HashId()) == null)
                return BadRequest(value);
            
            return Ok(value);
        }
    }
}
