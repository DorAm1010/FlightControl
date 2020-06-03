using System.Collections;

namespace FlightControlWeb.DataBase
{
    public class IdToServerImp : IIdToServer<string, string>
    {
        private Hashtable hashtable = new Hashtable();
        public void Add(string id, string serverUrl)
        {
            if (hashtable.ContainsKey(id))
                return;
            hashtable.Add(id, serverUrl);
        }

        public string Get(string id)
        {
            if(hashtable.ContainsKey(id)) return (string)hashtable[id];
            return null;
        }
    }
}
