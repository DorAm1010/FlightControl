using FlightControlWeb.Model;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

namespace FlightControlWeb.DataBase
{
    public class FlightPlansDB : IDataBase<string, FlightPlan>
    {
        // hash table for thread safety
        private Hashtable hashtable = new Hashtable();

        public void Add(FlightPlan toAdd)
        {
            hashtable.Add(toAdd.HashId(), toAdd);
        }

        public void DeleteById(string id)
        {
            hashtable.Remove(id);
        }

        public IEnumerable<FlightPlan> GetAllValues()
        {
            List<FlightPlan> values = hashtable.Values.Cast<FlightPlan>().ToList();
            return values;
        }

        public IEnumerable<string> GetAllKeys()
        {
            List<string> values = hashtable.Keys.Cast<string>().ToList();
            return values;
        }

        public FlightPlan GetById(string id)
        {
            return (FlightPlan)hashtable[id];
        }

/*        public string HashId(FlightPlan plan)
        {
            // get hash code of initial location and date and convert it to hexaecimal representation
            int locationHash = (plan.InitialLocation.Longitude + plan.InitialLocation.Latitude).GetHashCode();
            int dateHash = plan.InitialLocation.DateTime.GetHashCode();
            int hash = dateHash + locationHash;
            // get uppercase hexadecimal representation
            string idCode = hash.ToString("X");
            // get all capital letters from company name
            string idLetters = string.Concat(plan.CompanyName.Where(capital => capital >= 'A' && capital <= 'Z'));
            string flightId = idLetters + idCode;
            
            // if id is longer than 10 characters
            if (flightId.Length > 10)
                flightId = flightId.ToCharArray().Take(10).ToString();
            return flightId;
        }*/
    }
}
