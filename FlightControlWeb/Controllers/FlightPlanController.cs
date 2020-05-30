using FlightControlWeb.DataBase;
using FlightControlWeb.Model;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
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

        // api/FlightPlan?destination

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
