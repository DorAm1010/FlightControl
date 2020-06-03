using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FlightControlWeb.DataBase
{
    public interface IIdToServer<K, V>
    {
        void Add(K id, V server);
        V Get(K id);
    }
}
