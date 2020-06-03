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
            if (servers.ContainsKey(toAdd.Id))
                return;
            servers.Add(toAdd.Id, toAdd);
        }

        public void DeleteById(string id)
        {
            servers.Remove(id);
        }

        public IEnumerable<Server> GetAllValues()
        {
            if (servers.Values.Count == 0)
                return new List<Server>();
            List<Server> values = servers.Values.Cast<Server>().ToList();
            return values;
        }

        public IEnumerable<string> GetAllKeys()
        {
            if (servers.Keys.Count == 0)
                return new List<string>();
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
