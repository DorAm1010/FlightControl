using FlightControlWeb.Model;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace FlightControlWeb.DataBase
{
    public class FlightPlansDB : IDataBase<string, FlightPlan>
    {
        // hash table for thread safety + O(1) time complx for get
        private Hashtable hashtable = new Hashtable();

        public void Add(FlightPlan toAdd)
        {
            hashtable.Add(toAdd.HashId(), toAdd);
        }

        public void DeleteById(string id)
        {
            if (hashtable.ContainsKey(id))
                hashtable.Remove(id);
        }

        public IEnumerable<FlightPlan> GetAllValues()
        {
            if (hashtable.Values.Count == 0)
                return new List<FlightPlan>();
            List<FlightPlan> values = hashtable.Values.Cast<FlightPlan>().ToList();
            return values;
        }

        public IEnumerable<string> GetAllKeys()
        {
            if (hashtable.Keys.Count == 0)
                return new List<string>();
            List<string> values = hashtable.Keys.Cast<string>().ToList();
            return values;
        }

        public FlightPlan GetById(string id)
        {
            if (hashtable.ContainsKey(id))
                return (FlightPlan)hashtable[id];
            return null;
        }
    }
}
