using FlightControlWeb.DataBase;
using FlightControlWeb.Model;
using Microsoft.AspNetCore.Mvc;

namespace FlightControlWeb.Controllers
{

    [Route("api/[controller]")]
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

        // POST: api/FlightPlan
        [HttpPost]
        public IActionResult Post([FromBody] FlightPlan value)
        {
            _dataBase.Add(value);
            return Ok(value);
        }

        // DELETE: api/ApiWithActions/{flight_id_format}
        //[HttpDelete("{id}")]
        //public IActionResult Delete(string id)
        //{
        //_dataBase.DeleteById(id);
        //  return Ok(id);
        //}
    }
}
