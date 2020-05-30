using FlightControlWeb.Model;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace FlightControlWeb.DataBase
{
    public class ServersDB : IDataBase<string, Server>
    {
        private Hashtable servers = new Hashtable();
        public void Add(Server toAdd)
        {
            servers.Add(toAdd.Id, toAdd);
        }

        public void DeleteById(string id)
        {
            servers.Remove(id);
        }

        public IEnumerable<Server> GetAllValues()
        {
            List<Server> values = servers.Values.Cast<Server>().ToList();
            return values;
        }

        public IEnumerable<string> GetAllKeys()
        {
            List<string> keys = servers.Keys.Cast<string>().ToList();
            return keys;
        }

        public Server GetById(string id)
        {
            if(servers.ContainsKey(id))
                return (Server)servers[id];
            return null;
        }
    }
}
