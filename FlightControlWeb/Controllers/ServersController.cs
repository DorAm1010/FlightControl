using System.Collections.Generic;
using FlightControlWeb.DataBase;
using FlightControlWeb.Model;
using Microsoft.AspNetCore.Mvc;

namespace FlightControlWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServersController : ControllerBase
    {
        private IDataBase<string, Server> _dataBase;
        public ServersController(IDataBase<string, Server> dataBase)
        {
            _dataBase = dataBase;
        }

        // GET: api/servers
        [HttpGet]
        public IEnumerable<Server> Get()
        {
            return _dataBase.GetAllValues();
        }

        // POST: api/servers
        [HttpPost]
        public IActionResult Post([FromBody] Server value)
        {
            _dataBase.Add(value);
            if (_dataBase.GetById(value.Id) != null)
                return Ok(value);
            return StatusCode(500);
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            _dataBase.DeleteById(id);
            var deleted = _dataBase.GetById(id);
            if (deleted == null)
                return Ok();
            return StatusCode(500);
        }
    }
}
